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

const cardSvg = '<svg width="48px" height="48px"><svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 55 38" id="ica-card" width="100%" height="100%"><g fill="none" fill-rule="evenodd"><path d="M43.557 3.9H7.404c-.9 0-1.637.726-1.637 1.613v21.475c0 .888.737 1.614 1.637 1.614h3.372v6.204l9.464-6.204h23.317c.9 0 1.636-.726 1.636-1.614V5.513c0-.887-.736-1.613-1.636-1.613" fill="#F6C8DF"></path><path d="M10.776 7.107c0-.074.05-.123.125-.123h1.897c.075 0 .125.037.125.123v3.298l2.446-3.347c.037-.05.074-.074.15-.074h2.232c.1 0 .138.062.075.148l-2.807 3.715 3.106 4.602c.05.085.025.147-.087.147h-2.345c-.075 0-.112-.025-.15-.086l-2.62-3.96v3.924c0 .073-.037.123-.125.123H10.9c-.074 0-.124-.05-.124-.123V7.107z" fill="#E10817"></path><path d="M23.725 11.29c0-1.17-.7-2.35-2.072-2.35s-2.07 1.18-2.07 2.35c0 1.17.71 2.35 2.07 2.35 1.36 0 2.072-1.18 2.072-2.35m-6.288 0c0-2.423 1.722-4.43 4.216-4.43 2.496 0 4.217 2.007 4.217 4.43 0 2.436-1.71 4.43-4.217 4.43-2.507 0-4.216-1.994-4.216-4.43m12.463-.627c.71 0 1.034-.332 1.034-.86 0-.543-.324-.887-1.035-.887h-1.024v1.747H29.9zm-3.17-3.556c0-.074.05-.123.125-.123h3.18c1.873 0 3.058 1.243 3.058 2.818 0 1.07-.562 1.968-1.522 2.41l1.985 3.237c.05.085.01.147-.088.147h-2.22c-.076 0-.113-.025-.15-.086l-1.672-2.977h-.55v2.94c0 .087-.037.124-.124.124h-1.895c-.075 0-.125-.05-.125-.123V7.107zm8.97 1.809h-2.234c-.1 0-.137-.062-.1-.148l.787-1.685c.024-.075.074-.1.136-.1h5.476c.088 0 .125.038.125.124v1.686c0 .074-.036.123-.124.123h-1.91v6.558c0 .086-.036.123-.123.123h-1.91a.117.117 0 0 1-.123-.123V8.916zM14.095 20.573c.686 0 1.01-.467 1.01-.984 0-.53-.324-1.01-1.01-1.01h-1.173v1.993h1.173zm-3.32-3.802c0-.073.05-.122.126-.122h3.307c1.872 0 3.057 1.366 3.057 2.94 0 1.563-1.185 2.916-3.057 2.916h-1.285v2.634c0 .074-.037.123-.125.123H10.9c-.074 0-.124-.048-.124-.122v-8.37zm10.393 3.556c.71 0 1.035-.332 1.035-.86 0-.543-.324-.887-1.035-.887h-1.023v1.747h1.023zm-3.17-3.556c0-.073.05-.122.126-.122h3.18c1.872 0 3.058 1.243 3.058 2.818 0 1.07-.562 1.968-1.522 2.41l1.983 3.237c.05.086.012.148-.087.148h-2.22c-.076 0-.113-.024-.15-.085l-1.672-2.978h-.55v2.94c0 .087-.037.124-.124.124h-1.896c-.075 0-.125-.048-.125-.122V16.77zm7.36-.001c0-.073.037-.122.125-.122h1.896c.074 0 .124.037.124.123v8.368c0 .074-.038.123-.125.123h-1.897c-.075 0-.125-.048-.125-.122v-8.37zm3.617 5.92c.037-.087.1-.1.175-.05.35.27.985.664 1.796.664.724 0 .998-.308.998-.688 0-.444-.524-.628-1.16-.837-1.035-.346-2.395-.752-2.395-2.523 0-1.477 1.084-2.732 3.142-2.732 1.136 0 1.934.394 2.258.64.063.037.076.098.04.16l-.763 1.698c-.037.086-.1.098-.174.05-.313-.247-.836-.47-1.485-.47-.55 0-.86.26-.86.604 0 .394.51.58 1.097.776 1.035.332 2.433.75 2.433 2.633 0 1.575-1.135 2.768-3.156 2.768-1.373 0-2.27-.517-2.67-.824-.063-.05-.075-.112-.038-.173l.76-1.698z" fill="#E10817"></path></g></svg></svg>';

const test = {

  manipulateDom() {

    if (recipes) {

      let recipesObserver = new MutationObserver(function(mutations) {
        for (var i = 0; i < mutations.length; i++) {
          const unchecked = recipes.querySelectorAll('article:not(flag-check)');
          if (unchecked) {
            for (var j = 0; j < unchecked.length; j++) {
              const recipeIngredients = unchecked[j].querySelector('span.ingredients').getAttribute('title').split(/\r?\n/);
              if (!unchecked[j].querySelector('span.icon-offer')) {
                const iconOffer = document.createElement('span');
                iconOffer.classList.add('icon-offer');
                iconOffer.innerHTML = cardSvg;
                unchecked[j].prepend(iconOffer);
              }
              test.checkRecipesMDSA(recipeIngredients,unchecked[j]);
            }
          }
        }
      });

      recipesObserver.observe(recipes, {
        attributes: false,
        characterData: false,
        childList: true,
        subtree: false
      });

    } else if (recipe) {

      const recipeIngredients = document.querySelector('head meta[name="ingredients"]').getAttribute('content').split(',');

      for (var i = 0; i < recipeIngredients.length; i++) {
        let offerId = 0;
        const recipeIngredient = recipeIngredients[i];
        const recipeIndex = recipeFlag.indexOf(recipeIngredient);
        if (recipeIndex !== -1) {

          //Sätt erbjudande-id

          if (recipeIngredient === 'kycklingfilé' || recipeIngredient === 'kycklingbröstfilé' || recipeIngredient === 'minutfilé av kyckling') {
            offerId = 482;
          } else if (recipeIngredient === 'smör') {
            const title = document.querySelector('.recipepage__headline').innerHTML;
            const preamble = document.querySelector('.recipe-preamble').innerHTML;
            if (test.checkException(recipeIngredient,title,preamble)) {
              offerId = 484;
            }
          } else if (recipeIngredient === 'vetemjöl') {
            const title = document.querySelector('.recipepage__headline').innerHTML;
            const preamble = document.querySelector('.recipe-preamble').innerHTML;
            if (test.checkException(recipeIngredient,title,preamble)) {
              offerId = 485;
            }
          } else if (recipeIngredient === 'ost') {
            offerId = 487;
          } else if (recipeIngredient === 'bryggkaffe') {
            offerId = 483;
          } else if (recipeIngredient === 'choklad') {
            offerId = 486;
          }

          if (offerId !== 0) {

            //Markera ingrediens

            const ingredientsItems = document.getElementById('ingredients-section').querySelectorAll('ul li');
            for (var j = 0; j < ingredientsItems.length; j++) {
              if (ingredientsItems[j].innerHTML.indexOf(recipeIngredient) !== -1 && !ingredientsItems[j].querySelector('span.icon-offer')) {
                ingredientsItems[j].classList.add('flag');
                const iconOffer = document.createElement('span');
                iconOffer.classList.add('icon-offer');
                iconOffer.innerHTML = cardSvg;
                ingredientsItems[j].prepend(iconOffer);
              }
            }

            //Visa erbjudande efter recept

            const offer = test.getOffer(offerId);
            document.getElementById('ingredients-section').append(offer);

          }

        }

      }

    }

  },

  checkException(recipeIngredient,title,preamble) {
    if (recipeIngredient === 'smör') {
      const checkFor = ['laktos','vegan','mjölkfri','mjölkprotein'];
      if (title.indexOf('vegan') === -1 && preamble.indexOf('vegan') === -1
        && title.indexOf('laktos') === -1 && preamble.indexOf('laktos') === -1
          && title.indexOf('mjölkfri') === -1 && preamble.indexOf('mjölkfri') === -1
            && title.indexOf('mjölkprotein') === -1 && preamble.indexOf('mjölkprotein') === -1) {
        return true;
      } else {
        return false;
      }
    } else if (recipeIngredient === 'vetemjöl') {
      if (title.indexOf('gluten') === -1 && preamble.indexOf('gluten') === -1) {
        return true;
      } else {
        return false;
      }
    }
  },

  checkRecipesMDSA(recipeIngredients,article) {
    for (var i = 0; i < recipeIngredients.length; i++) {
      article.classList.add('flag-check');
      const recipeIngredient = recipeIngredients[i];
      if (recipeFlag.indexOf(recipeIngredient) !== -1) {
        if (recipeIngredient === 'smör' || recipeIngredient === 'vetemjöl') {
          const title = article.querySelector('header h2 a').innerHTML;
          const preamble = article.querySelector('.content.sm_hidden a p').innerHTML;
          if (test.checkException(recipeIngredient,title,preamble)) {
            article.classList.add('flag-on');
          }
        } else {
          article.classList.add('flag-on');
        }
      }
    }
  },

  getOffer(id) {
    let offerImg, offerTitle, offerPrice, offerOnlineLink;
    const offerWrapper = document.createElement('div');
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
      offerTitle =        'Mjölkchoklad 200g Marabou';
      offerPrice =        '3 för 30 kr';
      offerOnlineLink =   '/mjolkchoklad-200g-marabou-id_p_7310511210403/';
    } else if (id===487) {
      offerImg =          '/09/350x350/2340385800009.jpg';
      offerTitle =        'Präst 31% lagrad 12 mån ca 690g Arla';
      offerPrice =        '89 kr';
      offerOnlineLink =   '/null/';
    }

    // https://www.ica.se/handla/produkt/
    const imgWrapper = document.createElement('div');
      imgWrapper.classList.add('col-3');
    const imgEl = document.createElement('img');
      imgEl.src = 'https://atgcdn-production.prod.vuitonline.com/online/' + offerImg;
      imgEl.alt = offerTitle;
    const titleEl = document.createElement('div');
      titleEl.innerHTML = '<p>' + offerTitle + '</p><p class="price">' + offerPrice + '</p><a href="/null/">Mer info + villkor</p>';
      titleEl.classList.add('col-6');
    const priceEl = document.createElement('div');
      priceEl.classList.add('col-3');
      priceEl.innerHTML = cardSvg;

    imgWrapper.append(imgEl);
    offer.append(imgWrapper);
    offer.append(titleEl);
    offer.append(priceEl);
    offer.classList.add('offer-' + id, 'row');
    offerWrapper.classList.add('offer','pl');
    offerWrapper.append(offer);

    return offerWrapper;
  }

};

$(document).ready(() => {
  Object.assign(test, CROUTIL());
  test.manipulateDom();
});
