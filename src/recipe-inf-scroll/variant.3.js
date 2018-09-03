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
import './style-iframe.css';
import recipe from './recipe.js';

const maxlength = 25;
const pageWrapper = ELM.get('#page-wrapper');
let recipesArr = [];
let nextPageEl,currentPageEl,nextUrl,pageCount;

const test = {

  manipulateDom() {
    const currentUrl = window.location.pathname;
    currentPageEl = ELM.get('#page');
    nextPageEl = currentPageEl;

    currentPageEl.attr('data-count',1).css('page-active');
    recipesArr.push(currentUrl);
    test.addLoadingArea();
    test.gotoPage(currentPageEl,nextPageEl,currentUrl);

  },

  addLoadingArea() {
    const loadingAreaTitle = ELM.create('p loading-area-title');
    const loadingArea = ELM.create('div loading-area');
    loadingArea.append(loadingAreaTitle);
    pageWrapper.append(loadingArea);
  },

  buildRecipeArr(pageId) {
    let relatedList;
    if (pageId === 'page') {
      relatedList = document.querySelectorAll('#page .related-recipes-list > a');
    } else {
      relatedList = document.getElementById(pageId).contentWindow.document.querySelectorAll('#page .related-recipes-list > a');
    }
    if (recipesArr.length < maxlength) {
      for (var i = 0; i < relatedList.length; i++) {
        recipesArr.push(relatedList[i].getAttribute('href'));
      }
      recipesArr = test.removeDuplicates(recipesArr);
    }
  },

  gotoPage(currentPageEl,nextPageEl,currentUrl) {

    const prevPage = currentPageEl;
    const pages = document.querySelectorAll('.page');
    const pagePosition = currentPageEl.offsetTop;
    const svg = '<svg><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/Assets/icons/sprite.svg#arrow-down"></use></svg>';
    const arrow = '<div class="svg"><svg width="32px" height="32px"><use xlink:href="/Assets/icons/symbols.svg#arrow-down"></use></svg><span class="loader"></span></div>';

    const recipeId = test.getRecipeId(currentUrl);

    let pageType;

    pageCount = pages.length;

    if (pageCount >= maxlength) {
      //no more scrolling
      document.getElementById('footer').classList.add('visible');
    } else {
      if (currentPageEl.attr('id') === 'page') {
        pageType = 'start';
        currentPageEl.attr('data-id',recipeId);
        nextPageEl = test.addNext(currentPageEl,currentUrl,pageCount,recipeId,prevPage,pagePosition,pageType);
      } else {
        pageType = 'iframe';
        const title = 'temp';
        test.addLoadingArea();
        nextPageEl = test.addNext(currentPageEl,currentUrl,pageCount,recipeId,prevPage,pagePosition,pageType);
      }
    }

    $(window).on('scroll', _.debounce(function() {
      test.scrollListener(nextPageEl,nextUrl,currentPageEl);
    }, 10));

  },

  addNext(currentPageEl,currentUrl,pageCount,recipeId) {

    test.buildRecipeArr(currentPageEl.attr('id'));

    nextUrl = recipesArr[recipesArr.indexOf(currentUrl)+1];
    nextPageEl = ELM.create('iframe page recipe-scroll loading').attr('src',nextUrl).attr('id','page-' + pageCount).attr('name','recipe-scroll').attr('data-id',recipeId);

    pageWrapper.append(nextPageEl);

    return nextPageEl;

  },

  getRecipeId(currentUrl) {
    const urlParts = currentUrl.split('/');
    const nameParts = urlParts[2].split('-');
    const recipeId = nameParts[nameParts.length - 1];
    return recipeId;
  },

  removeDuplicates(recipesArr){
    recipesArr = Array.from(new Set(recipesArr))
    return recipesArr
  },

  // loadNextPage(url) {
  //   var request = new XMLHttpRequest();
  //   request.open('GET', url, true);
  //   request.onload = function() {
  //     if (request.status >= 200 && request.status < 400) {
  //       const resp = request.responseText;
  //       const parser = new DOMParser();
  //       const xmlDoc = parser.parseFromString(resp,"text/html");
  //       const tds = xmlDoc.getElementById("page");
  //       //const recipeinfo = xmlDoc.querySelector('script[type="application/ld+json"]');
  //       const arrow = '<div class="svg"><svg width="32px" height="32px"><use xlink:href="/Assets/icons/symbols.svg#arrow-down"></use></svg><span class="loader"></span></div>';
  //       const pageNext = document.getElementById('page-next');
  //       pageNext.innerHTML=tds.innerHTML;
  //       //document.querySelector('script[type="application/ld+json"]').innerHTML = recipeinfo.innerHTML;
  //       document.querySelector('#page .loading-area .loading-area-title').innerHTML=title + arrow;
  //       if (tds.classList.contains('recipepage--large')) {
  //         pageNext.classList.add('recipepage--large');
  //       } else {
  //         pageNext.classList.add('recipepage--small');
  //       }
  //       pageNext.querySelector('#ingredients-section > div.button').classList.add('button--secondary');
  //     } else {
  //       //felhantering?
  //     }
  //   };
  //   request.onerror = function() {
  //     //felhantering?
  //   };
  //   request.send();
  // },

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

  scrollListener(nextPageEl,nextUrl,currentPage) {
    if (document.querySelector('.page-active')) {
      const cur = document.querySelector('.page-active');
      const pageHeight = cur.offsetHeight;
      const startPos = cur.offsetTop;
      const endPos = startPos + pageHeight + (window.innerHeight * 0.4);
      const currentPos = window.pageYOffset + window.innerHeight;

      console.log(currentPos + ' / ' + endPos);

      if (currentPos === endPos) {
        if (nextPageEl.hasClass('loading')) {
          nextPageEl.css('active').css('page-active').removeClass('loading');
          currentPageEl.css('prev').removeClass('page-active').removeClass('active');
          window.setTimeout(function () {
             //activate new page
             test.gotoPage(nextPageEl,currentPageEl,nextUrl);
          }, 500);
        }
      }
    }
  },

  goToPrevPage(cur) {
    if (cur.getAttribute('data-count') > 2) {
      //cur.id = 'page-' + cur.getAttribute('data-count');
      //test.changeActivePage(cur, cur.previousSibling);
    } else {
      //cur.id = 'page-2';
      //test.changeActivePage(cur, document.getElementById('page-1'));
    }
  },

  goToNextPage(cur) {
    if (cur.nextSibling.id && cur.nextSibling.id !== 'page-next' && cur.nextSibling.id !== 'page') {
      if (cur.getAttribute('data-count') > 1) {
        if ((parseInt(cur.getAttribute('data-count')) + 1) <= document.querySelectorAll('.page:not(#page-next)').length) {
          //cur.id = 'page-' + cur.getAttribute('data-count');
          //test.changeActivePage(cur, cur.nextSibling);
        }
      }
    } else if (cur.nextSibling.id !== 'page-next' && cur.nextSibling.id !== 'page' && document.querySelectorAll('.page:not(#page-next)').length > 1) {
      //document.querySelector('#page-wrapper .page:first-child').id = 'page-1';
      //test.changeActivePage(cur, document.querySelector('#page-wrapper .page:nth-child(2)'));
    }
  },

  scrollToElement(elem) {
    const elPosition = document.getElementById(elem).offsetTop;
    $('html,body').animate({
			 scrollTop: elPosition
		}, 400);
  },

  manipulateFrameDom() {
    ELM.get('body').css('cro-frame').removeClass('cro');
  }

};

$(document).ready(() => {
  Object.assign(test, CROUTIL());
  if (window.self === window.top) {
    test.manipulateDom();
  } else if (window.frameElement.getAttribute('name') === 'recipe-scroll') {
    test.manipulateFrameDom();
  }
});
