// ==UserScript==
// @name         recipe-toggle-ingredients
// @path         //./src/recipe-inf-scroll/variant.js
// @namespace    http://tampermonkey.net/
// @version      0.1
// @match        https://www.ica.se/recept/*
// @grant        none
// ==/UserScript==

'use strict';

import { CROUTIL } from '../util/main';
import { gaPush } from '../util/utils';
import './style.css';

const test = {

  manipulateDom() {
    const shareBtn = document.createElement('a');
    shareBtn.href = '#';
    shareBtn.classList.add('button--share','button','button--link');
    shareBtn.innerHTML = '<svg><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/Assets/icons/v2-symbols.svg#share"></use></svg> Dela'
    document.querySelector('.recipe-action-buttons').insertBefore(shareBtn, document.querySelector('.button--print'));
    const shareData = {title: 'Marmelad av färsklök', text: 'Ett recept från ICA.se', url: 'https://www.ica.se/recept/marmelad-av-farsklok-712576/'}

    shareBtn.addEventListener("click", function(e) {
      e.preventDefault();
      if (window.navigator.share) {
        window.navigator.share(shareData);
        shareBtn.innerHTML = 'OK';
      } else {
        shareBtn.innerHTML = '---';
      }
    });

  },

};


$(document).ready(() => {
  Object.assign(test, CROUTIL());
  test.manipulateDom();
});
