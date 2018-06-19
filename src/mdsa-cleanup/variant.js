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
import { gaPush } from '../util/utils';
import './style.css';

const test = {

  manipulateDom() {

    if (ELM.get('.mdsa-main-grid .right-content').exist()) {
      ELM.get('.mdsa-main-grid .right-content').remove();
      ELM.get('.mdsa-main-grid > div').removeClass('xl_size15of20').css('xl_size20of20');
    }

    if (ELM.get('div.grid_fluid .filter-search').exist()) {
      const searchContainer = ELM.create('div search-container');
      searchContainer.append(ELM.get('.filter-search'));
      ELM.get('header.page-header').append(searchContainer);
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

    mutationObserver.observe(document.getElementById('recipes'), {
      attributes: true,
      characterData: true,
      childList: true,
      subtree: true
    });

    setTimeout(function() {
      ELM.get('#content').css('cro-transitions');
    },500);

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

    const recipe = document.querySelectorAll('.recipe:not(.adjusted)');

    if (recipe.length) {
      let time, saveSvg;
      const clock = '<svg width="32px" height="32px"><use xlink:href="/Assets/icons/symbols.svg#clock"></use></svg>';
      for (var i = 0; i < recipe.length; i++) {
        recipe[i].classList.add('adjusted');
        const recipeFooter = recipe[i].querySelector('footer');
        const recipeImgDiv = recipe[i].querySelector('div:first-child');
        const recipeTxtDiv = recipe[i].querySelector('div:last-child');
        recipeTxtDiv.classList.add('size15of20');
        recipeTxtDiv.classList.remove('lg_size15of20');
        recipeTxtDiv.classList.remove('size12of20');
        recipeImgDiv.classList.add('size5of20');
        recipeImgDiv.classList.remove('lg_size5of20');
        recipeImgDiv.classList.remove('size8of20');
        time = document.createElement('div');
        if (recipe[i].hasAttribute('data-cookingtime')) {
          time.innerHTML=clock + recipe[i].getAttribute('data-cookingtime');
          time.classList.add('time');
          recipeTxtDiv.insertBefore(time, recipe[i].querySelector('.save-recipe-button'));
        } else {
          time.innerHTML=clock + 'XX min';
          time.classList.add('time');
          recipeTxtDiv.insertBefore(time, recipe[i].querySelector('.save-recipe-button'));
        }
        const imgWrapper = recipeImgDiv.querySelector('a');
        const imgContent = imgWrapper.innerHTML.replace('cf_5291','cf_259');
        imgWrapper.innerHTML = imgContent;
      }
    }

  }

};

$(document).ready(() => {
  Object.assign(test, CROUTIL());
  test.manipulateDom();
});
