// ==UserScript==
// @name         recipe-toggle-ingredients
// @path         //./src/recipe-inf-scroll/variant.js
// @namespace    http://tampermonkey.net/
// @version      0.1
// @match        https://www.ica.se/recept/*
// @grant        none
// ==/UserScript==

'use strict';

import { CROUTIL, ELM } from '../util/main';
import { triggerHotJar, gaPush } from '../util/utils';
import './style.css';
import recipe from './recipe.js';

let recipesArr = [];
const maxlength = 75;
let nextPage,currentPage,nextUrl;
let pageCount = 1;
const pageWrapper = ELM.get('#page-wrapper');
const originalUrl = window.location.pathname;
const originalTitle = window.title;

//Design
//Ngt i slutet av sidan?

const test = {

  manipulateDom() {
    //only on first/full page

    //if page is loaded with an action parameter
    const params = new Map(location.search.slice(1).split('&').map(kv => kv.split('=')));
    if (params.has('recept')) {
      const el = document.querySelector('#page .recipe-content');
      recipe.triggerAction('scroll','?recept',el);
    } else if (params.has('betyg')) {
      const el = document.querySelector('#page .js-recipe-ratings-modal');
      recipe.triggerAction('click','?betyg',el);
    } else if (params.has('spara')) {
      const el = document.querySelector('#page .button--heart');
      recipe.triggerAction('click','?spara',el);
    } else if (params.has('skriv-ut')) {
      const el = document.querySelector('#page .button--print');
      recipe.triggerAction('click','?skriv-ut',el);
    } else if (params.has('portioner')) {
      const el = document.querySelector('#page .js-servingspicker');
      const portions = params.get('portioner');
      recipe.triggerAction('select','?portioner=' + portions,el);
    }

    const currentUrl = originalUrl;
    const page = ELM.get('#page');
    const pageNext = page;
    const urlParts = currentUrl.split('/');
    const nameParts = urlParts[2].split('-');
    const recipeId = nameParts[nameParts.length - 1];

    page.attr('data-id',recipeId);
    page.attr('data-count',1)

    recipesArr.push(currentUrl);

    // recipe.hideComments(page);
    // recipe.hideNutrientsClimate(page);
    test.gotoPage(pageNext,page,currentUrl);

    $('body').on('click','.page .loading-area.added .loading-area-title', function() {
      if ($(this).parent().hasClass('reload')) {
        const url = $(this).closest('.page').next().attr('data-href');
        window.location = url;
      } else {
        const elem = $(this).closest('.page').next().attr('id');
        test.scrollToElement(elem);
      }
    });

    $(window).on('scroll', _.debounce(function() {
      test.scrollListener(nextPage,nextUrl,currentPage,pageCount);
    }, 50));

  },


  gotoPage(pageNext,page,currentUrl) {

    currentPage = pageNext;
    const prevPage = page;
    const pages = document.querySelectorAll('.page');
    pageCount = pages.length;

    if (currentPage.find('h1').exist()) {

      //build loading area
      const loadingAreaTitle = ELM.create('p loading-area-title');
      const loadingArea = ELM.create('div loading-area');
      loadingArea.append(loadingAreaTitle);
      const title  = currentPage.find('h1').text();
      const pagePosition = currentPage.offsetTop;
      const svg = '<svg><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/Assets/icons/sprite.svg#arrow-down"></use></svg>';

      if (pageCount >= maxlength) {
        //no more scrolling if max length is reached
        document.getElementById('footer').classList.add('visible');
      } else {

        //add next page
        nextPage = ELM.create('div page page-mod-fullwidth pl recipepage page-next').attr('id','page-next');
        if (recipesArr.length < maxlength) {
          const relatedList = document.querySelectorAll('#page .related-recipes-list > a');
          for (var i = 0; i < relatedList.length; i++) {
            recipesArr.push(relatedList[i].getAttribute('href'));
          }
          recipesArr = removeDuplicates(recipesArr);
        }

        function removeDuplicates(recipesArr){
          recipesArr = Array.from(new Set(recipesArr))
          return recipesArr
        }

        if (recipesArr.length > 1 && !loadingArea.hasClass('reload')) {
          nextUrl = recipesArr[recipesArr.indexOf(currentUrl)+1];
          test.loadNextPage(nextUrl);
          currentPage.append(loadingArea);
          nextPage.attr('data-href',nextUrl);
          pageWrapper.append(nextPage);
        } else {
          //hantera t.ex. https://www.ica.se/recept/kanel-och-stjarnanissill-599287/ som inte har relaterade recept
          document.getElementById('footer').classList.add('visible');
        }

      }

      if (currentPage !== prevPage) {
        //meaning "not first page"

        test.changeURL(title,currentUrl);
        if (currentUrl) {
          recipe.initRecipe(currentPage,currentUrl,prevPage,pageCount,originalTitle,originalUrl);
        } else {
          test.loadingFailed();
        }

      } else {
        //first page
        currentPage.attr('data-count','1');
        currentPage.attr('data-href',currentUrl);
      }

    } else {
      test.loadingFailed();
    }

  },

  loadNextPage(url) {
    var request = new XMLHttpRequest();
    request.open('GET', 'https://www.ica.se' + url, true);
    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        const resp = request.responseText;
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(resp,"text/html");
        const tds = xmlDoc.getElementById("page");

        const pageNext = document.getElementById('page-next');
        pageNext.innerHTML=tds.innerHTML;

        let title = xmlDoc.title;
        title = '<span class="next-label">Nästa recept:</span><span class="title">' + title.substring(0, title.indexOf('|')) + '</span>';
        const arrow = '<div class="svg"><svg width="32px" height="32px"><use xlink:href="/Assets/icons/symbols.svg#arrow-down"></use></svg><span class="loader"></span></div>';
        document.querySelector('#page .loading-area .loading-area-title').innerHTML=title + arrow;
        if (tds.classList.contains('recipepage--large')) {
          pageNext.classList.add('recipepage--large');
        } else {
          pageNext.classList.add('recipepage--small');
        }
        pageNext.querySelector('#ingredients-section > div.button').classList.add('button--secondary');
      } else {
        //felhantering?
      }
    };
    request.onerror = function() {
      //felhantering?
    };
    request.send();
  },


  changeURL(title,currentUrl) {
    document.title = title;
    //history.pushState(stateObj, title, currentUrl);
    history.replaceState(null, title, currentUrl);
  },


  changeActivePage(oldCur,newCur) {
    newCur.id = 'page';
    test.changeURL(newCur.getElementsByTagName('h1')[0].innerHTML,newCur.getAttribute('data-href'));
  },


  scrollListener(nextPage,nextUrl,currentPage,pageCount) {
    if (pageCount < maxlength && recipesArr.length > 1 && document.getElementById('page')) {
     const cur = document.getElementById('page');
     const pageHeight = cur.offsetHeight;
     const startPos = cur.offsetTop - 70;
     const endPos = startPos + pageHeight - 300;
     const currentPos = window.pageYOffset + window.innerHeight;
     const loadingArea = cur.querySelector('.loading-area');
     if (currentPos < startPos) {
       //activate previous page
       test.goToPrevPage(cur);
     } else if (currentPos > endPos) {
       if(window.scrollY + window.innerHeight >= document.body.scrollHeight - 300) {
         if (!loadingArea.classList.contains('added') && !loadingArea.classList.contains('reload')) {
           loadingArea.classList.add('added');
           window.setTimeout(function () {
             //activate new page
             if (!loadingArea.classList.contains('reload')) {
               test.gotoPage(nextPage,currentPage,nextUrl);
             }
           }, 1500);
         }
       } else {
         //activate next (but not new) page
         test.goToNextPage(cur);
       }
     }
   }
  },


  goToPrevPage(cur) {
    if (cur.getAttribute('data-count') > 2) {
      cur.id = 'page-' + cur.getAttribute('data-count');
      test.changeActivePage(cur, cur.previousSibling);
    } else {
      cur.id = 'page-2';
      test.changeActivePage(cur, document.getElementById('page-1'));
    }
  },


  goToNextPage(cur) {
    if (cur.nextSibling.id && cur.nextSibling.id !== 'page-next' && cur.nextSibling.id !== 'page') {
      if (cur.getAttribute('data-count') > 1) {
        if ((parseInt(cur.getAttribute('data-count')) + 1) <= document.querySelectorAll('.page:not(#page-next)').length) {
          cur.id = 'page-' + cur.getAttribute('data-count');
          test.changeActivePage(cur, cur.nextSibling);
        }
      }
    } else if (cur.nextSibling.id !== 'page-next' && cur.nextSibling.id !== 'page' && document.querySelectorAll('.page:not(#page-next)').length > 1) {
      document.querySelector('#page-wrapper .page:first-child').id = 'page-1';
      test.changeActivePage(cur, document.querySelector('#page-wrapper .page:nth-child(2)'));
    }
  },


  scrollToElement(elem) {
    const elPosition = document.getElementById(elem).offsetTop;
    $('html,body').animate({
			 scrollTop: elPosition
		}, 400);
  },

  loadingFailed() {
    document.querySelector('#page .loading-area').classList.add('reload');
    document.getElementById('footer').classList.add('visible');
  },

};


$(document).ready(() => {
  Object.assign(test, CROUTIL());
  test.manipulateDom();
});
