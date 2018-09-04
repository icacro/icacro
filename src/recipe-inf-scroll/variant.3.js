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
import './style-iframe2.css';
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
    currentPageEl.css('page-active');
    recipesArr.push(currentUrl);
    const recipeWrapper = ELM.create('div recipe-wrapper pl').attr('id','recipe-wrapper-0');
    const loadingArea = test.addLoadingArea(currentPageEl);
    pageWrapper.append(recipeWrapper.append(currentPageEl).append(loadingArea))
    test.gotoPage(currentPageEl,nextPageEl,currentUrl);
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
      document.getElementById('footer').classList.add('visible'); //no more scrolling
    } else {
      if (currentPageEl.attr('id') === 'page') {
        pageType = 'start';
        currentPageEl.attr('data-id',recipeId);
        nextPageEl = test.addNext(currentPageEl,currentUrl,pageCount,recipeId,prevPage,pagePosition,pageType);
      } else {
        pageType = 'iframe';
        const title = 'temp';
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
    const recipeWrapper = ELM.create('div recipe-wrapper pl').attr('id','recipe-wrapper-' + pageCount);
    const loadingArea = test.addLoadingArea(nextPageEl);
    pageWrapper.append(recipeWrapper.append(nextPageEl).append(loadingArea));
    return nextPageEl;
  },

  addLoadingArea(pageEl) {
    const loadingAreaTitle = ELM.create('p loading-area-title');
    const loadingArea = ELM.create('div loading-area');
    const arrow = '<div class="svg"><svg width="32px" height="32px"><use xlink:href="/Assets/icons/symbols.svg#arrow-down"></use></svg><span class="loader"></span></div>';
    loadingArea.append(loadingAreaTitle.append('<span class="lheader">Laddar...</span><p class="rname">&nbsp;</p>' + arrow));

    loadingAreaTitle.click((e) => {
      test.scrollToElement(loadingAreaTitle.parent().parent().next().attr('id'));
    });

    return loadingArea;
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

  changeURL(pagePosition,title,currentUrl) {
    const stateObj = { position: pagePosition };
    document.title = title;
    history.pushState(stateObj, title, currentUrl);
  },

  scrollListener(nextPageEl,nextUrl,currentPage) {
    const currentPos = window.pageYOffset + window.innerHeight + 280;
    if (document.querySelector('.page-active')) {
      let endPos = document.getElementById('page-wrapper').offsetHeight + document.getElementById('page-wrapper').offsetTop;
      if (currentPos > endPos) {
        if (nextPageEl.hasClass('loading')) {
          const frameId=nextPageEl.attr('id');
          const frame=document.getElementById(frameId).contentWindow.document;
          if (frame.querySelector('body')) {
            test.checkActive(nextPageEl,currentPage,frameId,frame);
          } else {
            setTimeout(function () {
              test.scrollListener(nextPageEl,nextUrl,currentPage)
            }, 1000);
          }
        }
      } else {

        //console.log(test.isElementInViewport(document.getElementById('page')));

      }
    }
  },

  isElementInViewport(el) {
    var top = el.offsetTop;
    var left = el.offsetLeft;
    var width = el.offsetWidth;
    var height = el.offsetHeight;
    while(el.offsetParent) {
      el = el.offsetParent;
      top += el.offsetTop;
      left += el.offsetLeft;
    }
    return (
      top < (window.pageYOffset + window.innerHeight) &&
      left < (window.pageXOffset + window.innerWidth) &&
      (top + height) > window.pageYOffset &&
      (left + width) > window.pageXOffset
    );
  },

  checkActive(nextPageEl,currentPage,frameId,frame) {
    if (frame.querySelector('body').classList.contains('cro-frame')) {
      test.setActive(nextPageEl,currentPage,frameId,frame);
    } else {
      setTimeout(function () {
        test.scrollListener(nextPageEl,nextUrl,currentPage)
      }, 1000);
    }
  },

  setActive(nextPageEl,currentPage,frameId,frame) {
    nextPageEl.css('active').css('page-active').removeClass('loading');
    currentPage.css('prev').removeClass('page-active').removeClass('active');
    currentPage.parent().css('prev').find('.loading-area').css('added').find('.rname').html(frame.querySelector('meta[name=RecipeName]').getAttribute('content'));
    document.getElementById(frameId).style.height = frame.getElementById('page').offsetHeight + 'px';

    let contentObserver = new MutationObserver(function(mutations) {
      for (var i = 0; i < mutations.length; i++) {
        document.getElementById(frameId).style.height = frame.getElementById('page').offsetHeight + 'px'
      }
    });

    const config = {
      attributes: true,
      childList: true,
      characterData: true,
      subtree: true
    };

    if (frame.querySelector('.recipepage')) {
      contentObserver.observe(frame.querySelector('.recipepage'), config);
    } else {
      console.log('no observer');
    }

    window.setTimeout(function () {
       test.gotoPage(nextPageEl,currentPage,nextUrl);
    }, 200);
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


  scrollToElement(elem) {
    const elPosition = document.getElementById(elem).offsetTop - 70;
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
