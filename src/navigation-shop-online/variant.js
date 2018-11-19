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

import { CROUTIL } from '../util/main';
import { gaPush } from '../util/utils';
import './style.css';

const test = {

  manipulateDom() {

    const navigationInner = document.getElementById('offcanvas-left').querySelector('.navigation__inner');

    if(navigationInner) {

      const bagLink = navigationInner.querySelector('li:first-child a');
      bagLink.href = '/handla-online/ica-matkassen/';
      bagLink.innerHTML = 'ICAs Matkasse';

      const shopEl = document.createElement('li');
      const shopLink = document.createElement('a');
      shopEl.classList.add('navigation__item');
      shopLink.classList.add('navigation__link','js-track-nav-menu-item');
      shopLink.innerHTML = 'Handla online';
      shopLink.href = '/handla/';
      shopEl.prepend(shopLink);
      navigationInner.prepend(shopEl);

      shopLink.addEventListener('click', trackClick);
      bagLink.addEventListener('click', trackClick);

      function trackClick() {
        gaPush({ eventAction: 'Nav: ' + this.innerHTML });
      }

    }

  }

};

$(document).ready(() => {
  Object.assign(test, CROUTIL());
  test.manipulateDom();
});
