// ==UserScript==
// @name         Navigeringsikoner
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.ica.se/*
// @grant        none
// ==/UserScript==

'use strict';

import { CROUTIL, ELM } from '../util/main';
import { gaPush } from '../util/utils';
import './style.css';

const test = {

  manipulateDom() {

    if(!$('.top-bar-display-name').length) {
      if ($('.top-bar__wrapper').css('background-color') === 'rgb(230, 0, 100)') {
        var loginClass='white';
      } else {
        var loginClass='black';
      }
      var loginBtn = '<a href="#" id="c-login" class="'+ loginClass +'">Logga in</a>';
      $('.top-bar__right').prepend(loginBtn);
      $('#c-login').on('click',function(e) {
        e.preventDefault();
        gaPush({ eventAction: 'Klick på loginknapp i nav' });
        document.querySelector('#js-toggle-avatar .js-track-nav-user-login').click();
      });
    }

  }

};

$(document).ready(() => {
  Object.assign(test, CROUTIL());
  test.manipulateDom();
});
