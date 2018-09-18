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
      const buttonsWrapper = ELM.create('div nav-buttons-wrapper');
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
      buttonsWrapper.append(buttons);

      ELM.get('.magazine-row + .row').append(buttonsWrapper);

      if (ELM.get('.recipe-details').exist) {
        setTimeout(function () {
          const diff = 0; //window.pageYOffset / 5;
          const offsetTopParent = document.querySelector('.container-backdrop').offsetTop;
          const detailsPos = document.querySelector('.recipe-details').offsetTop + offsetTopParent;
          const howtoPos = document.getElementById('recipe-howto').offsetTop + offsetTopParent - diff;
          const ingredientsPos = document.getElementById('ingredients-section').offsetTop + offsetTopParent - diff;
          const navPos = document.querySelector('.nav-buttons-wrapper').offsetTop + offsetTopParent;
          window.onscroll = function() {checkScroll(detailsPos,howtoPos,ingredientsPos,navPos,offsetTopParent)};
        }, 500);
      }

      function checkScroll(detailsPos,howtoPos,ingredientsPos,navPos) {
        const scrollpos = window.pageYOffset;

        if (scrollpos >= (navPos + 20)) {
          ELM.get('.sticky-nav-buttons').css('fixed');
          linkIngredients.css('active');
        } else {
          ELM.get('.sticky-nav-buttons').removeClass('fixed');
          linkIngredients.removeClass('active');
        }

        if(scrollpos >= detailsPos && !(ELM.get('.sticky-nav-buttons.hidden').exists)) {
          ELM.get('.sticky-nav-buttons').css('hidden');
        } else {
          ELM.get('.sticky-nav-buttons').removeClass('hidden');
          if (scrollpos >= howtoPos - 80) {
            linkHowto.css('active');
            linkIngredients.removeClass('active');
          } else if (scrollpos >= ingredientsPos - 80) {
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
    let diff = 50;
    const offsetTopParent = document.querySelector('.container-backdrop').offsetTop;
    const elPosition = document.getElementById(elem).offsetTop - diff + offsetTopParent;
    $('html,body').animate({
			 scrollTop: elPosition
		}, 400);
  },

};

$(document).ready(() => {
  Object.assign(test, CROUTIL());
  test.manipulateDom();
});
