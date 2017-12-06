// ==UserScript==
// @name         Kupong-receptsidan
// @path         //./src/kupong-receptsidan/variant.js
// @namespace    http://tampermonkey.net/
// @version      0.1
// @match        https://www.ica.se/*
// @grant        none
// ==/UserScript==

import { ICACRO, $ELM } from '../util/main';
import './style.css';

(function ($) {
  'use strict';

  const loadedCupons = [];

  const test = {
    manipulateDom() {
      const section = $ELM.get('#ingredients-section');
      this.createCoupons().forEach(c => section.append(c));
    },
    createCoupons() {
      return loadedCupons.map(this.createCoupon);
    },
    createCoupon(coupon) {
      const wrapper = $ELM.create('personal-offer__coupon');
      const loginUrl = `/logga-in?returnUrl=${encodeURIComponent(window.location)}`;
      const imageUrl = /Handlers/.test(coupon.Offer.Image.ImageUrl)
        ? coupon.Offer.Image.ImageUrl
        : `/Handlers/Image.ashx?w=150&h=150&m=p&bgr=fff&u=${coupon.Offer.Image.ImageUrl}`;
      const kupongCta = `<a href="#" data-url="" data-login-url="${loginUrl}" class="button button--auto-width button--load-coupon js-loggin-btn">
      ${coupon.Offer.LoadedOnCard ? 'Kupong laddad' : 'Ladda kupong'}
      </a>`;
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
          <div class="coupon-load-wrapper" data-offerid="${coupon.OfferId}">
            ${kupongCta}
          </div>
        </div>
      </article>`;
      wrapper.html(kupongTemplate);
      return wrapper;
    },
    loadCoupons() {
      const oldCoupons = $ELM.get('.slick-track').children();
      const ids = oldCoupons.map(c => /kampanj\/hse\/(\d+)/.exec(c.attr('href'))[1]);
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
    setActionCookie(offerId) {
      const d = new Date();
      d.setDate(new Date().getDate() + 1); // expires tomorrow

      ICA.legacy.setCookie('cro_personalOffer_actionCookie_loadCoupon', offerId, d);
    },
    getActionCookie() {
      const actionCookie = ICA.legacy.getCookie('cro_personalOffer_actionCookie_loadCoupon');

      if (actionCookie) {
        ICA.legacy.killCookie('cro_personalOffer_actionCookie_loadCoupon');
      }

      return +actionCookie; // coerce to number
    },
    loadCouponOnCard() {
      return this.loadCouponData().then(() => {
        const opts = {
          OfferId: parseInt(coupon.Offer.OfferId, 10),
          CampaignId: parseInt(coupon.CampaignId, 10),
          StoreId: parseInt(coupon.StoreId, 10),
          StoreGroupId: parseInt(coupon.StoreGroupId, 10),
        };

        return window.fetch(
          '/api/jsonhse/Claimoffer',
          {
            credentials: 'same-origin',
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(opts),
          },
        ).then((response) => {
          if (response.ok) {
            icadatalayer.add('HSE', {
              HSE: {
                action: 'coupon-loaded',
                name: coupon.PageName,
                offer: coupon.Offer.ProductName,
                hseurl: `/kampanj/hse/${couponId}`,
              },
            });
          }
          return response;
        });
      });
    },
    checkActionCookie() {
      const id = this.getActionCookie();
      if (id && this.isLoggedIn()) {
        this.loadCouponOnCard().then(this.changeOfferStatus);
      }
    },
    changeOfferStatus(response) {
      if (response.ok) {
        $ELM('.hse-recipe-list').css('offer-loaded');
        $ELM('.button--load-coupon').text('Kupong laddad');
      }
    },
  };

  $(document).ready(() => {
    Object.assign(test, ICACRO());

    test.loadCoupons().then(() => {
      test.manipulateDom();
      // if (hj) hj('trigger', 'variant6');
    });
  });
})(jQuery);
