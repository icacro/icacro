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

//länk till bilder: https://handla.ica.se/?setWeekNumber=50
// todo:
          // - ta bort knapp i modalen
// - byta ut erbjudanden till v. 50
          // - lägg till scroll-tracking, se recipe-inf-scroll-2
// - kolla (ta bort/lägg till) undantag som vetemjöl - gluten etc...
// - skapa fake-orginal
          // - modal vid klick på Erbjudandeflagga

let offerInfoViewed = 0; // tracking av visad information på receptsidor

const recipes = document.getElementById('recipes'); // mdsa-sida
const recipe = document.querySelector('.recipepage'); // recept-receptsida

// namn på erbjudanden, ändra här
const recipeFlag = ['kycklingfilé','kycklingbröstfilé','blandfärs','nötfärs','snabbkaffe','pulverkaffe',
  'prästost','herrgård','herrgårdsost','cheddarost','grevéost'];

const cardSvg = '<svg width="48px" height="48px"><svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 55 38" id="ica-card" width="100%" height="100%"><g fill="none" fill-rule="evenodd"><path d="M43.557 3.9H7.404c-.9 0-1.637.726-1.637 1.613v21.475c0 .888.737 1.614 1.637 1.614h3.372v6.204l9.464-6.204h23.317c.9 0 1.636-.726 1.636-1.614V5.513c0-.887-.736-1.613-1.636-1.613" fill="#F6C8DF"></path><path d="M10.776 7.107c0-.074.05-.123.125-.123h1.897c.075 0 .125.037.125.123v3.298l2.446-3.347c.037-.05.074-.074.15-.074h2.232c.1 0 .138.062.075.148l-2.807 3.715 3.106 4.602c.05.085.025.147-.087.147h-2.345c-.075 0-.112-.025-.15-.086l-2.62-3.96v3.924c0 .073-.037.123-.125.123H10.9c-.074 0-.124-.05-.124-.123V7.107z" fill="#E10817"></path><path d="M23.725 11.29c0-1.17-.7-2.35-2.072-2.35s-2.07 1.18-2.07 2.35c0 1.17.71 2.35 2.07 2.35 1.36 0 2.072-1.18 2.072-2.35m-6.288 0c0-2.423 1.722-4.43 4.216-4.43 2.496 0 4.217 2.007 4.217 4.43 0 2.436-1.71 4.43-4.217 4.43-2.507 0-4.216-1.994-4.216-4.43m12.463-.627c.71 0 1.034-.332 1.034-.86 0-.543-.324-.887-1.035-.887h-1.024v1.747H29.9zm-3.17-3.556c0-.074.05-.123.125-.123h3.18c1.873 0 3.058 1.243 3.058 2.818 0 1.07-.562 1.968-1.522 2.41l1.985 3.237c.05.085.01.147-.088.147h-2.22c-.076 0-.113-.025-.15-.086l-1.672-2.977h-.55v2.94c0 .087-.037.124-.124.124h-1.895c-.075 0-.125-.05-.125-.123V7.107zm8.97 1.809h-2.234c-.1 0-.137-.062-.1-.148l.787-1.685c.024-.075.074-.1.136-.1h5.476c.088 0 .125.038.125.124v1.686c0 .074-.036.123-.124.123h-1.91v6.558c0 .086-.036.123-.123.123h-1.91a.117.117 0 0 1-.123-.123V8.916zM14.095 20.573c.686 0 1.01-.467 1.01-.984 0-.53-.324-1.01-1.01-1.01h-1.173v1.993h1.173zm-3.32-3.802c0-.073.05-.122.126-.122h3.307c1.872 0 3.057 1.366 3.057 2.94 0 1.563-1.185 2.916-3.057 2.916h-1.285v2.634c0 .074-.037.123-.125.123H10.9c-.074 0-.124-.048-.124-.122v-8.37zm10.393 3.556c.71 0 1.035-.332 1.035-.86 0-.543-.324-.887-1.035-.887h-1.023v1.747h1.023zm-3.17-3.556c0-.073.05-.122.126-.122h3.18c1.872 0 3.058 1.243 3.058 2.818 0 1.07-.562 1.968-1.522 2.41l1.983 3.237c.05.086.012.148-.087.148h-2.22c-.076 0-.113-.024-.15-.085l-1.672-2.978h-.55v2.94c0 .087-.037.124-.124.124h-1.896c-.075 0-.125-.048-.125-.122V16.77zm7.36-.001c0-.073.037-.122.125-.122h1.896c.074 0 .124.037.124.123v8.368c0 .074-.038.123-.125.123h-1.897c-.075 0-.125-.048-.125-.122v-8.37zm3.617 5.92c.037-.087.1-.1.175-.05.35.27.985.664 1.796.664.724 0 .998-.308.998-.688 0-.444-.524-.628-1.16-.837-1.035-.346-2.395-.752-2.395-2.523 0-1.477 1.084-2.732 3.142-2.732 1.136 0 1.934.394 2.258.64.063.037.076.098.04.16l-.763 1.698c-.037.086-.1.098-.174.05-.313-.247-.836-.47-1.485-.47-.55 0-.86.26-.86.604 0 .394.51.58 1.097.776 1.035.332 2.433.75 2.433 2.633 0 1.575-1.135 2.768-3.156 2.768-1.373 0-2.27-.517-2.67-.824-.063-.05-.075-.112-.038-.173l.76-1.698z" fill="#E10817"></path></g></svg></svg>';

const test = {

  manipulateDom() {

    $.fn.isInViewport = function() {
      var elementTop = $(this).offset().top + 150;
      var elementBottom = elementTop + $(this).outerHeight() + 150;
      var viewportTop = $(window).scrollTop();
      var viewportBottom = viewportTop + $(window).height();
      return elementBottom > viewportTop && elementTop < viewportBottom;
    };

    if (recipes) {

      let recipesObserver = new MutationObserver(function(mutations) {
        for (var i = 0; i < mutations.length; i++) {
          const unchecked = recipes.querySelectorAll('article:not(flag-check)');
          if (unchecked) {
            for (var j = 0; j < unchecked.length; j++) {
              const article = unchecked[j];
              const ingredientsList = article.querySelector('span.ingredients');
              if(ingredientsList != null) {
                const recipeIngredients = ingredientsList.getAttribute('title').split(/\r?\n/);
                if (!article.querySelector('span.icon-offer')) {
                  const iconOffer = document.createElement('span');
                  iconOffer.classList.add('icon-offer');
                  iconOffer.innerHTML = cardSvg;
                  article.prepend(iconOffer);
                }
                test.checkRecipesMDSA(recipeIngredients,article);
              }
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

      $(window).on('resize scroll', function() {
        if (offerInfoViewed === 0) {
          if($('div.button.button-round.js-open-shoppinglist-modal').isInViewport()) {
            console.log("gaPush({ eventAction: 'rec-engine-offer: erbjudande visat'});");
            offerInfoViewed = 1;
          }
        }
      });

      const recipeIngredients = document.querySelector('head meta[name="ingredients"]').getAttribute('content').split(',');

      for (var i = 0; i < recipeIngredients.length; i++) {
        let offerId = 0;
        const recipeIngredient = recipeIngredients[i];
        const recipeIndex = recipeFlag.indexOf(recipeIngredient);
        if (recipeIndex !== -1) {

          //Sätt erbjudande-id

          if (recipeIngredient === 'kycklingfilé' || recipeIngredient === 'kycklingbröstfilé') {
            offerId = 481;
          } else if (recipeIngredient === 'blandfärs') {
            /*const title = document.querySelector('.recipepage__headline').innerHTML;
            const preamble = document.querySelector('.recipe-preamble').innerHTML;
            if (test.checkException(recipeIngredient,title,preamble)) { */
              offerId = 482;
            //}
          } else if (recipeIngredient === 'nötfärs') {
            offerId = 483;
          } else if (recipeIngredient === 'snabbkaffe' || recipeIngredient === 'pulverkaffe') {
            offerId = 484;
          } else if (recipeIngredient === 'prästost' || recipeIngredient === 'herrgård' || recipeIngredient === 'herrgårdsost' || recipeIngredient === 'cheddarost' || recipeIngredient === 'grevéost') {
            offerId = 485;
          }

          if (offerId !== 0) {

            //Tracking visad
            console.log("gaPush({ eventAction: 'Erbjudande visas på receptsida', eventLabel: " + recipeIngredient + " });");
            //gaPush({ eventAction: 'Erbjudande visas på receptsida', eventLabel: recipeIngredient });

            //Markera ingrediens

            const ingredientsItems = document.getElementById('ingredients-section').querySelectorAll('ul li');
            for (var j = 0; j < ingredientsItems.length; j++) {
              if (ingredientsItems[j].innerHTML.indexOf(recipeIngredient) !== -1 && !ingredientsItems[j].querySelector('span.icon-offer')) {
                ingredientsItems[j].classList.add('flag');
                const iconOffer = document.createElement('span');
                iconOffer.classList.add('icon-offer');
                iconOffer.innerHTML = cardSvg;
                ingredientsItems[j].prepend(iconOffer);
                iconOffer.addEventListener("click", function(e) {
                  test.createModal(test.getOfferDetails(offerId));
                });
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
        /*if (recipeIngredient === 'smör' || recipeIngredient === 'vetemjöl') {
          const title = article.querySelector('header h2 a').innerHTML;
          const preamble = article.querySelector('.content.sm_hidden a p').innerHTML;
          if (test.checkException(recipeIngredient,title,preamble)) {
            test.flagMDSA(article,recipeIngredient);
          }
        } else {*/
          test.flagMDSA(article,recipeIngredient);
        //}
      }
    }
  },

  flagMDSA(article,recipeIngredient) {
    article.classList.add('flag-on');
    //Tracking visad + klickad
    console.log("gaPush({ eventAction: 'Erbjudandeflagga på MDSA', eventLabel: " + recipeIngredient + " });");
    //gaPush({ eventAction: 'Erbjudandeflagga på MDSA', eventLabel: recipeIngredient });
  },

  getOfferDetails(id) {
    //const imageUrl = "https://atgcdn-production.prod.vuitonline.com/online/";
    if(id == 481) {
      return {
        image: "https://assets.icanet.se/t_product_large_v1,f_auto/7300322544002.jpg",
        title: "Kycklingfilé Fryst 1kg",
        info: "Kronfågel",
        price: "75 kr",
        extra: "jfr-pris 75:00 kr/kg. Kronfågel. Ursprung Sverige. Fryst. 1000 g"};
    }
    if(id == 482) {
      return {
        image: "https://assets.icanet.se/t_product_large_v1,f_auto/2319102200002.jpg",
        title: "Blandfärs",
        info: "ICA",
        price: "39:90/kg",
        extra: "ICA, ursprung Sverige, storpack, max 22% fetthalt. Max 2 köp/kund"};
    }
    if(id == 483) {
      return {
        image: "https://assets.icanet.se/t_product_large_v1,f_auto/2319103200001.jpg",
        title: "Nötfärs",
        info: "ICA",
        price: "59:90/kg",
        extra: "ICA, ursprung Sverige, storpack, max 12% fetthalt. Max 2 köp/kund"};
    }
    if(id == 484) {
      return {
        image: "https://assets.icanet.se/t_product_large_v1,f_auto/7613031210374.jpg",
        title: "Snabbkaffe",
        info: "Nescafé",
        price: "49:90 kr",
        extra: "Nescafé, 200 g, gäller mellanrost i påse, jmfpris 249:50/kg"};
    }
    if(id == 485) {
      return {
        image: "https://assets.icanet.se/t_product_large_v1,f_auto/2324623300001.jpg",
        title: "Ost",
        info: "Allerum",
        price: "89:90/kg",
        extra: "Grevé, Präst, Herrgård, Svecia, Cheddar, Allerum, ca 700 g, 28-35%, vällagrad 11-14 mån. Max 2 köp/kund"};
    }
  },

  getOffer(id) {
    const offerWrapper = document.createElement('div');
    const offer = document.createElement('div');
    const offerInfo = test.getOfferDetails(id);

    const imgWrapper = document.createElement('div');
      imgWrapper.classList.add('col-3');
    const imgEl = document.createElement('img');
      imgEl.src = offerInfo.image;
      imgEl.alt = offerInfo.title;
    const titleEl = document.createElement('div');
      titleEl.innerHTML = '<p class="title">' + offerInfo.title + '</p><p class="price">' + offerInfo.price + '</p><p class="info">' + offerInfo.info + '</p><p class="link"><a href="#">Mer info</a></p>' + cardSvg;
      titleEl.classList.add('col-9');

    imgWrapper.append(imgEl);
    offer.append(imgWrapper);
    offer.append(titleEl);
    offer.classList.add('offer-' + id, 'row');
    offerWrapper.classList.add('offer','pl');
    offerWrapper.append(offer);

    offerWrapper.addEventListener('click', function(event){
      event.preventDefault();
      //Tracking klickad:
      console.log("gaPush({ eventAction: 'Öppnat erbjudande på recept', eventLabel: " + offerInfo.title + " });");
      //gaPush({ eventAction: 'Öppnat erbjudande på recept', eventLabel: offerTitle });
      test.createModal(offerInfo);
    });

    return offerWrapper;
  },

  createModal(offer) {
    const modal = document.createElement('div');
    modal.classList.add('pl-modal');
    const modalWrapper = document.createElement('div');
    modalWrapper.classList.add('pl-modal__window');
    const modalInner = document.createElement('div');
    modalInner.classList.add('hse-campaign');
    const modalClose = document.createElement('a');
    modalClose.classList.add('button','button--icon','pl-modal__close-button','button--link');
    modalClose.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="3.092778444290161 4.548774719238281 17.0854434967041 17.08416748046875"><path d="M15.224 13.091l4.582 4.606q.315.291.364.691t-.194.667q-1.042 1.333-2.376 2.376-.267.242-.667.194t-.715-.339l-4.582-4.606-4.606 4.606q-.291.291-.691.339t-.691-.194q-1.309-1.042-2.352-2.352-.242-.291-.194-.691t.339-.691l4.606-4.606-4.582-4.582q-.315-.315-.364-.715t.194-.667q1.018-1.309 2.352-2.376.291-.242.691-.194t.691.364l4.606 4.388 4.582-4.388q.315-.315.715-.364t.667.194q1.333 1.042 2.376 2.376.242.267.194.667t-.364.715z"></path></svg>';

    const modalHeader = document.createElement('div');
    modalHeader.classList.add('hse-campaign__header');
    modalHeader.innerHTML = 'Erbjudande';

    const sectionWrapper = document.createElement('section');
    sectionWrapper.classList.add('hse-campaign__section');

    const offerContent = document.createElement('div');
    offerContent.classList.add('hse-campaign__offer__content-section');
    const offerWrapper = document.createElement('div');
    offerWrapper.classList.add('hse-campaign__offer__wrapper');
    /*const shoppingList = document.createElement('a');
    shoppingList.classList.add('button');
    shoppingList.href = '#';
    shoppingList.innerHTML = 'Lägg till i inköpslistan';*/

    offerContent.append(offerWrapper);
    offerWrapper.innerHTML = '<div class="hse-campaign__offer__content-container"><div class="hse-campaign__offer__image"><img src="' + offer.image + '" alt="' + offer.title + '"></div><div class="hse-campaign__offer__offer-info"><div class="hse-campaign__offer__name">' + offer.title + '</div> <div class="hse-campaign__offer__condition">' + offer.price + '</div></div></div><div class="hse-campaign__offer__more-info"><p class="hse-campaign__offer__disclaimer hse-campaign__offer__disclaimer--product">' + offer.extra + '</p><p class="hse-campaign__offer__disclaimer">Gäller v 50 med ICA Kort. Lägre priser och avvikelser i sortiment kan förekomma både i butik och online.</p></div>';
    //offerWrapper.append(shoppingList);

    sectionWrapper.append(offerContent);
    modalInner.append(modalHeader);
    modalInner.append(sectionWrapper);
    modalInner.append(modalClose);
    modalWrapper.append(modalInner);
    modal.append(modalWrapper);

    document.querySelector('.modal-container.pl').append(modal);

    modalClose.addEventListener('click', function(event){
      event.preventDefault();
      document.querySelector('.modal-container.pl .pl-modal').remove();
    });

    /*shoppingList.addEventListener('click', function(event){
      event.preventDefault();
      //Tracking klickad:
      console.log("gaPush({ eventAction: 'Klick inköpslista', eventLabel: " + offerTitle + " });");
      //gaPush({ eventAction: 'Klick inköpslista', eventLabel: offerTitle });
      alert('Hoppsan, något gick fel och vi lyckades tyvärr inte uppdatera din inköpslista.');
    });*/

  }

};

$(document).ready(() => {
  Object.assign(test, CROUTIL());
  test.manipulateDom();
});
