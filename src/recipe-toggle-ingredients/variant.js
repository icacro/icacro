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
    const page = ELM.get('#page');
    const buttons = ELM.create('div sticky-nav-buttons');
    const buttonIngredients = ELM.create('div nav-button-ingredients');
    const buttonHowto = ELM.create('div nav-button-howto');

    const linkIngredients = ELM.create('a').attr('href','#ingredients-section').text('Ingredienser');
    const linkHowto = ELM.create('a').attr('href','#recipe-howto').text('Gör så här');

    buttonIngredients.append(linkIngredients);
    buttonHowto.append(linkHowto);

    buttonIngredients.click((e) => {
      e.preventDefault();
      //gaPush({ eventAction: 'A/B-test recept ankarnav ingredienser' });
      test.scrollToElement('ingredients-section');
    });
    buttonHowto.click((e) => {
      e.preventDefault();
      //gaPush({ eventAction: 'A/B-test recept ankarnav instruktioner' });
      test.scrollToElement('recipe-howto');
    });

    buttons.append(buttonIngredients).append(buttonHowto);
    page.append(buttons);
  },

  scrollToElement(elem) {
    let diff = 0;
    if (document.querySelector('.recipe-image-square')) {
      diff = document.querySelector('.recipe-image-square').offsetHeight;
    }

    const elPosition = document.getElementById(elem).offsetTop + diff;
    window.scroll({
      top: elPosition,
      left: 0,
      behavior: 'smooth'
    });
  },

};

$(document).ready(() => {
  Object.assign(test, CROUTIL());
  test.manipulateDom();
});
