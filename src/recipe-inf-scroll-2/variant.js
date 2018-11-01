// ==UserScript==
// @name         recipe-toggle-ingredients
// @path         //./src/recipe-inf-scroll/variant.js
// @namespace    http://tampermonkey.net/
// @version      0.1
// @match        https://www.ica.se/recept/*
// @grant        none
// ==/UserScript==

'use strict';

import { CROUTIL } from '../util/main';
import { gaPush } from '../util/utils';
import './style.css';
import recipe from './recipe.js';

let recipesArr = [];
const maxlength = 50;
let currentPageEl,nextPageEl,nextUrl;
let pageCount = 1;
const pageWrapper = document.getElementById('page-wrapper');
const originalUrl = window.location.pathname;

const test = {

  manipulateDom() {
    //only on first/full page

    //if page is loaded with an action parameter
    const hash = window.location.hash;
    if (hash === '#recept') {
      const el = document.querySelector('#page .recipe-content');
      recipe.triggerAction('scroll','#recept',el);
    } else if (hash === '#betyg') {
      const el = document.querySelector('#page .js-recipe-ratings-modal');
      recipe.triggerAction('click','#betyg',el);
    } else if (hash === '#spara') {
      const el = document.querySelector('#page .button--heart');
      recipe.triggerAction('click','#spara',el);
    } else if (hash === '#skriv-ut') {
      const el = document.querySelector('#page .button--print');
      recipe.triggerAction('click','#skriv-ut',el);
    } else if (hash.indexOf('#portioner=') !== -1) {
      const el = document.querySelector('#page .js-servingspicker');
      const portions = hash.split('=')[1];
      recipe.triggerAction('select','#portioner=' + portions,el);
    }

    const currentUrl = originalUrl;
    const urlParts = currentUrl.split('/');
    const nameParts = urlParts[2].split('-');
    const recipeId = nameParts[nameParts.length - 1];

    currentPageEl = test.getCurrentEl();
    currentPageEl.setAttribute('data-count','1')

    recipesArr.push([currentUrl,currentPageEl.querySelector('h1').innerHTML]);

    if (sessionStorage.prevPage) {
      if (sessionStorage.prevPage === originalUrl && sessionStorage.prevPageWrapper !== '') {
        pageWrapper.innerHTML = sessionStorage.prevPageWrapper;
        if (pageWrapper.querySelector('.page:last-child .loading-area')) {
          pageWrapper.querySelector('.page:last-child .loading-area').removeClass('initiated');
        }
        sessionStorage.prevPageWrapper = '';
        sessionStorage.prevPage = originalUrl;
        pageCount = document.querySelectorAll('.page').length;
      }
    }

    if(pageCount === 1) {
      test.gotoPage(currentPageEl,currentPageEl,currentUrl);
    } else {
      const prevPage = document.getElementById('page-' + (pageCount - 1));
      currentPageEl = document.getElementById('page-next');

      const relatedList = document.querySelectorAll('.page .related-recipes-list > a');
      test.buildRecipesArr(relatedList);

      nextUrl = recipesArr[pageCount][0];

      if (pageCount < maxlength) {
        recipe.initRecipe(currentPageEl,currentUrl,prevPage,pageCount,originalUrl);
        const loadingArea = test.buildLoadingArea(recipesArr[pageCount][1]);
        currentPageEl.append(loadingArea);
        nextPageEl = document.createElement('div');
        nextPageEl.classList.add('page','page-mod-fullwidth','pl','recipepage','page-next');
        nextPageEl.id = 'page-next';
        nextPageEl.setAttribute('data-href',nextUrl);
        pageWrapper.appendChild(nextPageEl);
        //const titleEl = currentPageEl.querySelector('.loading-area .loading-area-title');
        test.loadNextPage(nextUrl,nextPageEl,loadingArea);
      } else {
        document.getElementById('page').classList.add('last-page');
        document.getElementById('footer').classList.add('visible');
      }
    }

    test.startListener();

  },


  getCurrentEl() {
    if (pageCount === 1) {
      currentPageEl = document.getElementById('page');
    } else {
      currentPageEl = document.getElementById('page-' + pageCount);
    }
    return currentPageEl;
  },


  startListener() {
    $(window).on('scroll', _.debounce(function() {
      test.scrollListener(nextUrl,pageCount);
    }, 5));
  },


  gotoPage(pageNext,page,currentUrl) {
    const prevPage = page;
    const pages = document.querySelectorAll('.page');
    pageCount = pages.length;

    if (pageCount > 1) {
      currentPageEl = pageNext;
      recipe.initRecipe(currentPageEl,currentUrl,prevPage,pageCount,originalUrl);
    } else {
      //first page
      currentPageEl.setAttribute('data-count','1');
      currentPageEl.setAttribute('data-href',currentUrl);
    }

    if (pageCount >= maxlength) {

      //no more scrolling if max length is reached
      currentPageEl.classList.add('last-page');
      document.getElementById('footer').classList.add('visible');

    } else {

      const relatedList = currentPageEl.querySelectorAll('.related-recipes-list > a');
      test.buildRecipesArr(relatedList);

      //build loading area
      const loadingArea = test.buildLoadingArea(recipesArr[pageCount][1]);

      //add next page
      nextPageEl = document.createElement('div');
      nextPageEl.classList.add('page','page-mod-fullwidth','pl','recipepage','page-next');
      nextPageEl.id = 'page-next';

      if (recipesArr.length > 1) {

        nextUrl = recipesArr[pageCount][0];
        currentPageEl.appendChild(loadingArea);
        nextPageEl.setAttribute('data-href',nextUrl);
        pageWrapper.appendChild(nextPageEl);
        //const titleEl = currentPageEl.querySelector('.loading-area .loading-area-title');
        test.loadNextPage(nextUrl,nextPageEl,loadingArea);

      } else {
        //hantera t.ex. https://www.ica.se/recept/kanel-och-stjarnanissill-599287/ som inte har relaterade recept
        currentPageEl.classList.add('last-page');
        document.getElementById('footer').classList.add('visible');
      }

    }

  },


  buildRecipesArr(relatedList) {
    if (recipesArr.length < maxlength) {
      for (var i = 0; i < relatedList.length; i++) {
        recipesArr.push([relatedList[i].getAttribute('href'),relatedList[i].querySelector('p.h4').innerHTML]);
      }
      recipesArr = removeDuplicates(recipesArr);
    }

    function removeDuplicates(recipesArr){
      var uniques = [];
      var itemsFound = {};
      for(var i = 0, l = recipesArr.length; i < l; i++) {
        var stringified = JSON.stringify(recipesArr[i]);
        if(itemsFound[stringified]) { continue; }
        uniques.push(recipesArr[i]);
        itemsFound[stringified] = true;
      }
      return uniques;
    }
  },


  buildLoadingArea(title) {
    const loadingAreaContent = document.createElement('div');
    loadingAreaContent.classList.add('loading-area-content');
    const loadingAreaTitle = document.createElement('p');
    loadingAreaTitle.classList.add('loading-area-title');
    loadingAreaTitle.innerHTML = '<span class="next-label">Nästa recept:</span><span class="title">' + title + '</span><div class="svg"><span class="loader"></span></div>';
    const loadingArea = document.createElement('div');
    loadingArea.classList.add('loading-area');
    loadingAreaContent.appendChild(loadingAreaTitle);
    loadingArea.appendChild(loadingAreaContent);
    return loadingArea;
  },


  loadNextPage(url,pageNext,loadingArea) {
    var request = new XMLHttpRequest();
    request.open('GET', 'https://www.ica.se' + url, true);
    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        const resp = request.responseText;
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(resp,"text/html");
        const tds = xmlDoc.getElementById("page");

        setTimeout(function () {

          pageNext.innerHTML=tds.innerHTML;

          let title = xmlDoc.title;

          title = '<span class="next-label">Nästa recept:</span><span class="title">' + title.substring(0, title.indexOf('|')) + '</span>';
          const loader = '<div class="svg"><span class="loader"></span></div>';

          if (!loadingArea.classList.contains('failed')) {
            loadingArea.querySelector('.loading-area-title').innerHTML=title + loader;

            if (tds.classList.contains('recipepage--large')) {
              pageNext.classList.add('recipepage--large');
            } else {
              pageNext.classList.add('recipepage--small');
            }
            pageNext.querySelector('#ingredients-section > div.button').classList.add('button--secondary');
          }

        }, 50);

      } else {
        test.loadingFailed();
      }
    };
    request.onerror = function() {
      test.loadingFailed();
    };
    request.send();
  },


  scrollListener(nextUrl,pageCount) {
    if (pageCount < maxlength && recipesArr.length > 1 && document.getElementById('page')) {
     const cur = currentPageEl;
     const pageHeight = cur.offsetHeight;
     const startPos = cur.offsetTop - 70;
     const endPos = startPos + pageHeight - 300;
     const currentPos = window.pageYOffset + window.innerHeight;
     const loadingArea = cur.querySelector('.loading-area');
     if (currentPos > endPos) {

       if(window.scrollY + window.innerHeight >= document.body.scrollHeight - 300) {

         if (!loadingArea.classList.contains('initiated')) {

          loadingArea.classList.add('initiated');

            window.setTimeout(function () {
              if (!loadingArea.classList.contains('failed')) {
                if (nextPageEl.querySelector('h1')) {
                  //activate new page
                  test.gotoPage(nextPageEl,currentPageEl,nextUrl);
                  loadingArea.classList.add('added');
                } else {
                  const config = { attributes: false, childList: true, subtree: true };
                  let pageObserver = new MutationObserver(function(mutations) {
                   for (var i = 0; i < mutations.length; i++) {
                     if (!loadingArea.classList.contains('failed')) {
                       test.gotoPage(nextPageEl,currentPageEl,nextUrl);
                       loadingArea.classList.add('added');
                     }
                     pageObserver.disconnect();
                   }
                  });
                  pageObserver.observe(document.getElementById('page-next'), config);
                  window.setTimeout(function () {
                    if (!loadingArea.classList.contains('failed')) {
                      if (nextPageEl.querySelector('h1')) {
                        test.gotoPage(nextPageEl,currentPageEl,nextUrl);
                        loadingArea.classList.add('added');
                        pageObserver.disconnect();
                      } else {
                        pageObserver.disconnect();
                        test.loadingFailed();
                      }
                    }
                  }, 5000);
                }
              }
            }, 1000);

         }
       }
     }
   }
  },

  loadingFailed() {
    const loadingArea = currentPageEl.querySelector('.loading-area');
    loadingArea.classList.add('failed');
    loadingArea.querySelector('.next-label').innerHTML = 'Vi lyckades tyvärr inte ladda';
    loadingArea.querySelector('.svg').remove();
    const reloadEl = document.createElement('p');
    reloadEl.innerHTML = '<a href="' + nextPageEl.getAttribute('data-href') + '">Prova igen</a>';
    loadingArea.append(reloadEl);
    document.querySelector('footer').classList.add('visible');
    gaPush({ eventAction: 'Inf-scroll: nytt recept', eventLabel: 'failed' });
  },

};


$(document).ready(() => {
  Object.assign(test, CROUTIL());
  test.manipulateDom();
});
