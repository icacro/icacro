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

//även #page-prev måste vara unika
//utskrift endast aktivt recept
//maxlängd på recipesArr
//scroll
//design/innehåll avgränsningsyta, fejkladdning
//förflytta sig i historiken - högst upp på aktuellt recept

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

    const currentPage = pageNext;
    const prevPage = page;
    const loadingArea = ELM.create('div loading-area');

    if (currentPage !== prevPage) {
      prevPage.attr('id','page-prev');
      currentPage.attr('id','page');
      const title  = currentPage.find('h1').text();
      const stateObj = { foo: 'bar' };
      document.title = title;
      history.pushState(stateObj, title, currentUrl);
    }

    pageNext = ELM.create('div page page-mod-fullwidth pl recipepage').attr('id','page-next');

    const relatedList = document.querySelectorAll('#page .related-recipes-list > a');
    for (var i = 0; i < relatedList.length; i++) {
      recipesArr.push(relatedList[i].getAttribute('href'));
    }
    recipesArr = test.removeDuplicates(recipesArr);

    const nextUrl = recipesArr[recipesArr.indexOf(currentUrl)+1];
    test.loadNextPage(nextUrl);
    currentPage.append(loadingArea).attr('data-href','');
    pageWrapper.append(pageNext);

    loadingArea.click(function (e) {
      if (!this.classList.contains('added')) {
        test.gotoPage(pageNext,page,pageWrapper,nextUrl);
        currentPage.attr('id','page-prev');
        this.classList.add('added');
      }
    });

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
        document.getElementById('page-next').innerHTML=tds.innerHTML;
        if (tds.classList.contains('recipepage--large')) {
          document.getElementById('page-next').classList.add('recipepage--large');
        } else {
          document.getElementById('page-next').classList.add('recipepage--small');
        }
      } else {}
    };
    request.onerror = function() {};
    request.send();
  }

};

$(document).ready(() => {
  Object.assign(test, CROUTIL());
  test.manipulateDom();
});
