// ==UserScript==
// @name         recipe-toggle-ingredients
// @path         //./src/recipe-toggle-ingredients/variant.js
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

    const page = ELM.get('#page-wrapper');
    if (page.exist) {
      const buttons = ELM.create('div sticky-nav-buttons');
      const buttonIngredients = ELM.create('div nav-button-ingredients');
      const buttonHowto = ELM.create('div nav-button-howto');
      const linkIngredients = ELM.create('a').attr('href','#ingredients-section').text('Ingredienser');
      const linkHowto = ELM.create('a').attr('href','#recipe-howto').text('Gör så här');

      buttonIngredients.append(linkIngredients);
      buttonHowto.append(linkHowto);

      buttonIngredients.click((e) => {
        e.preventDefault();
        gaPush({ eventAction: 'Recept, Ankarnav ingredienser' });
        test.scrollToElement('ingredients-section');
      });
      buttonHowto.click((e) => {
        e.preventDefault();
        gaPush({ eventAction: 'Recept, Ankarnav instruktioner' });
        test.scrollToElement('recipe-howto');
      });

      buttons.append(buttonIngredients).append(buttonHowto);
      page.append(buttons);

      if (ELM.get('.recipe-details').exist) {
        const diff = window.innerHeight / 5;
        const detailsPos = document.querySelector('.recipe-details').offsetTop;
        const howtoPos = document.getElementById('recipe-howto').offsetTop - diff;
        const ingredientsPos = document.getElementById('ingredients-section').offsetTop - diff;
        window.onscroll = function() {checkScroll(detailsPos,howtoPos,ingredientsPos)};
      }

      function checkScroll(detailsPos,howtoPos,ingredientsPos) {
        const scrollpos = window.pageYOffset;
        if(scrollpos >= detailsPos && !(ELM.get('.sticky-nav-buttons.hidden').exists)) {
          ELM.get('.sticky-nav-buttons').css('hidden');
        } else {
          ELM.get('.sticky-nav-buttons').removeClass('hidden');
          if (scrollpos >= howtoPos) {
            linkHowto.css('active');
            linkIngredients.removeClass('active');
          } else if (scrollpos >= ingredientsPos) {
            linkHowto.removeClass('active');
            linkIngredients.css('active');
          } else {
            linkHowto.removeClass('active');
            linkIngredients.removeClass('active');
          }
        }
      }

    }

  },

  scrollToElement(elem) {
    let diff = 0;
    if (document.querySelector('.recipe-image-square')) {
      diff = document.querySelector('.recipe-image-square').offsetHeight;
    }
    const elPosition = document.getElementById(elem).offsetTop + diff;
    $('html,body').animate({
			 scrollTop: elPosition
		}, 400);
  },

};

$(document).ready(() => {
  Object.assign(test, CROUTIL());
  test.manipulateDom();
});
