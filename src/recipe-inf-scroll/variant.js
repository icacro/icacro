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
let recipesArr = [];

//---även #page-prev måste vara unika
//---utskrift endast aktivt recept
//---maxlängd på recipesArr
//görsåhär-styling, funktioner
//pre-footer?
//felhantering (laddning)
//scroll tillbaka - #page och url
//design/innehåll avgränsningsyta, fejkladdning
//(ev) förflytta sig i historiken - högst upp på aktuellt recept

const test = {

  manipulateDom() {

    const pageWrapper = ELM.get('#page-wrapper');
    const page = ELM.get('#page');
    const pageNext = page;
    const currentUrl = window.location.pathname;

    recipesArr.push(currentUrl);

    test.gotoPage(pageNext,page,pageWrapper,currentUrl);

  },

  gotoPage(pageNext,page,pageWrapper,currentUrl) {

    const maxlength = 25;
    const currentPage = pageNext;
    const prevPage = page;

    if (currentPage.find('h1').exist()) {

      const loadingAreaTitle = ELM.create('p loading-area-title');
      const loadingArea = ELM.create('div loading-area');
      loadingArea.append(loadingAreaTitle);

      const title  = currentPage.find('h1').text();

      if (currentPage !== prevPage) {
        //prevPage.attr('id','page-prev');
        currentPage.attr('id','page');
        const stateObj = { foo: 'bar' };
        document.title = title;
        history.pushState(stateObj, title, currentUrl);
      }

      const nextPage = ELM.create('div page page-mod-fullwidth pl recipepage').attr('id','page-next');

      if (recipesArr.length < maxlength) {
        const relatedList = document.querySelectorAll('#page .related-recipes-list > a');
        for (var i = 0; i < relatedList.length; i++) {
          recipesArr.push(relatedList[i].getAttribute('href'));
        }
        recipesArr = test.removeDuplicates(recipesArr);
      }

      const pageCount = document.querySelectorAll('.page').length;

      const nextUrl = recipesArr[recipesArr.indexOf(currentUrl)+1];

      if (pageCount >= maxlength) {
        document.getElementById('footer').classList.add('visible');
      } else {
        test.loadNextPage(nextUrl);
        currentPage.append(loadingArea);
        currentPage.attr('data-href',currentUrl);
        pageWrapper.append(nextPage);

        window.onscroll = function() {
         if(window.scrollY + window.innerHeight >= document.body.scrollHeight) {
           if (!loadingArea.hasClass('added')) {
             window.setTimeout(function () {
               test.gotoPage(nextPage,page,pageWrapper,nextUrl);
               currentPage.attr('id','page-prev-' + pageCount);
               loadingArea.css('added');
             }, 1000);
           }
         }
        }
      }

    } else {

      document.querySelector('#page .loading-area .loading-area-title').innerHTML='Oj...';
      document.querySelector('#page .loading-area').classList.add('reload');

      // document.querySelector('#page .reload').onclick = function() {
      //   test.loadNextPage(currentUrl);
      //   this.parentElement.id='page';
      //   test.gotoPage(pageNext,page,pageWrapper,currentUrl);
      // }

    }

    window.onpopstate = function(event) {
      console.log(window.location.pathname);
    };

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
        var resp = request.responseText;
        var parser = new DOMParser();
        var xmlDoc = parser.parseFromString(resp,"text/html");
        var tds = xmlDoc.getElementById("page");
        var title = xmlDoc.title;
        title = '<span>Nästa recept:</span> ' + title.substring(0, title.indexOf('|'));
        var arrow = '<div class="svg"><svg width="32px" height="32px"><use xlink:href="/Assets/icons/symbols.svg#arrow-down"></use></svg></div>';
        document.getElementById('page-next').innerHTML=tds.innerHTML;
        document.querySelector('#page .loading-area .loading-area-title').innerHTML=title + arrow;
        if (tds.classList.contains('recipepage--large')) {
          document.getElementById('page-next').classList.add('recipepage--large');
        } else {
          document.getElementById('page-next').classList.add('recipepage--small');
        }
      } else {
        //felhantering
      }
    };
    request.onerror = function() {
      //felhantering
    };
    request.send();
  }

};

$(document).ready(() => {
  Object.assign(test, CROUTIL());
  test.manipulateDom();
});
