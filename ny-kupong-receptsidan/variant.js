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
      var styles = '<style type="text/css">' +
          '.cro .recipe-ad { display: none; }' +
          '.cro .hse-recipe-list { background-color: #E9BED7; }' +
'.cro .hse-recipe-list__wrapper { -webkit-box-align: center; -webkit-align-items: center; -ms-flex-align: center; align-items: center; background-color: #FFF; display: -webkit-box; display: -webkit-flex; display: -ms-flexbox; display: flex; -webkit-box-orient: horizontal; -webkit-box-direction: normal; -webkit-flex-direction: row; -ms-flex-direction: row; flex-direction: row; margin: 5px 10px; position: relative; }' +
'.cro .hse-recipe-list__wrapper::after { border-right: 20px dotted #E9BED7; bottom: 8px; content: \'\'; display: block; position: absolute; right: -11px; top: 8px; }' +
'.cro .hse-recipe-list__offer-content h1 { font-size: 1.6rem; margin-bottom: 0; }' +
'.cro @media (min-width: 480px) { .hse-recipe-list__offer-content h1 { font-size: 2rem; } }' +
'.cro .hse-recipe-list__offer-content span { color: #EB1F07; font-family: icarubrik; font-size: 1.8rem; font-weight: bold; }' +
'.cro .hse-recipe-list__offer-content p { color: #808283; font-size: 1.3rem; line-height: 1; }' +
'.cro .hse-recipe-list .coupon-load-wrapper { padding: 15px; }' +
'.cro .hse-recipe-list .coupon-load-wrapper .button--load-coupon { background: #E9BED7; color: #A02971; cursor: pointer; display: -webkit-box; display: -webkit-flex; display: -ms-flexbox; display: flex; -webkit-box-orient: vertical; -webkit-box-direction: normal; -webkit-flex-direction: column; -ms-flex-direction: column; flex-direction: column; -webkit-box-pack: center; -webkit-justify-content: center; -ms-flex-pack: center; justify-content: center; line-height: 1.4rem; padding: 20px; }' +
'.cro .hse-recipe-list.hse-coupon-loaded { background-color: #DDE9BF; }' +
'.cro .hse-recipe-list.hse-coupon-loaded .hse-recipe-list__wrapper::after { border-right: 20px dotted #DDE9BF; }' +
'.cro .hse-recipe-list.hse-coupon-loaded .hse-recipe-list__wrapper img { opacity: .3; }' +
'.cro .hse-recipe-list.hse-coupon-loaded .hse-recipe-list__offer-content span { color: #D5D7DA; }' +
'.cro .hse-recipe-list.hse-coupon-loaded .coupon-load-wrapper a { background: #DDE9BF; color: #8DB72C; }' +
'.cro .hse-modal-loggain { padding: 30px 0; text-align: center; }' +
'.cro .hse-modal-loggain h3 { margin: 0 0 15px; max-width: none; }' +
'.cro .hse-modal-loggain p { max-width: none; }' +
          '</style>';
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
        ? `<a href="#" class="button button--auto-width button--load-coupon button--onload-coupon ${offer.Content.LoadedOnCard ? 'offer-loaded' : ''}" data-url="${Link}">${offer.Content.LoadedOnCard ? "Laddad" : "Ladda kupong"}
          <div class="loader"></div>
        </a>`
        : `<a href="#" data-url="${self.data.OriginalPopupUrl}" data-login-url="${loginUrl}" class="button button--auto-width button--load-coupon js-loggin-btn">Ladda kupong</a>`;

      var kupongTemplate =
`<article class="hse-recipe-list grid_fluid pl">
  <div class="hse-recipe-list__wrapper">
    <div class="column size6of20 lg_size5of20">
      <picture>
        <img src="/Handlers/Image.ashx?w=150&h=150&m=p&bgr=fff&u=${offer.Content.Image.ImageUrl}">
      </picture>
    </div>
    <div class="column size8of20 lg_size10of20 hse-recipe-list__offer-content">
      <h1>${offer.Content.ProductName}</h1>
      <span>${offer.Content.OfferCondition.Conditions[0]} ${offer.Content.OfferCondition.Name}</span>
      <p>${offer.Content.Brand} ${offer.Content.SizeOrQuantity.Text}</p>
      <a href="${self.data.OriginalPopupUrl}">Mer info</a>
    </div>
    <div class="column size8of20 lg_size5of20 coupon-load-wrapper" data-offerId="${offer.Content.OfferId}">
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