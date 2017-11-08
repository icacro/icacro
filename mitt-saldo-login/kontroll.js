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
      var action ='SALDO';

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
    }
  });
})(jQuery);
