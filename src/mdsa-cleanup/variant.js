// ==UserScript==
// @name         recipe-toggle-ingredients
// @path         //./src/mdsa-cleanup/variant.js
// @namespace    http://tampermonkey.net/
// @version      0.1
// @match        https://www.ica.se/recept/*
// @grant        none
// ==/UserScript==

'use strict';

import { CROUTIL, ELM } from '../util/main';
import { triggerHotJar, gaPush } from '../util/utils';
import './style.css';

const test = {

  manipulateDom() {

    if (ELM.get('.mdsa-main-grid .right-content').exist()) {
      ELM.get('.mdsa-main-grid .right-content').remove();
      ELM.get('.mdsa-main-grid > div').removeClass('xl_size15of20').css('xl_size20of20');
    }

    if (ELM.get('fieldset.search').exist()) {
      const searchContainer = ELM.create('div search-container');
      searchContainer.append(ELM.get('fieldset.search'));
      ELM.get('header.page-header').append(searchContainer);
      ELM.get('.filter-search fieldset.search').remove();
    }

    const filterSegments = document.querySelectorAll('fieldset.filtersegment');

    let mutationObserver = new MutationObserver(function(mutations) {
      for (var i = 0; i < mutations.length; i++) {
        if (mutations[i].type === 'childList') {
          test.checkForChanges(filterSegments);
          break;
        }
      }
    });

    mutationObserver.observe(document.documentElement, {
      attributes: true,
      characterData: true,
      childList: true,
      subtree: true
    });

  },

  checkForChanges(filterSegments) {
    if (filterSegments.length) {
      const isLoaded = setInterval(checkLoaded, 200);
      function checkLoaded() {
        if (document.getElementById('RecipeFilterMenu').classList.contains('loaded')) {
          clearInterval(isLoaded);
          test.addChanges(filterSegments);
        }
      }
    }
  },

  addChanges(filterSegments) {
    for (var i = 0; i < filterSegments.length; i++) {
      if (!filterSegments[i].classList.contains('selected')) {
        filterSegments[i].classList.add('contracted');
      }
    }
    const recipeFooter = document.querySelectorAll('.recipe footer:not(.adjusted)');
    if (recipeFooter.length) {
      let time, saveSvg;
      const clock = '<svg width="32px" height="32px"><use xlink:href="/Assets/icons/symbols.svg#clock"></use></svg>';
      const svg = '<svg width="12px" height="12px"><use xlink:href="/Assets/icons/symbols.svg#heart"></use></svg> ';
      for (var i = 0; i < recipeFooter.length; i++) {
        recipeFooter[i].classList.add('adjusted');
        time = document.createElement('div');
        //time.innerHTML=clock + recipeFooter[i].parentNode.parentNode.getAttribute('data-cookingtime');
        time.innerHTML=clock + 'XX min';
        time.classList.add('time');
        recipeFooter[i].parentNode.insertBefore(time, recipeFooter[i]);
        saveSvg = document.createElement('span');
        saveSvg.innerHTML=svg;
        recipeFooter[i].parentNode.querySelector('.save-recipe-button a').prepend(saveSvg);
      }
    }
  }

};

$(document).ready(() => {
  Object.assign(test, CROUTIL());
  test.manipulateDom();
});
