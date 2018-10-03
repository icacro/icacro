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
let nextPageElm,currentPageElm,nextUrl;
let pageCount = 1;
const pageWrapper = ELM.get('#page-wrapper');
const originalUrl = window.location.pathname;


//buggar?
//tracking!


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
    const urlParts = currentUrl.split('/');
    const nameParts = urlParts[2].split('-');
    const recipeId = nameParts[nameParts.length - 1];

    page.attr('data-id',recipeId);
    page.attr('data-count',1)

    recipesArr.push(currentUrl);

    // $('body').on('click','.page .loading-area.initiated .loading-area-title', function() {
    //   if ($(this).parent().hasClass('reload')) {
    //     console.log('has reload');
    //     const url = $(this).closest('.page').next().attr('data-href');
    //     window.location = url;
    //   } else {
    //     console.log('no reload');
    //     const elem = $(this).closest('.page').next().attr('id');
    //     test.scrollToElement(elem);
    //   }
    // });

    if (sessionStorage.prevPage) {
      if (sessionStorage.prevPage === originalUrl && sessionStorage.prevPageWrapper !== '') {
        console.log('prevpage: ' + sessionStorage.prevPage);
        pageWrapper.html(sessionStorage.prevPageWrapper);
        if (pageWrapper.find('#page .loading-area').exist()) {
          pageWrapper.find('#page .loading-area').removeClass('initiated');
        }
        sessionStorage.prevPageWrapper = '';
        sessionStorage.prevPage = originalUrl;
        pageCount = document.querySelectorAll('.page').length;
      } else {
        console.log('no prevpage: ' + sessionStorage.prevPage + ' / oUrl: ' + originalUrl);
      }
    }

    if(pageCount === 1) {
      test.gotoPage(page,page,currentUrl);
    } else {
      const prevPage = ELM.get('#page');
      currentPageElm = ELM.get('#page-next');
      const relatedList = document.querySelectorAll('.related-recipes-list > a');
      test.buildRecipesArr(relatedList);
      nextUrl = recipesArr[pageCount];
      if (pageCount < maxlength) {
        recipe.initRecipe(currentPageElm,currentUrl,prevPage,pageCount,originalUrl);
        const loadingAreaContent = ELM.create('div loading-area-content');
        const loadingAreaTitle = ELM.create('p loading-area-title');
        const loadingArea = ELM.create('div loading-area');
        loadingAreaContent.append(loadingAreaTitle);
        loadingArea.append(loadingAreaContent);
        currentPageElm.append(loadingArea);
        nextPageElm = ELM.create('div page page-mod-fullwidth pl recipepage page-next').attr('id','page-next');
        nextPageElm.attr('data-href',nextUrl);
        pageWrapper.append(nextPageElm);
        const nextPageEl = document.getElementById('page-next');
        const titleEl = document.querySelector('#page .loading-area .loading-area-title');
        test.loadNextPage(nextUrl,nextPageEl,titleEl);
      } else {
        document.getElementById('page').classList.add('last-page');
        document.getElementById('footer').classList.add('visible');
      }
    }

    test.startListener();

  },


  startListener() {
    $(window).on('scroll', _.debounce(function() {
      test.scrollListener(nextUrl,pageCount);
    }, 5));
  },


  gotoPage(pageNext,page,currentUrl) {
    currentPageElm = pageNext;
    const prevPage = page;
    const pages = document.querySelectorAll('.page');
    pageCount = pages.length;
    const title = currentPageElm.find('h1').text();

    if (currentPageElm !== prevPage) {
      //meaning "not first page"
      test.changeURL(title,currentUrl);
      recipe.initRecipe(currentPageElm,currentUrl,prevPage,pageCount,originalUrl);
    } else {
      //first page
      currentPageElm.attr('data-count','1');
      currentPageElm.attr('data-href',currentUrl);
    }

    //build loading area
    const loadingAreaContent = ELM.create('div loading-area-content');
    const loadingAreaTitle = ELM.create('p loading-area-title');
    const loadingArea = ELM.create('div loading-area');
    loadingAreaContent.append(loadingAreaTitle);
    loadingArea.append(loadingAreaContent);

    if (pageCount >= maxlength) {
      //no more scrolling if max length is reached
      document.getElementById('page').classList.add('last-page');
      document.getElementById('footer').classList.add('visible');
    } else {

      //add next page
      nextPageElm = ELM.create('div page page-mod-fullwidth pl recipepage page-next').attr('id','page-next');

      const relatedList = document.querySelectorAll('#page .related-recipes-list > a');
      test.buildRecipesArr(relatedList);

      if (recipesArr.length > 1) {

        nextUrl = recipesArr[recipesArr.indexOf(currentUrl)+1];
        currentPageElm.append(loadingArea);
        nextPageElm.attr('data-href',nextUrl);
        pageWrapper.append(nextPageElm);
        const nextPageEl = document.getElementById('page-next');
        const titleEl = document.querySelector('#page .loading-area .loading-area-title');
        test.loadNextPage(nextUrl,nextPageEl,titleEl);

      } else {
        //hantera t.ex. https://www.ica.se/recept/kanel-och-stjarnanissill-599287/ som inte har relaterade recept
        document.getElementById('page').classList.add('last-page');
        document.getElementById('footer').classList.add('visible');
      }

    }

  },

  buildRecipesArr(relatedList) {

    if (recipesArr.length < maxlength) {
      for (var i = 0; i < relatedList.length; i++) {
        recipesArr.push(relatedList[i].getAttribute('href'));
      }
      recipesArr = removeDuplicates(recipesArr);
    }

    function removeDuplicates(recipesArr){
      recipesArr = Array.from(new Set(recipesArr))
      return recipesArr;
    }

  },

  loadNextPage(url,pageNext,loadingAreaTitle) {
    var request = new XMLHttpRequest();
    request.open('GET', 'https://www.ica.se' + url, true);
    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        const resp = request.responseText;
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(resp,"text/html");
        const tds = xmlDoc.getElementById("page");

        pageNext.innerHTML=tds.innerHTML;

        let title = xmlDoc.title;

        title = '<span class="next-label">Nästa recept:</span><span class="title">' + title.substring(0, title.indexOf('|')) + '</span>';
        const loader = '<div class="svg"><span class="loader"></span></div>';

        if (!loadingAreaTitle.classList.contains('reload')) {
          loadingAreaTitle.innerHTML=title + loader;

          if (tds.classList.contains('recipepage--large')) {
            pageNext.classList.add('recipepage--large');
          } else {
            pageNext.classList.add('recipepage--small');
          }
          pageNext.querySelector('#ingredients-section > div.button').classList.add('button--secondary');
        }
      } else {
        //felhantering?
        console.log('loading error 1');
      }
    };
    request.onerror = function() {
      //felhantering?
      console.log('loading error 2');
    };
    request.send();
  },


  changeURL(title,currentUrl) {
    document.title = title;
    history.replaceState(null, title, currentUrl);
    //history.pushState(stateObj, title, currentUrl);
  },


  changeActivePage(oldCur,newCur) {
    newCur.id = 'page';
    if(newCur.getElementsByTagName('h1')[0]) {
      const title=newCur.getElementsByTagName('h1')[0].innerHTML;
      test.changeURL(title,newCur.getAttribute('data-href'));
    } else {
      console.log('changeURL failed');
    }
  },


  scrollListener(nextUrl,pageCount) {
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

         if (!loadingArea.classList.contains('initiated')) {

          loadingArea.classList.add('initiated');

            window.setTimeout(function () {
              if (nextPageElm.find('h1').exist()) {
                //activate new page
                test.gotoPage(nextPageElm,currentPageElm,nextUrl);
                loadingArea.classList.add('added');
              } else {
                const config = { attributes: false, childList: true, subtree: true };
                let pageObserver = new MutationObserver(function(mutations) {
                 for (var i = 0; i < mutations.length; i++) {
                   test.gotoPage(nextPageElm,currentPageElm,nextUrl);
                   loadingArea.classList.add('added');
                   pageObserver.disconnect();
                 }
                });
                pageObserver.observe(document.getElementById('page-next'), config);
                // window.setTimeout(function () {
                //   if (!nextPageElm.find('h1').exist() && !loadingArea.classList.contains('added')) {
                //     test.loadingFailed();
                //     pageObserver.disconnect();
                //   }
                // }, 3000);
              }
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

  loadingFailed() {
    document.querySelector('#page .loading-area').classList.add('reload');
    document.getElementById('page').classList.add('last-page');
    document.getElementById('footer').classList.add('visible');
    document.querySelector('#page .loading-area .loading-area-title').innerHTML = '<a href="/recept/">Ny text</a>';
  },

};


$(document).ready(() => {
  Object.assign(test, CROUTIL());
  test.manipulateDom();
});
