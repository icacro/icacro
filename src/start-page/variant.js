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
import { styles } from './style'

(function ($) {
  'use strict';

  const banners = [
    {
      recipeId: 721648,
      title: 'Semmelmuffins',
      stars: 4,
      cookTime: '60 MIN | MEDEL',
      image: 'https://www.ica.se/imagevaultfiles/id_155248/cf_259/semmelmuffins-721648-stor.jpg',
      url: 'https://www.ica.se/recept/semmelmuffins-721648/',
      coupons: [
        {
          title: 'Margarin',
          image: 'https://www.ica.se/Handlers/Image.ashx?w=150&h=150&m=p&bgr=fff&u=http://extbild.ica.se//PictureWeb/80/1026/14_1000555305.jpg',
          discount: '5 kr rabatt',
          subtitle: 'Milda 1 kg',
          url: '',
        },
        {
          title: 'Mandelmassa',
          image: 'https://www.ica.se/Handlers/Image.ashx?w=150&h=150&m=p&bgr=fff&u=http://extbild.ica.se//PictureWeb/80/1044/14_1000555323.jpg',
          discount: '25% rabatt',
          subtitle: 'ICA 200 g',
          url: '',
        },
      ],
    },
    {
      recipeId: 721668,
      title: 'Viltskavsgryta med messmör och lingon',
      stars: 4,
      cookTime: '45 MIN | MEDEL',
      image: 'https://www.ica.se/imagevaultfiles/id_155280/cf_259/viltskavsgryta-med-messmor-och-lingon-721658-liten.jpg',
      url: 'https://www.ica.se/recept/viltskavsgryta-med-messmor-och-lingon-721668/',
      coupons: [
        {
          title: 'Margarin',
          image: 'https://www.ica.se/Handlers/Image.ashx?w=150&h=150&m=p&bgr=fff&u=http://extbild.ica.se//PictureWeb/80/1026/14_1000555305.jpg',
          discount: '5 kr rabatt',
          subtitle: 'Milda 1 kg',
          url: '',
        },
        {
          title: 'Buljongkuber',
          image: 'https://www.ica.se/Handlers/Image.ashx?w=150&h=150&m=p&bgr=fff&u=http://extbild.ica.se//PictureWeb/80/1028/14_1000555307.jpg',
          discount: '25% rabatt',
          subtitle: 'Knorr 6-pack',
          url: '',
        },
      ],
    },
    {
      recipeId: 721644,
      title: 'Torsk med potatis och äggsås i kastrull',
      stars: 4,
      cookTime: '60 MIN | MEDEL',
      image: 'https://www.ica.se/imagevaultfiles/id_155207/cf_259/torsk-med-potatis-och-aggsas-i-kastrull-721634-lit.jpg',
      url: 'https://www.ica.se/recept/torsk-med-potatis-och-aggsas-i-kastrull-721644/',
      coupons: [
        {
          title: 'iMat',
          image: 'https://www.ica.se/Handlers/Image.ashx?w=150&h=150&m=p&bgr=fff&u=http://extbild.ica.se//PictureWeb/80/1029/14_1000555308.jpg',
          discount: '15% rabatt',
          subtitle: 'Oatly 250 g',
          url: '',
        },
        {
          title: 'Torskfilé',
          image: 'https://www.ica.se/Handlers/Image.ashx?w=150&h=150&m=p&bgr=fff&u=http://extbild.ica.se//PictureWeb/80/1038/14_1000555317.jpg',
          discount: '5 kr i rabatt',
          subtitle: 'ICA 600 g',
          url: '',
        },
      ],
    },
  ];

  // if (hj) hj('trigger','variant5');// eslint-disable-line
  const test = {
    hideElements() {
      [
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
      ].forEach((element) => {
        const elm = document.querySelector(element);
        elm.parentNode.removeChild(elm);
      });
    },
    toArray(list) {
      return Array.prototype.slice.call(list);
    },
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
    addStars(stars) {
      const arr = ['0', '26', '52', '78', '104'];
      const strs = arr.map((x, index) => (
        `<g transform="translate(${x} 0)" class="${index < stars ? 'active' : ''}">
        <path d="M23.2 10.303q.194.509-.073.97-1.188 2.182-5.067 5.479 1.018 4.194 1.212 6.715.049.679-.533 1.067-.315.194-.63.194-.242 0-.533-.121-.412-.242-1.333-.679-3.273-1.624-4.606-2.473-1.333.849-4.606 2.473-.921.436-1.333.679-.606.315-1.164-.073-.582-.388-.533-1.067.194-2.521 1.212-6.715-3.879-3.297-5.067-5.479-.267-.461-.073-.97.17-.509.63-.679 1.358-.606 6.861-.8 1.988-5.77 3.248-7.03.388-.339.824-.339.461 0 .8.339 1.285 1.261 3.273 7.03 5.503.194 6.861.8.461.194.63.679z"></path>
        </g>`));
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-0.12099626660346985 1.4550001621246338 127.39400121569633 25.34600469470024">
        <linearGradient id="half" x1="0" x2="100%" y1="0" y2="0">
        <stop offset="50%" stop-color="currentColor"></stop>
        <stop offset="50%" stop-color="#d5d7da"></stop>
        </linearGradient>
        ${strs.join('')}
        </svg>`;
    },
    addCoupon(coupon) {
      const [
        container,
        img,
        title,
        discount,
        subtitle,
        moreInfo,
        button,
      ] = $ELM.create(
        'shadow coupons-container__item',
        'coupons-image',
        'h3',
        'h1',
        'h4',
        'a',
        'button .button coupon-button',
      );

      img.style({ 'background-image': `url(${coupon.image})` });
      title.text(coupon.title);
      discount.text(coupon.discount);
      subtitle.text(coupon.subtitle);
      moreInfo.text('Mer info');
      button.text('Ladda kupong');

      container.appendAll(img, title, discount, subtitle, moreInfo, button);

      return container.element;
    },
    addBanner(banner, index) {
      const self = this;
      const bannerContainer = self.create('banner-container', null, null, 'li');
      const bannerWrapper = self.create('banner-wrapper', bannerContainer);
      const ratingContainer = self.create('rating-star-container', bannerWrapper);
      const couponsContainer = self.create('coupons-container', bannerWrapper);

      const couponsWrapper = self.create('coupons-wrapper', couponsContainer);
      const couponsImageContainer = self.create('banner-image', bannerWrapper);
      self.create('image', couponsImageContainer, banner.image, 'img');

      self.create('offer-text', ratingContainer, 'Erbjudande på:', 'h3');
      self.create('headline', ratingContainer, banner.title, 'h1');
      self.create('rating', ratingContainer).innerHTML = self.addStars(banner.stars);
      self.create('difficulty', ratingContainer, banner.cookTime, 'h4');
      self.createSaveRecipeCTA(banner, bannerWrapper);
      banner.coupons.forEach((coupon) => {
        couponsWrapper.appendChild(self.addCoupon(coupon));
      });
      return bannerContainer;
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
      self.create('', icaImageContainer, 'ICA-Kortet ger mer rabatt!', 'h1');
      self.create('', icaImageContainer, 'Bli ICA-bonusmedlem.', 'h3');
      self.create('', icaImageContainer, 'https://www.ica.se/ImageVaultFiles/id_61323/cf_259/ansok-ica-kort.png', 'img');
      const usps = self.create('usp-list', icaImageContainer, null, 'ul');
      usps.innerHTML = `
      <li><svg viewBox="0 0 32 32" width="15px" height="15px"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/Assets/icons/sprite.svg#check"></use></svg> ICA-kort med bonus</li>
      <li><svg viewBox="0 0 32 32" width="15px" height="15px"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/Assets/icons/sprite.svg#check"></use></svg> Personliga erbjudanden</li>
      <li><svg viewBox="0 0 32 32" width="15px" height="15px"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/Assets/icons/sprite.svg#check"></use></svg> Kortpriser varje vecka</li>
      `;
      self.create('button', icaImageContainer, 'Skapa konto och bli medlem', 'a')
        .href = '/ansokan/?step=6369766963666f726d';
      document.querySelector('.main').appendChild(icaImageContainer);
    },
    manipulateDom() {
      const recipeId = this.getActionCookie();
      if (recipeId && this.isLoggedIn()) {
        this.addRecipeToShoppingList(recipeId);
        this.saveRecipe(recipeId);
        this.addRecipeToSavedList(recipeId);
      }

      this.hideElements();
      this.addBanners();
      this.createOffers();
      this.addIcaCard();

      const returnUrl = encodeURIComponent(window.location.href);
      const iframeContainer = $(`<div class="cro-iframe-container"><span class="loader"></span><iframe src="//www.ica.se/logga-in/?returnurl=${returnUrl}" frameborder="0"></iframe></div>`);
      $('body').append(iframeContainer);
    },
    createSaveRecipeCTA(banner, parentNode) {
      const self = this;
      const savedRecipes = self.getSavedRecipes();
      if (savedRecipes.includes(banner.recipeId)) return;

      const cta = self.create('button banner-button', parentNode, 'Lägg till i inköpslistan och spara recept', 'a');
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
      const container = document.querySelector('.main');
      const buttonWrapper = this.create('button-wrapper');
      const offerButton = this.create('button offers-button', buttonWrapper, 'Erbjudande sidan', 'a');
      offerButton.href = '/erbjudanden/butikserbjudanden/alla-digitala-kuponger/';
      container.insertBefore(offerButton, container.childNodes[0]);
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
      test.style(styles);
      test.manipulateDom();
      test.addEventListeners();
      ICA.icaCallbacks.initUnslider();
    }
  });
})(jQuery);
