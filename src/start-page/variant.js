/* eslint no-inner-declarations: "off" */
/* eslint no-use-before-define: "off" */

// ==UserScript==
// @name         Start-page
// @path         //./src/start-page/variant.js
// @namespace    http://tampermonkey.net/
// @version      0.1
// @match        https://www.ica.se/*
// @grant        none
// ==/UserScript==

import { ICACRO, $ELM } from '../util/main';
import Ratings from '../util/modules/ratings';
import banners from './banners';
// import css from './style';

require('./style.css');

(function ($) {
  'use strict';

  // if (hj) hj('trigger','variant5');// eslint-disable-line
  const test = {
    create(className, parent, text, type) {
      const t = type || 'div';
      const div = document.createElement(t);
      if (text && type === 'img') {
        div.src = text;
      } else if (text) {
        div.appendChild(document.createTextNode(text));
      }
      if (className) div.className = className;
      if (parent) parent.appendChild(div);
      return div;
    },
    addCoupon(coupon) {
      const self = this;
      const couponItem = self.create('coupons-container__item');
      self.create('', couponItem, coupon.image, 'img');
      const wr = self.create('coupons-container__item-wrapper', couponItem);
      self.create('', wr, coupon.title, 'h3');
      self.create('', wr, coupon.discount, 'h1');
      self.create('', wr, coupon.subtitle, 'h4');
      self.create('', wr, 'Mer info', 'a');
      self.create('button coupon-button', couponItem, 'Ladda kupong', 'button');
      return couponItem;
    },
    addBanner(banner) {
      const self = this;
      const bannerContainer = self.create('banner-container', null, null, 'li');
      const bannerWrapper = self.create('banner-wrapper', bannerContainer);
      const ratingContainer = self.create('rating-star-container', bannerWrapper);
      const couponsContainer = self.create('coupons-container', bannerWrapper);

      const couponsWrapper = self.create('coupons-wrapper', couponsContainer);
      const couponsImageContainer = self.create('banner-image', bannerWrapper);
      self.create('image', couponsImageContainer, banner.image, 'img');
      self.create('headline', ratingContainer, banner.title, 'h1');
      self.create('rating', ratingContainer).innerHTML = Ratings(banner.stars);
      self.create('difficulty', ratingContainer, banner.cookTime, 'h4');
      self.createSaveRecipeCTA(banner, bannerWrapper);
      banner.coupons.forEach((coupon) => {
        couponsWrapper.appendChild(self.addCoupon(coupon));
      });
      return bannerContainer;
    },
    addStyle(element, stl) {
      Object.assign(element.style, stl);
    },
    addBanners() {
      const self = this;
      const slider = document.querySelector('.image-slider ul');
      banners.forEach((banner, index) => {
        slider.appendChild(self.addBanner(banner, index));
      });
    },
    addIcaCard() {
      const self = this;
      const icaImageContainer = self.create('ica-card-container');
      self.create('', icaImageContainer, 'Få rabatt med ICA-Kort', 'h1');
      const usps = self.create('usp-list', icaImageContainer, null, 'ul');
      usps.innerHTML = `
      <li><svg viewBox="0 0 32 32" width="15px" height="15px"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/Assets/icons/sprite.svg#check"></use></svg> ICA-kort med bonus</li>
      <li><svg viewBox="0 0 32 32" width="15px" height="15px"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/Assets/icons/sprite.svg#check"></use></svg> Personliga erbjudanden</li>
      <li><svg viewBox="0 0 32 32" width="15px" height="15px"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/Assets/icons/sprite.svg#check"></use></svg> Kortpriser varje vecka</li>
      `;
      self.create('', icaImageContainer, 'https://www.ica.se/ImageVaultFiles/id_78649/cf_3/ICA_Kort_och_Bank.png', 'img');
      self.create('button', icaImageContainer, 'Skapa konto och bli medlem', 'a')
        .href = '/ansokan/?step=6369766963666f726d';
      document.querySelector('.main').appendChild(icaImageContainer);
    },
    dinnerTonight() {
      const container = $ELM.get('.search-recipe-container');
      const recipeTrendingList = $ELM.get('.recipe-trending-list');
      const img = $ELM.create('img').image('/imagevaultfiles/id_124300/cf_259/nyttiga_recept.jpg');
      const seeAll = $ELM.copy('.search-recipe-container__all-recipes');
      this.removeElements(['.search-recipe-container__all-recipes']);
      recipeTrendingList.append(seeAll)
      container.appendFirst(img);
      container.get('h1').text('Vad blir det för middag ikväll?');
    },
    manipulateDom() {
      const recipeId = this.getActionCookie();
      if (recipeId && this.isLoggedIn()) {
        this.addRecipeToShoppingList(recipeId);
        this.saveRecipe(recipeId);
        this.addRecipeToSavedList(recipeId);
      }
      this.removeElements([
        '.image-slider li',
        '.image-slider .lazy-spinner',
        '.header-content',
        '.push-items-list',
        '.quicklink-list',
        '.main .link-list',
        '.recipe-category-listing .banner-image',
        '.recipe-category-listing > .col-12 > h2',
        '.search-recipe-container__recipe-count',
        '.recipe-category-listing .recipe-list-items',
      ]);
      this.addBanners();
      this.createOffers();
      this.addIcaCard();
      this.dinnerTonight();
      const returnUrl = encodeURIComponent(window.location.href);
      const iframeContainer = $(`<div class="cro-iframe-container"><span class="loader"></span><iframe src="//www.ica.se/logga-in/?returnurl=${returnUrl}" frameborder="0"></iframe></div>`);
      $('body').append(iframeContainer);
    },
    createSaveRecipeCTA(banner, parentNode) {
      const self = this;
      const savedRecipes = self.getSavedRecipes();
      if (savedRecipes.includes(banner.recipeId)) return;
      const container = self.create('button-wrapper', parentNode);
      const cta = self.create('button banner-button', container, 'Lägg recept i inköpslistan', 'a');
      cta.href = `/logga-in/?returnUrl=${encodeURIComponent(window.location)}`;
      cta.dataset['recipeId'] = banner.recipeId;
      cta.dataset['tracking'] = `{ "name": "${banner.title}", "URL": "${banner.url}" }`;
      cta.classList.add('js-add-to-new-shoppinglist');
      cta.onclick = (e) => {
        e.preventDefault();
        self.setActionCookie(banner.recipeId);
        self.createModal();
      };
    },
    createOffers() {
      const main = $ELM.get('.main');
      const container = $ELM.create('div coupon-banner');
      // const buttonWrapper = $ELM.create('button-wrapper');
      const h1 = $ELM.create('h1').text('Spara pengar med kuponger');
      const offerButton = $ELM.create('a .button offers-button').text('Gå till ICAs kuponger').href('/erbjudanden/butikserbjudanden/alla-digitala-kuponger/');
      const img = $ELM.create('img').image('//atgcdn-production.prod.vuitonline.com/online/29/350x350/7310130006029.jpg');
      // splash-promotion__price-number
      container.appendAll(h1, img, offerButton);
      main.append(container);
    },
    addRecipeToShoppingList(recipeId) {
      // tracking sker via klassnamn

      ICA.ajax.post('/Templates/Recipes/Handlers/ShoppingListHandler.ashx', {
        recipeIds: [recipeId],
        ShoppingListId: 0,
        numberOfServings: 0,
        recipes: [],
        shoppingListName: createShoppingsListName(),
      });

      function createShoppingsListName() {
        const d = new Date();
        const year = d.getFullYear();
        const month = d.getMonth();
        const day = d.getDate();
        const months = { 10: 'nov', 11: 'dec' }; // testet kommer endast ligga ute i nov, senast dec

        return `Att handla, ${day} ${months[month]} ${year}`;
      }
    },
    saveRecipe(recipeId) {
      const banner = banners.filter(b => b.recipeId === recipeId)[0];

      dataLayer.push({
        event: 'recipe-save',
        name: banner.title,
        URL: banner.url,
      });

      ICA.ajax.get('/Templates/Recipes/Handlers/FavoriteRecipesHandler.ashx', {
        recipeId,
        method: 'Add',
      });
    },
    setActionCookie(recipeId) {
      const d = new Date();
      d.setDate(new Date().getDate() + 1); // expires tomorrow

      ICA.legacy.setCookie('saveRecipeAndAddToShoppingListFromStartpage', recipeId, d);
    },
    getActionCookie() {
      const actionCookie = ICA.legacy.getCookie('saveRecipeAndAddToShoppingListFromStartpage');

      if (actionCookie) {
        ICA.legacy.killCookie('saveRecipeAndAddToShoppingListFromStartpage');
      }

      return +actionCookie; // coerce to number
    },
    addRecipeToSavedList(recipeId) {
      const self = this;
      const d = new Date();
      d.setDate(new Date().getDate() + 1); // expires tomorrow

      const savedRecipes = self.getSavedRecipes();

      savedRecipes.push(recipeId);

      ICA.legacy.setCookie('cro_start_savedRecipes', JSON.stringify(savedRecipes), d);
    },
    getSavedRecipes() {
      const cookie = ICA.legacy.getCookie('cro_start_savedRecipes');
      return cookie ? JSON.parse(cookie) : [];
    },
    // hotjarTriggered: false,
    loaderIsActive: false,
    buttonHandlerPollTimeout: null,
    showLoader() {
      const container = $('.cro-iframe-container');
      container.find('.loader').show();
      container.find('iframe').css('opacity', '0');
      this.loaderIsActive = true;
    },
    hideLoader() {
      const container = $('.cro-iframe-container');
      container.find('.loader').hide();
      container.find('iframe').css('opacity', '1');
      this.loaderIsActive = false;
    },
    addButtonHandlerPoll() {
      const self = this;
      const iframe = $('.cro-iframe-container iframe');
      const e = iframe.contents().find('.remodal-wrapper #grey-card-btn, .remodal-wrapper .pink-card-btn');

      if (e.length) {
        e.click(() => {
          self.showLoader();
        });
        window.clearTimeout(self.buttonHandlerPollTimeout);
      } else {
        self.buttonHandlerPollTimeout = window.setTimeout(
          self.addButtonHandlerPoll.bind(self),
          1000,
        );
      }
    },
    addEventListeners() {
      const self = this;

      $('.header').off('mousedown');

      $(window).on('message onmessage', (e) => {
        const origin = `${window.location.protocol}//${window.location.host}`;
        if (e.originalEvent.origin === origin && /mobilebankid/i.test(e.originalEvent.data)) {
          self.showLoader();
        }
      });
    },
    getIframeStyles() {
      return `<style type="text/css">
        @media  (max-width: 767px) {
        h3.greeting, h3.card-heading { font-size: 18px; }
        img.card-icon { width: 50px; }
        .select-card-modal { border: 0; padding: 0; margin: 0; }
        .remodal-wrapper { padding: 0; }
        }
        </style>`;
    },
    createModal() {
      const self = this;
      const modal = new coreComponents.modal({
        tpl: $('.cro-iframe-container').get(0),
        size: 'md',
        container: $('.modal-container').get(0),
      });

      setTimeout(() => {
        self.showLoader();

        const iframe = $('.cro-iframe-container iframe');

        iframe.on('load', function () {
          const regex = new RegExp(`^${window.location.href}$`, 'gi');
          if (regex.test(this.contentWindow.location)) {
            window.location.reload(true);
          }

          if (this.contentWindow.location.href.indexOf('logga-in') !== -1) {
            let headerBarTimeout = window.setTimeout(hideHeaderBar, 10);
            let appendHeaderTimeout = window.setTimeout(appendHeader, 10);
            let addStylesTimeout = window.setTimeout(addStyles, 10);
            let addIframeTrackingTimeout = window.setTimeout(addIframeTracking, 10);
            const hideHeaderBarDeferred = $.Deferred();
            const appendHeaderDeferred = $.Deferred();
            const addStylesDeferred = $.Deferred();
            const addIframeTrackingDeferred = $.Deferred();

            $.when(
              hideHeaderBarDeferred,
              appendHeaderDeferred,
              addStylesDeferred,
              addIframeTrackingDeferred,
            ).done(() => {
              self.hideLoader();
            });

            function hideHeaderBar() {
              const e = $('.cro-iframe-container iframe').contents().find('.header-bar');
              if (e.length) {
                e.hide();
                window.clearTimeout(headerBarTimeout);
                hideHeaderBarDeferred.resolve();
              } else {
                headerBarTimeout = window.setTimeout(hideHeaderBar, 0);
              }
            }

            function appendHeader() {
              const e = $('.cro-iframe-container iframe').contents().find('h1');
              if (e.length) {
                e.append(' för att lägga till i inköpslistan och spara recept');
                e.css({ 'font-family': 'icahand, arial, sans-serif', 'font-size': '3rem' });

                if (window.screen.width < 768) {
                  e.css('font-size', '18px');
                  e.parent().css('margin', '0');
                }
                window.clearTimeout(appendHeaderTimeout);
                appendHeaderDeferred.resolve();
              } else {
                appendHeaderTimeout = window.setTimeout(appendHeader, 0);
              }
            }

            function addStyles() {
              const e = $('.cro-iframe-container iframe').contents().find('body');
              if (e.length) {
                e.append(self.getIframeStyles());
                window.clearTimeout(addStylesTimeout);
                addStylesDeferred.resolve();
              } else {
                addStylesTimeout = window.setTimeout(addStyles, 0);
              }
            }

            function addIframeTracking() {
              const e = $('.cro-iframe-container iframe').contents();
              if (e.length) {
                const eventAction = 'Spara recept från startsidan';

                // Fortsätt (Mobilt BankId)
                e.find('#submit-login-mobile-bank-id').on('click', () => {
                  ga('send', 'event', 'A/B', eventAction, 'Logga in - Mobilt BankId');
                });

                // Behöver du hjälp (Mobilt BankId)
                e.find('.login-support-bank-id-link').on('click', () => {
                  ga('send', 'event', 'A/B', eventAction, 'Behöver du hjälp');
                });

                // Skapa konto (Mobilt BankId)
                e.find('.get-mobile-bank-id-link').on('click', () => {
                  ga('send', 'event', 'A/B', eventAction, 'Skapa konto - Mobilt BankId');
                });

                // Logga in (Lösenord)
                e.find('#log-in-submit').on('click', () => {
                  ga('send', 'event', 'A/B', eventAction, 'Logga in - Lösenord');
                });

                // Glömt lösenord (Lösenord)
                e.find('.login-support-password-link').on('click', () => {
                  ga('send', 'event', 'A/B', eventAction, 'Glömt lösenord');
                });

                // Skapa konto (Lösenord)
                e.find('.create-account-link').on('click', () => {
                  ga('send', 'event', 'A/B', eventAction, 'Skapa konto - Lösenord');
                });

                window.clearTimeout(addIframeTrackingTimeout);
                addIframeTrackingDeferred.resolve();
              } else {
                addIframeTrackingTimeout = window.setTimeout(addIframeTracking, 0);
              }
            }
          }

          $('.cro-iframe-container iframe').contents().find('form').on('submit', function () {
            if (!$(this).find('input.error').length) {
              self.showLoader();
            }
          });

          $('.cro-iframe-container iframe').contents().find('#submit-login-mobile-bank-id').on('click', function () {
            if (!$(this).find('input.error').length) {
              self.buttonHandlerPollTimeout = setTimeout(
                self.addButtonHandlerPoll.bind(self),
                1000,
              );
            }
          });

          $('.cro-iframe-container iframe').contents().find('a[href*="www.ica.se"]').each(function () {
            $(this).attr('href', $(this).attr('href').replace('http://', 'https://'));
          })
            .click(function (e) {
              window.location.href = $(this).attr('href');
              e.preventDefault();
            });
        });

        // trigga hotjar heatmap första gången modalen öppnats
        // if (typeof hj === 'function' && !self.hotjarTriggered) {
        //     hj('trigger', 'variant');
        //     self.hotjarTriggered = true;
        // }
      }, 50);
    },
  };

  $(document).ready(() => {
    if (/^https:\/\/www.ica.se\/$/.test(window.location)) {
      Object.assign(test, ICACRO());
      // test.style(css);
      test.manipulateDom();
      test.addEventListeners();
      ICA.icaCallbacks.initUnslider();
    }
  });
})(jQuery);
