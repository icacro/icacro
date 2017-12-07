/* eslint no-inner-declarations: "off" */
/* eslint no-use-before-define: "off" */

// ==UserScript==
// @name         Personliga-erbjudanden
// @path         //./src/personliga-erbjudanden/variant.js
// @namespace    http://tampermonkey.net/
// @version      0.1
// @match        https://www.ica.se/*
// @grant        none
// ==/UserScript==

import { ICACRO, $ELM } from '../util/main';

(function ($) {
  'use strict';

  const couponId = 458281; // kyckling
  const banner = {
    title: 'Kyckling- och bacongryta med champinjoner',
    cookTime: '30 MIN | ENKEL',
    stars: 4,
    img: '/imagevaultfiles/id_168664/cf_259/kyckling-och-bacongryta-med-champinjoner-722791.jpg',
    url: 'https://www.ica.se/recept/kyckling-och-bacongryta-med-champinjoner-722791/',
  };
  let coupon = {};
  const content = window.cro || {
    notifikationText: 'Få rabatt på kvällens middag',
    mittIcaRubrik: 'Letar du efter middag till ikväll?',
    mittIcaIngress: 'Vi har ett av våra populäraste recept och en kupong till dig!',
    mittIcaText: 'I sådana fall vill vi tipsa dig om vår mest populära torsksoppa och ge dig en passande rabatt.',
    hotjarTrigger: 'variant3',
  };

  const test = {
    addStyles() {
      const couponCss = `
      .hse-recipe-list {
        height: 100%;
        background-color: #F8EBF3;
        margin: 0;
        padding: 0 10px;
      }

      .hse-recipe-list::after { content: none; }

      .hse-recipe-list__wrapper {
        height: 100%;
        align-items: center;
        background-color: #FFF;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 15px;
        position: relative
      }

      .hse-recipe-list__wrapper::after {
        background: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDIxLjAuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCAxMCAyMCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMTAgMjA7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPHN0eWxlIHR5cGU9InRleHQvY3NzIj4KCS5zdDB7ZmlsbDojRjhFQkYzO30KPC9zdHlsZT4KPHBhdGggY2xhc3M9InN0MCIgZD0iTTIuNDk3MDIxLDkuOTg4ODA3YzAsNC4xNDIxNTEsMy4zNTc4NDksNy41MDAwMDEsNy41LDcuNTAwMDAxdi0xNQoJQzUuODU0ODcsMi40ODg4MDcsMi40OTcwMjEsNS44NDY2NTYsMi40OTcwMjEsOS45ODg4MDd6Ii8+Cjwvc3ZnPgo=) space;
        background-size: 17px 19px;
        bottom: 0;
        content: '';
        display: block;
        height: 100%;
        position: absolute;
        right: 0;
        top: 0;
        width: 13px
      }

      .hse-recipe-list__offer-content h1 {
        font-size: 1.6rem;
        line-height: 1.3;
        margin-bottom: 0
      }

      @media (min-width:480px) {
        .hse-recipe-list__offer-content h1 {
          font-size: 1.8rem
        }
      }

      .hse-recipe-list__offer-content span {
        color: #EB1F07;
        font-family: icarubrik;
        font-size: 2.2rem;
        font-weight: 700
      }

      .hse-recipe-list__offer-content p {
        color: #808283;
        font-size: 1.3rem;
        line-height: 1;
        margin-bottom: 0;
      }

      .hse-recipe-list .coupon-load-wrapper { margin-top: 10px; }

      .hse-recipe-list .coupon-load-wrapper .button--load-coupon {
        font-size: 12px;
        align-items: center;
        background: #F8EBF3;
        color: #A02971;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        justify-content: center;
        line-height: 1.4rem
      }

      .hse-recipe-list .coupon-load-wrapper .button--onload-coupon {
        margin: 0 auto;
        min-width: 0;
        transition: width .2s 250ms ease, color .1s .2s ease;
        width: 90px
      }

      @media (min-width:768px) {
        .hse-recipe-list .coupon-load-wrapper .button--onload-coupon {
          width: 115px
        }
      }

      @media (min-width:1024px) {
        .hse-recipe-list .coupon-load-wrapper .button--onload-coupon {
          width: 150px
        }
      }

      .hse-recipe-list .coupon-load-wrapper .button--onload-coupon.loading {
        color: transparent;
        height: 40px;
        margin: 0 auto;
        position: relative;
        transition: width 250ms ease, color .1s ease;
        width: 40px
      }

      .hse-recipe-list .coupon-load-wrapper .button--onload-coupon.loading .loader {
        display: inline-block
      }

      .hse-recipe-list .coupon-load-wrapper .button--onload-coupon .loader {
        border-width: 4px;
        display: none;
        height: 28px;
        margin-left: -14px;
        margin-top: -14px;
        width: 28px
      }

      .hse-recipe-list.offer-loaded .coupon-load-wrapper a {
        background: #DDE9BF;
        color: #8DB72C;
        pointer-events: none;
        transition: width .2s ease, color .2s 250ms ease, background .2s ease
      }
      `;
      const styles = `
      ${couponCss}
      .cro .personal-offer {
        background-color: #F8EBF3;
        padding: 15px;
        margin-bottom: 10px;
      }
      .cro .personal-offer * { box-sizing: border-box; }

      .cro .personal-offer__container {
        background-color: white;
        display: flex;
      }

      .cro .personal-offer__message {
        padding: 15px;
        width: 60%;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      .cro .personal-offer__h1 { line-height: 1.1em; }

      .cro .personal-offer .toggle-personal-offer {
        color: #a02971;
        font-family: icatext;
        font-weight: 600;
        width: 100%; display: flex; justify-content: flex-end; cursor: pointer;
      }
      .cro .personal-offer .toggle-personal-offer__svg {
        align-self: flex-end;
        height: 20px;
      }

      .cro .personal-offer__toggle-header {
        display: none;
        flex-grow: 1;
        margin: 0;
      }

      .cro .personal-offer--hidden .personal-offer__container { display: none; }
      .cro .personal-offer--hidden .personal-offer__toggle-header { display: block; }
      .cro .personal-offer--hidden .toolbar__icon--indicator { transform: rotateZ(180deg) translateY(2px); }

      .cro .personal-offer .toolbar__icon--indicator { fill: #a02971; }

      .cro .personal-offer__preamble, .cro .personal-offer__preamble--strong { display: block; margin-bottom: 10px; }

      .cro .personal-offer__recipe-and-coupon {
        display: flex;
        width: 40%;
      }

      .cro .personal-offer__coupon { width: 50%; }
      .cro .personal-offer__recipe { width: 50%; }

      .cro .personal-offer__recipe a { color: #3F3F40; display: flex; flex-direction: column; }
      .cro .personal-offer__recipe a h4 { color: #808283; }

      .cro .personal-offer__recipe-text {
        padding: 10px;
      }
      .cro .personal-offer__recipe-text h2 { font-size: 2rem; font-weight: bold; margin: 0; line-height: 1; }
      .cro .personal-offer__recipe-text h4 {
        padding: 0;
        font-size: 1.2rem;
        font-family: icatext;
        color: #808283;
        line-height: 1;
        display: inline-block;
        margin: 0;
        vertical-align: middle;
      }
      .cro .personal-offer__recipe-text p {
        line-height: 1.3em;
        font-size: 12px;
        display: inline-block;
        margin: 0 10px 0 0;
      }
      .cro .personal-offer__recipe svg .active { fill: #A02971; }
      .cro .personal-offer__recipe svg {
        display: inline-block;
        fill: #D5D7DA;
        height: 18px;
        vertical-align: middle;
        width: 81px;
      }
      @media (max-width: 980px) {
        .cro .dashboard { position: relative; }
        .cro .dashboard .toolbars-wrapper { position: absolute; top: 0; left: 0;}
      }
      @media (max-width: 520px) {
        .cro .personal-offer__container { flex-direction: column; }
        .cro .personal-offer__message { width: auto; }
        .cro .personal-offer__recipe-and-coupon { width: auto; }
        .cro .personal-offer__coupon { width: 50%; }
        .cro .personal-offer__recipe { width: 50%; }
        .cro .hse-recipe-list { padding: 10px 10px 0 0; }
      }

      /* login frame */
      @media (max-width: 767px) { .cro .cro-iframe-container { padding-bottom: 135% !important; } }
      .cro > .cro-iframe-container { display: none; }
      .cro .modal-copntainer .cro-iframe-container { display: initial; }
      .cro .container { text-align: center; margin-top: 50px;}
      .cro .container h2 { font: 28px icahand; margin-bottom: 20px; }
      .cro .cro-iframe-container {
        position: relative;
        height: 0;
        overflow: hidden;
        padding-bottom: 85%;
        background-color: #F3F0EB;
      }
      .cro .cro-iframe-container iframe {
        opacity: 0;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
      /* login frame */
      `;
      return styles;
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
        ${strs.join('')}</svg>`;
    },
    addRecipe() {
      const [
        container,
        link,
        imageContainer,
        textContainer,
        image,
        cookTime,
        title,
        stars,
      ] = $ELM.create(
        'personal-offer__recipe',
        'a',
        'personal-offer__recipe-image',
        'personal-offer__recipe-text',
        'img',
        'h4',
        'h2',
        'p',
        'div',
      );

      image.image(banner.img);
      cookTime.text(banner.cookTime);
      title.text(banner.title);
      stars.html(this.addStars(banner.stars));

      imageContainer.append(image);
      textContainer.appendAll(title, stars, cookTime);

      link.href(banner.url);
      link.appendAll(imageContainer, textContainer);

      container.append(link);
      return container;
    },
    addCoupon() {
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
            <a href="/kampanj/hse/${couponId}">Mer info</a>
          </div>
          <div class="coupon-load-wrapper" data-offerid="${coupon.OfferId}">
            ${kupongCta}
          </div>
        </div>
      </article>`;
      wrapper.html(kupongTemplate);
      return wrapper;
    },
    addToggleButton() {
      const arrow = `
      <svg class="toolbar__icon toolbar__icon--indicator" viewBox="0 0 32 32" width="20px" height="20px">
      <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/Assets/icons/sprite.svg#arrow-up"></use>
      </svg>
      `;
      const [
        toggle,
        text,
        svg,
      ] = $ELM.create(
        'toggle-personal-offer',
        'span toggle-personal-offer__text',
        'span toggle-personal-offer__svg',
      );

      text.text('Dölj personligt erbjudande');
      svg.html(arrow);
      toggle.appendAll(text, svg);

      return toggle;
    },
    addBlock() {
      const [
        personalOffer,
        container,
        messageContainer,
        header,
        preamble,
        recipeAndCoupon,
      ] = $ELM.create(
        'personal-offer',
        'personal-offer__container',
        'personal-offer__message',
        'h1 personal-offer__h1',
        'strong personal-offer__preamble--strong',
        'personal-offer__recipe-and-coupon',
      );

      header.text(content.mittIcaRubrik);
      preamble.text(content.mittIcaIngress);

      messageContainer.appendAll(header, preamble);
      recipeAndCoupon.appendAll(this.addCoupon(), this.addRecipe());
      container.appendAll(messageContainer, recipeAndCoupon);

      personalOffer.css('pl');
      personalOffer.append(container);

      return personalOffer;
    },
    manipulateDom() {
      const container = this.addBlock();
      const dashboard = document.querySelector('#dashboard');
      dashboard.insertBefore(container.element, dashboard.firstChild);

      icadatalayer.add('HSE', {
        HSE: {
          action: 'display',
          title: coupon.PageName,
          hseurl: `/kampanj/hse/${couponId}`,
        },
      });

      const returnUrl = encodeURIComponent(window.location.href);
      const iframeContainer = $(`<div class="cro-iframe-container"><span class="loader"></span><iframe src="//www.ica.se/logga-in/?returnurl=${returnUrl}" frameborder="0"></iframe></div>`);
      $('body').append(iframeContainer);
    },
    loadCouponData() {
      return coupon.Offer
        ? Promise.resolve(coupon)
        : window.fetch(`/api/jsonhse/${couponId}`, { credentials: 'same-origin' })
          .then(response => response.json())
          .then((json) => { coupon = $().extend({}, coupon, json); });
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
        $ELM.get('.hse-recipe-list').css('offer-loaded');
        $ELM.get('.button--load-coupon').text('Kupong laddad');
      }
    },
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

      $('.personal-offer').on('click', '.button--load-coupon', (e) => {
        e.preventDefault();

        if (self.isLoggedIn()) {
          self.loadCouponOnCard().then(self.changeOfferStatus);
        } else {
          icadatalayer.add('HSE', {
            HSE: {
              action: 'login-mousedown',
              name: coupon.PageName,
              hseurl: `/kampanj/hse/${couponId}`,
            },
          });
          self.setActionCookie(couponId);
          self.createModal();
        }
      });

      $(window).on('message onmessage', (e) => {
        const origin = `${window.location.protocol}//${window.location.host}`;
        if (e.originalEvent.origin === origin && /mobilebankid/i.test(e.originalEvent.data)) {
          self.showLoader();
        }
      });
    },
    getIframeStyles() {
      const styles = `<style type="text/css">
      @media  (max-width: 767px) {
        h3.greeting, h3.card-heading { font-size: 18px; }
        img.card-icon { width: 50px; }
        .select-card-modal { border: 0; padding: 0; margin: 0; }
        .remodal-wrapper { padding: 0; }
      }
      </style>`;
      return styles;
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
                e.append(' för att ladda kupongen');
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
                const eventAction = 'Ladda kupong från riktat erbjudande på Mitt ICA';

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
      }, 50);
    },
    addNotification() {
      const rightValue = this.hasClickedOnNotification() ? -229 : -260;
      const css = `
      .cro .offer-notification {
        position: fixed;
        top: 17vh;
        right: ${rightValue}px;
        z-index: 99999;
        background-color: white;
        border-radius: 20px;
        border-bottom-right-radius: 0;
        border-top-right-radius: 0;
        font-family: icatext, sans-serif;
        font-weight: 900;
        font-size: 13px;
        text-transform: uppercase;
        box-shadow: 2px 2px 10px 0px #00000052;
        transition: right 0.5s;
        padding: 0;
        display: flex;
        align-items: center;
        line-height: 13px;
      }
      .cro .offer-notification.show {
        right: 0;
      }
      .cro .offer-notification span {
        padding: 5px;
        cursor: pointer;
      }
      .cro .offer-notification svg {
        fill: #a02971;
        margin-top: 6px;
        transition: transform 0.5s;
        pointer-events: none;
      }
      .cro .offer-notification.closed svg {
        transform: rotate(180deg) translateY(3px);
      }
      .cro .offer-notification a {
        display: inline-block;
        padding: 15px 13px 13px 5px;
      }
      `;
      this.style(css);

      const [
        notification,
        link,
        arrow,
      ] = $ELM.create(
        'offer-notification',
        'a',
        'span',
      );

      arrow.html(`
        <svg viewBox="0 0 32 32" width="20px" height="20px">
        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/Assets/icons/sprite.svg#arrow-right"></use>
        </svg>`);
      link.href('/mittica');
      link.text(content.notifikationText);
      link.click(() => {
        this.gaPush({
          eventAction: 'Personliga erbjudanden',
          eventLabel: 'Notifikation klickad på',
        });
        this.saveNotificationClick();
      });
      notification.appendAll(arrow, link);

      notification.click((e) => {
        if (e.target.nodeName.toLowerCase() === 'span') {
          notification.element.classList.toggle('closed');
          notification.style({
            right: notification.element.classList.contains('closed')
              ? `-${link.element.offsetWidth}px`
              : '0',
          });
        }
      });

      $ELM.get('body').append(notification);

      this.gaPush({
        eventAction: 'Personliga erbjudanden',
        eventLabel: 'Notifikation visad',
      });

      if (this.hasClickedOnNotification()) {
        notification.toggle('closed');
      } else {
        window.setTimeout(() => notification.css('show'), 1 * 1000);
      }
    },
    pageIsInkopslistor() {
      return /^https:\/\/www.ica.se\/mittica\/#:mittica=inkopslistor$/.test(window.location);
    },
    pageIsLoginForm() {
      return (
        /^https:\/\/www.ica.se\/logga-in/.test(window.location) &&
        /inkopslistor/.test(window.location)
      );
    },
    saveNotificationClick() {
      const d = new Date();
      d.setDate(new Date().getDate() + 1); // expires tomorrow

      ICA.legacy.setCookie('cro_personalOffer_notificationClick', true, d);
    },
    hasClickedOnNotification() {
      const actionCookie = ICA.legacy.getCookie('cro_personalOffer_notificationClick');

      return (actionCookie === 'true'); // coerce to number
    },
    triggerHotJar() {
      const name = content.hotjarTrigger;
      if (hj) {
        hj('trigger', name);
      }
    },
  };

  $(document).ready(() => {
    Object.assign(test, ICACRO());
    test.loadCouponData().then(() => {
      if (!coupon.LoadedOnCard) {
        if (test.pageIsInkopslistor()) {
          test.style(test.addStyles());
          test.manipulateDom();
          test.checkActionCookie();
          test.addEventListeners();
          test.triggerHotJar();
        } else if (!test.pageIsLoginForm()) {
          test.addNotification();
        }
      }
    });
  });
})(jQuery);
