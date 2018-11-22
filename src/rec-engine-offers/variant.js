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

const recipeFlag = ['kycklingfilé','kycklingbröstfilé','minutfilé av kyckling','smör','vetemjöl','prästost','bryggkaffe','choklad'];
const excludeWords = ['mjölkfri','laktos','gluten','vegan','fria','fritt','mjölkprotein'];

//meta ingredient i recipeFlag ['kycklingfilé','kycklingbröstfilé','minutfilé av kyckling','smör','vetemjöl','prästost','bryggkaffe','choklad'];
//om smör - inte ["laktos","vegan","mjölkfri","mjölkprotein"] i rubrik eller ingress
//om vetemjöl - inte ["gluten"] i rubrik eller ingress

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
            const recipeIngredients = unchecked[i].querySelector('span.ingredients').getAttribute('title').split(/\r?\n/);
            if (!unchecked[i].querySelector('figure span.icon-offer')) {
              const iconOffer = document.createElement('span');
              iconOffer.classList.add('icon-offer','iconCard','icon','sprite-store');
              unchecked[i].querySelector('figure').append(iconOffer);
            }
            for (var j = 0; j < recipeIngredients.length; j++) {
              if (recipeFlag.indexOf(recipeIngredients[j]) !== -1) {
                //Visa erbjudande för recept
                unchecked[i].classList.add('flag-check','flag-on');
              } else {
                unchecked[i].classList.add('flag-check');
              }
            }
          }
        }
      }

    } else if (recipe) {

      const recipeIngredients = document.querySelector('head meta[name="ingredients"]').getAttribute('content').split(',');

      const chickenFlag = ['kycklingfilé','kycklingbröstfilé','minutfilé av kyckling'];
      const butterFlag = ['smör'];
      const flourFlag = ['vetemjöl'];
      const cheeseFlag = ['prästost'];
      const coffeeFlag = ['bryggkaffe'];
      const chocolateFlag = ['choklad'];

      const offersContainer = document.createElement('div');
      offersContainer.classList.add('offers');
      document.querySelector('.ingredients--dynamic').append(offersContainer);

      for (var i = 0; i < recipeIngredients.length; i++) {
        const recipeIndex = recipeFlag.indexOf(recipeIngredients[i]);
        if (recipeIndex !== -1) {
          //Visa erbjudande för recept
          let offerId;
          if (chickenFlag.indexOf(recipeIngredients[i]) !== -1) {
            offerId = 482;
          } else if (butterFlag.indexOf(recipeIngredients[i]) !== -1) {
            offerId = 484;
          } else if (flourFlag.indexOf(recipeIngredients[i]) !== -1) {
            offerId = 485;
          } else if (cheeseFlag.indexOf(recipeIngredients[i]) !== -1) {
            offerId = 487;
          } else if (coffeeFlag.indexOf(recipeIngredients[i]) !== -1) {
            offerId = 483;
          } else if (chocolateFlag.indexOf(recipeIngredients[i]) !== -1) {
            offerId = 486;
          }

          // console.log(recipeFlag[recipeIndex]);

          const ingredientsItems = document.getElementById('ingredients-section').querySelectorAll('ul li');

          for (var j = 0; j < ingredientsItems.length; j++) {
            if (ingredientsItems[j].innerHTML.indexOf(recipeFlag[recipeIndex]) !== -1 && !ingredientsItems[j].querySelector('span.icon-offer')) {
              ingredientsItems[j].classList.add('flag');
              const iconOffer = document.createElement('span');
              iconOffer.classList.add('icon-offer','iconCard','icon','sprite-store');
              ingredientsItems[j].append(iconOffer);
            }
          }

          const offer = test.getOffer(offerId);
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
      offerTitle =        'Prästost';
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
    const ctaEl = document.createElement('div');
      ctaEl.classList.add('offer-ctas');
      ctaEl.append(buyEl);

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
