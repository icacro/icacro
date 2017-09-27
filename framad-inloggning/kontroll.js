// ==UserScript==
// @name         Framad inloggning: Kontroll
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.ica.se/recept/*
// @grant        none
// ==/UserScript==

(function($) {
  'use strict';

  var isLoginPage = /logga-in/.test(window.location.href);

  $(document).ready(function (){
    if (isLoginPage) {
      var action = /sparaklick/.test(window.location.href) ? 'Klick på spara' : 'Klick på kommentera';

      // Fortsätt (Mobilt BankId)
      $('#submit-login-mobile-bank-id').on('click', function () {
        ga('send', 'event', 'A/B', action, 'Logga in - Mobilt BankId');
      });

      // Behöver du hjälp (Mobilt BankId)
      $('.login-support-bank-id-link').on('click', function () {
        ga('send', 'event', 'A/B', action, 'Behöver du hjälp');
      });

      // Skapa konto (Mobilt BankId)
      $('.get-mobile-bank-id-link').on('click', function () {
        ga('send', 'event', 'A/B', action, 'Skapa konto - Mobilt BankId');
      });

      // Logga in (Lösenord)
      $('#log-in-submit').on('click', function () {
        ga('send', 'event', 'A/B', action, 'Logga in - Lösenord');
      });

      // Glömt lösenord (Lösenord)
      $('.login-support-password-link').on('click', function () {
        ga('send', 'event', 'A/B', action, 'Glömt lösenord');
      });

      // Skapa konto (Lösenord)
      $('.create-account-link').on('click', function () {
        ga('send', 'event', 'A/B', action, 'Skapa konto - Lösenord');
      });
    } else {
      // fäll ut kommentarsformuläret ifall man är inloggad
      if ($('#hdnIcaState').val()) {
          $('.comments__header .button').click();
      }

      // Lägg på sparaklick-parametern för att särskilja funktionerna
      $('.recipe-action-buttons .button.js-login-return-function').on('click', function () {
        this.href += encodeURIComponent('?sparaklick');
      });

      // Spara oninloggad
      $('body').on('click', '.recipe-action-buttons .button.js-login-return-function', function () {
        ga('send', 'event', 'A/B', 'Klick på spara');
      });
      // Spara inloggad
      $('body').on('click', '.recipe-action-buttons .button.js-recipe-save:not(.button--active)', function () {
        ga('send', 'event', 'A/B', 'Klick på spara');
      });

      // Skriv din egen kommentar
      $('body').on('click', '.comments__header .button.js-login-return-function', function () {
        ga('send', 'event', 'A/B', 'Klick på kommentera');
      });

      // Skicka kommentar
      $('body').on('click', '.comments__form .button:not(.button--link)', function () {
      	ga('send', 'event', 'A/B', action, 'Skicka kommentar');
      });
    }
  });
})(jQuery);