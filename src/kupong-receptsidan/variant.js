// ==UserScript==
// @name         Kupong-receptsidan
// @path         //./src/kupong-receptsidan/variant.js
// @namespace    http://tampermonkey.net/
// @version      0.1
// @match        https://www.ica.se/*
// @grant        none
// ==/UserScript==

import { CROUTIL, ELM } from '../util/main';
import { isLoggedIn, storage, ajax } from '../util/utils';
import { removeElements, elements } from '../util/functions';

import './style.css';

(function ($) {
  'use strict';

  const loadedCupons = [];
  const LOGIN_ACTION = {
    SAVE_RECIPE: 'SPARA',
    LOAD_COUPON: 'LADDA',
  };
  const test = {
    manipulateDom() {
      const section = ELM.get('#ingredients-section');
      section.append(this.createCoupons());

      $('.coupon-list').slick({
        dots: true,
        arrows: false,
        autoplay: true,
        autoplaySpeed: 5000,
        fade: true,
        slidesToShow: 1,
      });
      this.elements('.js-loggin-btn').forEach(element => element.click(this.onClick.bind(this)));
    },
    createCoupons() {
      const container = ELM.create('coupon-list');
      loadedCupons.forEach(c => container.append(this.createCoupon(c)));
      return container;
    },
    deactivateCoupon(target) {
      target.css('is-used');
    },
    onClick(e) {
      e.preventDefault();

      const target = ELM.get(e.currentTarget);
      const id = target.data('id');
      const {
        PageName,
        CampaignId,
        Offer,
        StoreId,
        StoreGroupId,
      } = loadedCupons[id];

      const { OfferId, ProductName } = Offer;

      const dataObj = {
        id,
        CampaignId,
        ProductName,
        PageName,
        OfferId,
        StoreId,
        StoreGroupId,
      };

      if (this.isLoggedIn()) {
        this.deactivateCoupon(target);
        this.loadCouponOnCard(dataObj);
        icadatalayer.add('HSE', {
          HSE: {
            action: 'coupon-loaded',
            name: PageName,
            offer: ProductName,
            hseurl: `/kampanj/hse/${id}`,
          },
        });
      } else {
        icadatalayer.add('HSE', {
          HSE: {
            action: 'login-mousedown',
            name: PageName,
            hseurl: `/kampanj/hse/${id}`,
          },
        });
        this.createModal(LOGIN_ACTION.LOAD_COUPON);
        this.storage.set('cro_personalOffer_actionCookie_loadCoupon', id);
      }
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
    createModal(action = LOGIN_ACTION.SAVE_RECIPE) {
      const self = this;
      new coreComponents.modal({
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
                const message = (action === LOGIN_ACTION.SAVE_RECIPE)
                  ? ' för att lägga till i inköpslistan och spara recept'
                  : ' för att ladda kupongen';
                e.append(message);
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
                const eventAction = (action === LOGIN_ACTION.SAVE_RECIPE)
                  ? 'Spara recept från receptsidan'
                  : 'Ladda kupong från receptsidan';

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
    createCoupon(coupon) {
      const wrapper = ELM.create('personal-offer__coupon');
      const loginUrl = `/logga-in?returnUrl=${encodeURIComponent(window.location)}`;
      const imageUrl = /Handlers/.test(coupon.Offer.Image.ImageUrl)
        ? coupon.Offer.Image.ImageUrl
        : `/Handlers/Image.ashx?w=150&h=150&m=p&bgr=fff&u=${coupon.Offer.Image.ImageUrl}`;
      const isUsed = coupon.Offer.LoadedOnCard ? ' is-used' : '';
      const kupongCta = `<button data-id="${coupon.id}" data-url="" data-login-url="${loginUrl}" class="button button--auto-width button--load-coupon js-loggin-btn ${isUsed}">
      ${coupon.Offer.LoadedOnCard ? 'Kupong laddad' : 'Ladda kupong'}
      </button>`;
      const kupongTemplate =
      `<article class="hse-recipe-list ${coupon.Offer.LoadedOnCard ? 'offer-loaded' : ''}">
        <div class="hse-recipe-list__wrapper">
          <div class="hse-recipe-list__image">
            <picture>
            <img src="${imageUrl}">
            </picture>
          </div>
          <div class="hse-recipe-list__offer-content">
            <h1>${coupon.Header}</h1>
            <span>${coupon.Offer.OfferCondition.Conditions[0]}</span>
            <p>${coupon.Offer.Brand} ${coupon.Offer.SizeOrQuantity.Text}</p>
            <a href="/kampanj/hse/${coupon.id}">Mer info</a>
          </div>
          <div class="coupon-load-wrapper" data-offerid="${coupon.Offer.OfferId}">
            ${kupongCta}
          </div>
        </div>
      </article>`;
      wrapper.html(kupongTemplate);
      return wrapper;
    },
    loadCoupons() {
      const oldCoupons = ELM.get('.slick-track').children();
      const ids = oldCoupons.map(c => /kampanj\/hse\/(\d+)/.exec(c.attr('href'))[1]);
      this.removeElements(['.recipe-ad']);

      if (oldCoupons.length === 0) {
        return Promise.reject();
      }
      return Promise.all(ids.map(this.loadCouponData));
    },
    loadCouponData(id) {
      return loadedCupons[id]
        ? Promise.resolve(loadedCupons[id])
        : window.fetch(`/api/jsonhse/${id}`, { credentials: 'same-origin' })
          .then(response => response.json())
          .then((json) => {
            loadedCupons[id] = Object.assign({ id }, json);
            return json;
          });
    },
    loadCouponOnCard(dataObj) {
      if (!dataObj) return Promise.reject();
      const opts = {
        OfferId: parseInt(dataObj.Offer.OfferId, 10),
        CampaignId: parseInt(dataObj.CampaignId, 10),
        StoreId: parseInt(dataObj.StoreId, 10),
        StoreGroupId: parseInt(dataObj.StoreGroupId, 10),
      };
      return this.ajax(`/api/jsonhse/Claimoffer`, {
        credentials: 'same-origin',
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(opts),
      });
    },
    checkActionCookie() {
      const id = this.storage.get('cro_personalOffer_actionCookie_loadCoupon');
      if (id && this.isLoggedIn()) {
        this.loadCouponOnCard(loadedCupons[id]).then(this.changeOfferStatus.bind(this));
      }
    },
    changeOfferStatus(response) {
      if (response.ok) {
        const id = this.storage.get('cro_personalOffer_actionCookie_loadCoupon');
        const btn = ELM.get(`[data-id='${id}']`);
        btn.css('is-used');
        btn.text('Kupong laddad');
        this.storage.remove('cro_personalOffer_actionCookie_loadCoupon');
      }
    },
  };

  $(document).ready(() => {
    Object.assign(test, CROUTIL({
      removeElements,
      ajax,
      isLoggedIn,
      storage,
      elements,
    }));

    test.loadCoupons().then(
      () => {
        const returnUrl = encodeURIComponent(window.location.href);
        const iframeContainer = $(`<div class="cro-iframe-container"><span class="loader"></span><iframe src="//www.ica.se/logga-in/?returnurl=${returnUrl}" frameborder="0"></iframe></div>`);
        $('body').append(iframeContainer);
        test.checkActionCookie();
        test.manipulateDom({});
        if (hj) hj('trigger', 'variant6');
      },
      () => {}, // couldn't find coupons
    );
  });
})(jQuery);
