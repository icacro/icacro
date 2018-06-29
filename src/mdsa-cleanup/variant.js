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

    let filterObserver = new MutationObserver(function(mutations) {
      for (var i = 0; i < mutations.length; i++) {
        test.checkForChanges(filterSegments);
        break;
      }
    });

    filterObserver.observe(document.getElementById('recipes'), {
      attributes: false,
      characterData: false,
      childList: true,
      subtree: false
    });

    for (var i = 0; i < filterSegments.length; i++) {
      filterSegments[i].querySelector('legend').onclick = function(){
        if(this.parentNode.classList.contains('open')) {
          this.parentNode.classList.remove('open');
          this.parentNode.classList.remove('contracted');
        } else if (!this.parentNode.classList.contains('selected')) {
          this.parentNode.classList.add('open');
          this.parentNode.classList.add('contracted');
        }
      }
    }

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
        const currentRecipe = recipe[i];
        currentRecipe.classList.add('adjusted');
        const recipeFooter = currentRecipe.querySelector('footer');
        const recipeImgDiv = currentRecipe.querySelector('div:first-child');
        const recipeTxtDiv = currentRecipe.querySelector('div:last-child');
        recipeTxtDiv.classList.add('size15of20');
        recipeTxtDiv.classList.remove('lg_size15of20');
        recipeTxtDiv.classList.remove('size12of20');
        recipeImgDiv.classList.add('size5of20');
        recipeImgDiv.classList.remove('lg_size5of20');
        recipeImgDiv.classList.remove('size8of20');
        time = document.createElement('div');

        test.addCookingTime(currentRecipe,time,clock,recipeTxtDiv);

        if(window.innerWidth > 969) {

          const recipeNo = i;
          const imgWrapper = recipe[recipeNo].querySelector('div:first-child a');
          if (imgWrapper.querySelectorAll('img').length === 1) {
            test.hiresImage(imgWrapper);
          }

          let imageObserver = new MutationObserver(function(mutations) {
            for (var i = 0; i < mutations.length; i++) {
              if (imgWrapper.querySelectorAll('img').length === 1) {
                test.hiresImage(imgWrapper);
                break;
              } else {
                imageObserver.disconnect();
              }
            }
          });

          imageObserver.observe(imgWrapper, {
            attributes: false,
            characterData: false,
            childList: true,
            subtree: false
          });

        }

      }
    }

  },

  addCookingTime(recipe,time,clock,recipeTxtDiv) {
    console.log('0');
    if (recipe.hasAttribute('data-cooking-time')) {
      test.setCookingTime(recipe,time,clock,recipeTxtDiv,recipe.getAttribute('data-cooking-time'));
    } else {
      console.log('1');
      setTimeout(function() {
        if (recipe.hasAttribute('data-cooking-time')) {
          test.setCookingTime(recipe,time,clock,recipeTxtDiv,recipe.getAttribute('data-cooking-time'));
        } else {
          console.log('2');
        }
      },1000);
    }
  },

  setCookingTime(recipe,time,clock,recipeTxtDiv,cookingtime) {
    console.log('4');
    if (cookingtime > 0) {
      time.innerHTML=clock + cookingtime + ' min';
      time.classList.add('time');
      recipeTxtDiv.insertBefore(time, recipe.querySelector('.save-recipe-button'));
    }
  },

  hiresImage(imgWrapper) {
    const imgContent = imgWrapper.querySelector('img').cloneNode(false);
    const imgPath = imgContent.getAttribute('src').replace('cf_5291','cf_259');
    imgContent.setAttribute('src',imgPath);
    imgWrapper.appendChild(imgContent);
  }

};

$(document).ready(() => {
  Object.assign(test, CROUTIL());
  test.manipulateDom();
});
