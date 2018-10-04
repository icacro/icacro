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
const maxlength = 40;
let nextPageEl,currentPageEl,nextUrl;
let pageCount = 1;
const pageWrapper = document.getElementById('page-wrapper');
const originalUrl = window.location.pathname;

//buggar?
//tracking!

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
    const page = document.getElementById('page');
    const urlParts = currentUrl.split('/');
    const nameParts = urlParts[2].split('-');
    const recipeId = nameParts[nameParts.length - 1];

    page.setAttribute('data-id',recipeId);
    page.setAttribute('data-count',1)

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
        pageWrapper.html(sessionStorage.prevPageWrapper);
        if (pageWrapper.querySelector('#page .loading-area')) {
          pageWrapper.querySelector('#page .loading-area').classList.remove('initiated');
        }
        sessionStorage.prevPageWrapper = '';
        sessionStorage.prevPage = originalUrl;
        pageCount = document.querySelectorAll('.page').length;
      }
    }

    if(pageCount === 1) {
      test.gotoPage(page,page,currentUrl);
    } else {
      const prevPage = document.getElementById('page');
      currentPageEl = document.getElementById('page-next');
      const relatedList = document.querySelectorAll('.related-recipes-list > a');
      test.buildRecipesArr(relatedList);
      nextUrl = recipesArr[pageCount];
      if (pageCount < maxlength) {
        recipe.initRecipe(currentPageEl,currentUrl,prevPage,pageCount,originalUrl);

        const loadingArea = test.buildLoadingArea();
        page.appendChild(loadingArea);

        nextPageEl = document.createElement('div');
        nextPageEl.classList.add('page','page-mod-fullwidth','pl','recipepage','page-next');
        nextPageEl.id = 'page-next';
        nextPageEl.setAttribute('data-href',nextUrl);
        pageWrapper.appendChild(nextPageEl);

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
    currentPageEl = pageNext;
    const prevPage = page;
    const pages = document.querySelectorAll('.page');
    pageCount = pages.length;
    const title = currentPageEl.querySelector('h1').innerHTML;

    if (currentPageEl !== prevPage) {
      //meaning "not first page"
      //test.changeURL(title,currentUrl);
      recipe.initRecipe(currentPageEl,currentUrl,prevPage,pageCount,originalUrl);
    } else {
      //first page
      currentPageEl.setAttribute('data-count','1');
      currentPageEl.setAttribute('data-href',currentUrl);
    }

    if (pageCount >= maxlength) {
      //no more scrolling if max length is reached
      document.getElementById('page').classList.add('last-page');
      document.getElementById('footer').classList.add('visible');
    } else {

      //add next page
      nextPageEl = document.createElement('div');
      nextPageEl.classList.add('page','page-mod-fullwidth','pl','recipepage','page-next');
      nextPageEl.id = 'page-next';

      const relatedList = document.querySelectorAll('#page .related-recipes-list > a');
      test.buildRecipesArr(relatedList);

      if (recipesArr.length > 1) {

        nextUrl = recipesArr[recipesArr.indexOf(currentUrl)+1];

        const loadingArea = test.buildLoadingArea();
        page.appendChild(loadingArea);

        nextPageEl.setAttribute('data-href',nextUrl);
        pageWrapper.appendChild(nextPageEl);
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


  // changeURL(title,currentUrl) {
    //document.title = title;
    //history.replaceState(null, title, currentUrl);
    //history.pushState(stateObj, title, currentUrl);
  // },


  // changeActivePage(oldCur,newCur) {
  //   newCur.id = 'page';
  //   if(newCur.getElementsByTagName('h1')[0]) {
  //     const title=newCur.getElementsByTagName('h1')[0].innerHTML;
  //     test.changeURL(title,newCur.getAttribute('data-href'));
  //   } else {
  //     console.log('changeURL failed');
  //   }
  // },


  scrollListener(nextUrl,pageCount) {
    if (pageCount < maxlength && recipesArr.length > 1 && document.getElementById('page')) {
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

        console.log(currentPageEl.querySelector('.loading-area').classList);

        const pageLoadingArea = currentPageEl.querySelector('.loading-area').classList;

         if (!pageLoadingArea.contains('initiated')) {

          pageLoadingArea.add('initiated');

            window.setTimeout(function () {
              if (nextPageEl.querySelector('h1')) {
                //activate new page
                test.gotoPage(nextPageEl,currentPageEl,nextUrl);
                pageLoadingArea.add('added');
              } else {
                const config = { attributes: false, childList: true, subtree: false };
                let pageObserver = new MutationObserver(function(mutations) {
                 for (var i = 0; i < mutations.length; i++) {
                   test.gotoPage(nextPageEl,currentPageEl,nextUrl);
                   pageLoadingArea.add('added');
                   pageObserver.disconnect();
                 }
                });
                pageObserver.observe(document.getElementById('page-next'), config);
                window.setTimeout(function () {
                  if (nextPageEl.querySelector('h1')) {
                    console.log('page exists...');
                    test.gotoPage(nextPageEl,currentPageEl,nextUrl);
                    pageLoadingArea.add('added');
                  } else {
                    console.log('page does not exist...');
                    test.loadingFailed(cur);
                  }
                }, 3000);
              }
            }, 50);

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
      //test.changeActivePage(cur, cur.previousSibling);
    } else {
      cur.id = 'page-2';
      //test.changeActivePage(cur, document.getElementById('page-1'));
    }
  },


  goToNextPage(cur) {
    if (cur.nextSibling.id && cur.nextSibling.id !== 'page-next' && cur.nextSibling.id !== 'page') {
      if (cur.getAttribute('data-count') > 1) {
        if ((parseInt(cur.getAttribute('data-count')) + 1) <= document.querySelectorAll('.page:not(#page-next)').length) {
          cur.id = 'page-' + cur.getAttribute('data-count');
          //test.changeActivePage(cur, cur.nextSibling);
        }
      }
    } else if (cur.nextSibling.id !== 'page-next' && cur.nextSibling.id !== 'page' && document.querySelectorAll('.page:not(#page-next)').length > 1) {
      document.querySelector('#page-wrapper .page:first-child').id = 'page-1';
      //test.changeActivePage(cur, document.querySelector('#page-wrapper .page:nth-child(2)'));
    }
  },


  scrollToElement(elem) {
    const elPosition = document.getElementById(elem).offsetTop;
    $('html,body').animate({
			 scrollTop: elPosition
		}, 400);
  },


  loadingFailed(cur) {
    console.log('loading failed');
    //document.querySelector('#page .loading-area').classList.add('reload');
    cur.classList.add('last-page');
    document.getElementById('footer').classList.add('visible');
    //document.querySelector('#page .loading-area .loading-area-title').innerHTML = '<a href="/recept/">Ny text</a>';
  },


  buildLoadingArea() {
    const loadingAreaContent = document.createElement('div');
    loadingAreaContent.classList.add('loading-area-content');
    const loadingAreaTitle = document.createElement('p');
    loadingAreaTitle.classList.add('loading-area-title');
    const loadingArea = document.createElement('div');
    loadingArea.classList.add('loading-area');
    loadingAreaContent.appendChild(loadingAreaTitle);
    loadingArea.appendChild(loadingAreaContent);
    return loadingArea;
  }

};


$(document).ready(() => {
  Object.assign(test, CROUTIL());
  test.manipulateDom();
});
