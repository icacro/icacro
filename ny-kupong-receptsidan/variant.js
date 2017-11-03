// ==UserScript==
// @name         Ny kupong på receptsidor
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.ica.se/recept/*
// @grant        none
// ==/UserScript==

(function($) {
  'use strict';

  var test = {
    data: null,
    addStyles: function () {
      var styles = `<style type="text/css">
        .hse-recipe-list{background-color:#F8EBF3}.hse-recipe-list:first-of-type{padding-top:1px}.hse-recipe-list__wrapper{align-items:center;background-color:#FFF;display:flex;flex-direction:row;margin:10px 15px;min-height:133px;position:relative}.hse-recipe-list__wrapper::after{background:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDIxLjAuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCAxMCAyMCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMTAgMjA7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPHN0eWxlIHR5cGU9InRleHQvY3NzIj4KCS5zdDB7ZmlsbDojRjhFQkYzO30KPC9zdHlsZT4KPHBhdGggY2xhc3M9InN0MCIgZD0iTTIuNDk3MDIxLDkuOTg4ODA3YzAsNC4xNDIxNTEsMy4zNTc4NDksNy41MDAwMDEsNy41LDcuNTAwMDAxdi0xNQoJQzUuODU0ODcsMi40ODg4MDcsMi40OTcwMjEsNS44NDY2NTYsMi40OTcwMjEsOS45ODg4MDd6Ii8+Cjwvc3ZnPgo=) space;background-size:13px 26px;bottom:0;content:'';display:block;height:100%;position:absolute;right:0;top:0;width:13px}.hse-recipe-list__offer-content h1{font-size:1.6rem;line-height:1.3;margin-bottom:0}@media (min-width:480px){.hse-recipe-list__offer-content{border-left:0!important;padding-left:0!important}.hse-recipe-list__offer-content h1{font-size:1.8rem}}.hse-recipe-list__offer-content span{color:#EB1F07;font-family:icarubrik;font-size:2.2rem;font-weight:700}.hse-recipe-list__offer-content p{color:#808283;font-size:1.3rem;line-height:1}.hse-recipe-list .coupon-load-wrapper{padding-left:0;padding-right:0;right:20px}.hse-recipe-list .coupon-load-wrapper .button--load-coupon{align-items:center;background:#F8EBF3;color:#A02971;cursor:pointer;display:flex;flex-direction:column;justify-content:center;line-height:1.4rem}.hse-recipe-list .coupon-load-wrapper .button--onload-coupon{margin:0 auto;min-width:0;transition:width .2s 250ms ease,color .1s .2s ease;width:90px}@media (min-width:768px){.hse-recipe-list .coupon-load-wrapper .button--onload-coupon{width:115px}}@media (min-width:1024px){.hse-recipe-list .coupon-load-wrapper .button--onload-coupon{width:150px}}.hse-recipe-list .coupon-load-wrapper .button--onload-coupon.loading{color:transparent;height:40px;margin:0 auto;position:relative;transition:width 250ms ease,color .1s ease;width:40px}.hse-recipe-list .coupon-load-wrapper .button--onload-coupon.loading .loader{display:inline-block}.hse-recipe-list .coupon-load-wrapper .button--onload-coupon .loader{border-width:4px;display:none;height:28px;margin-left:-14px;margin-top:-14px;width:28px}.hse-recipe-list.offer-loaded{background-color:#F7F7F7;margin-top:10px!important}.hse-recipe-list.offer-loaded .hse-recipe-list__wrapper::after{background:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDIxLjAuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCAxMCAyMCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMTAgMjA7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPHN0eWxlIHR5cGU9InRleHQvY3NzIj4KCS5zdDB7ZmlsbDojRjdGN0Y3O30KPC9zdHlsZT4KPHBhdGggY2xhc3M9InN0MCIgZD0iTTIuNDk3MDIxLDkuOTg4ODA3YzAsNC4xNDIxNTEsMy4zNTc4NDksNy41MDAwMDEsNy41LDcuNTAwMDAxdi0xNQoJQzUuODU0ODcsMi40ODg4MDcsMi40OTcwMjEsNS44NDY2NTYsMi40OTcwMjEsOS45ODg4MDd6Ii8+Cjwvc3ZnPgo=) space}.hse-recipe-list.offer-loaded .hse-recipe-list__wrapper img{filter:grayscale(1);opacity:.4}.hse-recipe-list.offer-loaded .hse-recipe-list__offer-content span{color:#D5D7DA}.hse-recipe-list.offer-loaded .coupon-load-wrapper a{background:#DDE9BF;color:#8DB72C;pointer-events:none;transition:width .2s ease,color .2s 250ms ease,background .2s ease}.hse-modal-login{padding:30px 0;text-align:center}.hse-modal-login h3{margin:0 0 15px;max-width:none}.hse-modal-login p{max-width:none}
          </style>`;
      $('head').append(styles);
    },
    addEventListeners: function () {
      $(document).on('click', 'a', function () {
        // code
      });
    },
    manipulateDom: function () {
      var self = this;

      $('body').addClass('cro');

      var banner = $('.js-track-recipe-ad-click').first();

      if (!banner.length) return;

      var ajaxUrl = banner.data('ajaxurl');

      console.log('har banner');

      $.ajax({
        url: ajaxUrl
      }).then(function (data) {
        var regex = /window.hsepopup.model = (.*);/g;
        var result = regex.exec(data);

        self.data = JSON.parse(result[1]);
        console.log(self.data);

        self.addKupong();
      });
    },
    isLoggedIn: function () { return $('#hdnIcaState').val() ? true : false; },
    addKupong: function () {
      var self = this;
      var offer = self.data.Offers[0];
      var loginUrl = `/logga-in?returnUrl=${encodeURIComponent(window.location)}`;
      var kupongCta = self.isLoggedIn()
        ? `<a href="#" class="button button--auto-width button--load-coupon button--onload-coupon ${offer.Content.LoadedOnCard ? 'offer-loaded' : ''}" data-url="${self.data.OriginalPopupUrl}">${offer.Content.LoadedOnCard ? "Laddad" : "Ladda kupong"}
          <div class="loader"></div>
        </a>`
        : `<a href="#" data-url="${self.data.OriginalPopupUrl}" data-login-url="${loginUrl}" class="button button--auto-width button--load-coupon js-loggin-btn">Ladda kupong</a>`;

        var kupongTemplate =
        `<article class="hse-recipe-list grid_fluid pl  loaded">
            <div class="hse-recipe-list__wrapper">
                <div class="column size6of20 lg_size5of20">
                    <picture>
                       <img src="/Handlers/Image.ashx?w=150&h=150&m=p&bgr=fff&u=${offer.Content.Image.ImageUrl}">
                    </picture>
                </div>
                <div class="column size10of20 lg_size10of20 hse-recipe-list__offer-content">
                  <h1>${offer.Content.ProductName}</h1>
            <span>${offer.Content.OfferCondition.Conditions[0]} ${offer.Content.OfferCondition.Name}</span>
            <p>${offer.Content.Brand} ${offer.Content.SizeOrQuantity.Text}</p>
            <a href="${self.data.OriginalPopupUrl}">Mer info</a>
                </div>
                <div class="column size6of20 lg_size5of20 coupon-load-wrapper" data-offerid="${offer.Content.OfferId}">
                    ${kupongCta}
                </div>
            </div>

        </article>`;

      $('.recipe-ad').after(kupongTemplate);
    }
  };

  test.addStyles();

  $(document).ready(function (){
    test.manipulateDom();
    test.addEventListeners();
  });
})(jQuery);
