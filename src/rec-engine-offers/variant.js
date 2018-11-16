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
import { ajax, gaPush } from '../util/utils';
import './style.css';

const recipes = document.getElementById('recipes');
const recipe = document.querySelector('.recipepage');

const flagRecipes = [724379,724235];

const test = {

  manipulateDom() {

    if (recipes) {

      let recipesObserver = new MutationObserver(function(mutations) {
        for (var i = 0; i < mutations.length; i++) {
          checkRecipes();
        }
      });

      recipesObserver.observe(recipes, {
        attributes: false,
        characterData: false,
        childList: true,
        subtree: false
      });

      function checkRecipes() {
        const unchecked = recipes.querySelectorAll('article:not(flag-check)');
        if (unchecked) {
          for (var i = 0; i < unchecked.length; i++) {
            const recipeId = parseInt(unchecked[i].querySelector('header a').getAttribute('data-recipeid'));
            if (flagRecipes.indexOf(recipeId) !== -1) {
              unchecked[i].classList.add('flag-check','flag-on');
            } else {
              unchecked[i].classList.add('flag-check');
            }
          }
        }
      }

    } else if (recipe) {

      const currentUrl = window.location.pathname;
      const urlParts = currentUrl.split('/');
      const nameParts = urlParts[2].split('-');
      const recipeId = parseInt(nameParts[nameParts.length - 1]);
      const recipeIndex = flagRecipes.indexOf(recipeId);

      // om receptet har ett erbjudande
      if (recipeIndex !== -1) {

        const offers = [
          [724379,[[481,'hjärtkålshuvud'],[484,'olja']]],
          [724235,[[481,'hjärtkålshuvud'],[484,'strösocker']]]
        ];

        const recipeOffers = offers[recipeIndex][1];
        const ingredientsList = document.getElementById('ingredients-section').querySelectorAll('.ingredients__list li');

        const offersContainer = document.createElement('div');
        offersContainer.classList.add('offers');
        document.getElementById('ingredients-section').append(offersContainer);

        for (var i = 0; i < recipeOffers.length; i++) {

          // markera i ingredienslista
          for (var j = 0; j < ingredientsList.length; j++) {
            if (ingredientsList[j].innerHTML.indexOf(recipeOffers[i][1]) !== -1) {
              ingredientsList[j].classList.add('flag');
            }
          }
          // visa erbjudande efter #ingredients-section
          const offer = test.getOffer(offers[recipeIndex][1][i][0]);
          offersContainer.append(offer);
        }

      }

    }

  },

  getOffer(id) {
    let offerImg, offerTitle, offerPrice, offerOnlineLink;
    const offer = document.createElement('div');
    if (id===481) {
      offerImg =          '/06/350x350/2332813000006.jpg';
      offerTitle =        'Minutfilé ca 600g Kronfågel';
      offerPrice =        '99 kr';
      offerOnlineLink =   '/null/';
    } else if (id===482) {
      offerImg =          '/08/350x350/2332804000008.jpg';
      offerTitle =        'Kycklingfilé ca 925g Kronfågel';
      offerPrice =        '99 kr';
      offerOnlineLink =   '/null/';
    } else if (id===483) {
      offerImg =          '/85/350x350/8711000530085.jpg';
      offerTitle =        'Bryggkaffe Mellanrost 450g Gevalia';
      offerPrice =        '3 för 69 kr';
      offerOnlineLink =   '/bryggkaffe-mellanrost-450g-gevalia-id_p_8711000530085/';
    } else if (id===484) {
      offerImg =          '/68/350x350/7310865005168.jpg';
      offerTitle =        'Smör Normalsaltat 82% 500g Svenskt smör';
      offerPrice =        '39 kr';
      offerOnlineLink =   '/smor-normalsaltat-82-500g-svenskt-smor-id_p_7310865005168/';
    } else if (id===485) {
      offerImg =          '/29/350x350/7310130006029.jpg';
      offerTitle =        'Kärnvetemjöl 2kg Kungsörnen';
      offerPrice =        '2 för 15 kr';
      offerOnlineLink =   '/karnvetemjol-2kg-kungsornen-id_p_7310130006029/';
    } else if (id===486) {
      offerImg =          '/03/350x350/7310511210403.jpg';
      offerTitle =        'Chokladkaka';
      offerPrice =        '3 för 30 kr';
      offerOnlineLink =   '/mjolkchoklad-200g-marabou-id_p_7310511210403/';
    } else if (id===487) {
      offerImg =          '/09/350x350/2340385800009.jpg';
      offerTitle =        'Ost';
      offerPrice =        '89 kr';
      offerOnlineLink =   '/null/';
    }

    // https://www.ica.se/handla/produkt/
    const imgEl = document.createElement('img');
      imgEl.src = 'https://atgcdn-production.prod.vuitonline.com/online/' + offerImg;
      imgEl.alt = offerTitle;
    const titleEl = document.createElement('p');
      titleEl.innerHTML = offerTitle;
    const priceEl = document.createElement('p');
      priceEl.classList.add('price');
      priceEl.innerHTML = offerPrice;
    const buyEl = document.createElement('div');
      const buyElLink = document.createElement('a');
      buyElLink.href = 'https://www.ica.se/handla/produkt' + offerOnlineLink;
      buyElLink.innerHTML = 'Köp';
      buyEl.append(buyElLink);
    const listEl = document.createElement('div');
      listEl.innerHTML = '<a>Lista</a>';
    const ctaEl = document.createElement('div');
      ctaEl.classList.add('offer-ctas');
      ctaEl.append(buyEl);
      ctaEl.append(listEl);

    offer.append(imgEl);
    offer.append(titleEl);
    offer.append(priceEl);
    offer.append(ctaEl);

    return offer;
  }

};

$(document).ready(() => {
  Object.assign(test, CROUTIL());
  test.manipulateDom();
});
