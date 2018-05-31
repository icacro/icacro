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

    // if (ELM.get('#content > .grid_fluid > .lg_size5of20').exist()) {
    //   ELM.get('#content > .grid_fluid > .lg_size5of20').css('lg_size6of20').removeClass('lg_size5of20');
    // }
    // if (ELM.get('#content > .grid_fluid > .lg_size15of20').exist()) {
    //   ELM.get('#content > .grid_fluid > .lg_size15of20').css('lg_size14of20').removeClass('lg_size15of20');
    // }
    // if (ELM.get('#content > .grid_fluid > .xl_size4of20').exist()) {
    //   ELM.get('#content > .grid_fluid > .xl_size4of20').css('xl_size5of20').removeClass('xl_size4of20');
    // }
    // if (ELM.get('#content > .grid_fluid > .lg_size16of20').exist()) {
    //   ELM.get('#content > .grid_fluid > .xl_size16of20').css('xl_size15of20').removeClass('xl_size16of20');
    // }

    if (ELM.get('fieldset.search').exist()) {
      const searchContainer = ELM.create('div search-container');
      searchContainer.append(ELM.get('fieldset.search'));
      ELM.get('header.page-header').append(searchContainer);
      ELM.get('.filter-search fieldset.search').remove();
    }

    const filterSegments = document.querySelectorAll('fieldset.filtersegment');
    if (filterSegments.length) {
      const isLoaded = setInterval(checkLoaded, 200);
      function checkLoaded() {
        if (document.getElementById('RecipeFilterMenu').classList.contains('loaded')) {
          clearInterval(isLoaded);
          for (var i = 0; i < filterSegments.length; i++) {
            if (!filterSegments[i].classList.contains('selected')) {
              filterSegments[i].classList.add('contracted');
            }
          }
          const recipeFooter = document.querySelectorAll('.recipe footer');
          let time;
          const clock = '<svg width="32px" height="32px"><use xlink:href="/Assets/icons/symbols.svg#clock"></use></svg>';
          if (recipeFooter.length) {
            for (var i = 0; i < recipeFooter.length; i++) {
              time = document.createElement('div');
              console.log(time);
              time.innerHTML=clock + '15 min';
              time.classList.add('time');
              recipeFooter[i].parentNode.insertBefore(time, recipeFooter[i]);
            }
          }
        }
      }
    }

  },

};

$(document).ready(() => {
  Object.assign(test, CROUTIL());
  test.manipulateDom();
});
