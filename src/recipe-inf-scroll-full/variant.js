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
const maxlength = 25;
let nextPage,currentPage,nextUrl;

const test = {

  manipulateDom() {

    const currentUrl = window.location.pathname;
    const page = ELM.get('#page');
    const pageNext = page;
    page.attr('data-count',1)

    recipesArr.push(currentUrl);

    //bättre placering för dessa?
    const urlParts = currentUrl.split('/');
    const nameParts = urlParts[2].split('-');
    const recipeId = nameParts[nameParts.length - 1];
    page.attr('data-id',recipeId);

    test.gotoPage(pageNext,page,currentUrl);

  },

  gotoPage(pageNext,page,currentUrl) {
    const pageWrapper = ELM.get('#page-wrapper');

    currentPage = pageNext;
    const prevPage = page;
    const pages = document.querySelectorAll('.page');
    const pageCount = pages.length;

    if (currentPage.find('h1').exist()) {

      const loadingAreaTitle = ELM.create('p loading-area-title');
      const loadingArea = ELM.create('div loading-area');
      loadingArea.append(loadingAreaTitle);
      const title  = currentPage.find('h1').text();
      const pagePosition = currentPage.offsetTop;
      const svg = '<svg><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/Assets/icons/sprite.svg#arrow-down"></use></svg>';

      recipe.initRecipe(currentPage);

      if (pageCount >= maxlength) {
        //no more scrolling
        document.getElementById('footer').classList.add('visible');
      } else {
        //add next page
        nextPage = ELM.create('div page page-mod-fullwidth pl recipepage').attr('id','page-next');
        if (recipesArr.length < maxlength) {
          const relatedList = document.querySelectorAll('#page .related-recipes-list > a');
          for (var i = 0; i < relatedList.length; i++) {
            recipesArr.push(relatedList[i].getAttribute('href'));
          }
          recipesArr = test.removeDuplicates(recipesArr);
        }
        nextUrl = recipesArr[recipesArr.indexOf(currentUrl)+1];
        test.loadNextPage(nextUrl);
        currentPage.append(loadingArea);
        nextPage.attr('data-href',nextUrl);
        pageWrapper.append(nextPage);
      }

      if (currentPage !== prevPage) {
        //meaning "not first page" - fix id:s,attrs,url etc
        currentPage.attr('id','page');
        prevPage.attr('id','page-' + prevPage.attr('data-count'));
        test.changeURL(pagePosition,title,currentUrl);
        currentPage.attr('data-count',pageCount);

        const buyBtnId = 'IcaOnlineBuyButton-' + prevPage.attr('data-count');
        if (prevPage.find('.icaOnlineBuyButton.buy-active').exist()) {
          prevPage.find('.icaOnlineBuyButton.buy-active').removeClass('buy-active');
        }
        currentPage.find('#IcaOnlineBuyButton').attr('id',buyBtnId).css('buy-active');

        const urlParts = currentPage.attr('data-href').split('/');
        const nameParts = urlParts[2].split('-');
        const recipeId = nameParts[nameParts.length - 1];
        currentPage.attr('data-id',recipeId);
        recipe.buyBtn(buyBtnId,recipeId);

      } else {
        //first page
        currentPage.attr('data-count','1');
        currentPage.attr('data-href',currentUrl);
      }

      $(window).on('scroll', _.debounce(function() {
        test.scrollListener(loadingArea,nextPage,nextUrl,currentPage,pageCount);
      }, 200));

      $('body').on('click','.page .loading-area.added .loading-area-title', function() {
        const elem = $(this).closest('.page').next().attr('id');
        test.scrollToElement(elem);
      });

    } else {
      document.querySelector('#page .loading-area .loading-area-title').innerHTML='Vi lyckades tyvärr inte ladda nästa recept.<br><a href="' + currentPage.attr('data-href') + '">Prova igen!</a>';
      document.querySelector('#page .loading-area').classList.add('reload');
    }

  },

  removeDuplicates(recipesArr){
    recipesArr = Array.from(new Set(recipesArr))
    return recipesArr
  },

  loadNextPage(url) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        const resp = request.responseText;
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(resp,"text/html");
        const tds = xmlDoc.getElementById("page");
        //const recipeinfo = xmlDoc.querySelector('script[type="application/ld+json"]');
        const arrow = '<div class="svg"><svg width="32px" height="32px"><use xlink:href="/Assets/icons/symbols.svg#arrow-down"></use></svg><span class="loader"></span></div>';
        const pageNext = document.getElementById('page-next');
        let title = xmlDoc.title;
        title = '<span>Nästa recept:</span> ' + title.substring(0, title.indexOf('|'));
        pageNext.innerHTML=tds.innerHTML;
        //document.querySelector('script[type="application/ld+json"]').innerHTML = recipeinfo.innerHTML;
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

  changeURL(pagePosition,title,currentUrl) {
    const stateObj = { position: pagePosition };
    document.title = title;
    history.pushState(stateObj, title, currentUrl);
  },

  changeActivePage(oldCur,newCur) {
    newCur.id = 'page';
    test.changeURL('0',newCur.getElementsByTagName('h1')[0].innerHTML,newCur.getAttribute('data-href'));
    oldCur.querySelector('.icaOnlineBuyButton').classList.remove('buy-active');
    newCur.querySelector('.icaOnlineBuyButton').classList.add('buy-active');
    if (newCur.querySelector('.icaOnlineBuyButton').hasChildNodes()) {
      newCur.querySelector('.icaOnlineBuyButton').innerHTML='';
      recipe.buyBtn(newCur.querySelector('.icaOnlineBuyButton').id, newCur.getAttribute('data-id'));
    }
  },

  scrollListener(loadingArea,nextPage,nextUrl,currentPage,pageCount) {
    if (document.getElementById('page')) {
     const cur = document.getElementById('page');
     const pageHeight = cur.offsetHeight;
     const startPos = cur.offsetTop - 70;
     const endPos = startPos + pageHeight - 300;
     const currentPos = window.pageYOffset + window.innerHeight;
     if (currentPos < startPos) {
       //activate previous page
       test.goToPrevPage(cur);
     } else if (currentPos > endPos) {
       if(window.scrollY + window.innerHeight >= document.body.scrollHeight - 300) {
         if (!loadingArea.hasClass('added')) {
           loadingArea.css('added');
           window.setTimeout(function () {
             //activate new page
             test.gotoPage(nextPage,currentPage,nextUrl);
           }, 1000);
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

};

$(document).ready(() => {
  Object.assign(test, CROUTIL());
  if (window.self === window.top) {
    test.manipulateDom();
  }
});
