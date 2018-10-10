// ==UserScript==
// @name         recipe-toggle-ingredients
// @path         //./src/recipe-share/variant.js
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

    const btnText = 'Skicka länk';
    shareBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 100 125" enable-background="new 0 0 100 100" xml:space="preserve"><path d="M73.8,46.6L55.2,32.4C54.8,32.1,54.4,32,54,32c-1,0-2,0.8-2,2v8c-1,0-2,0-5,0C32.6,42,26.6,51,25,64.9  c-0.2,1.3,0.9,2.2,2,2.2c0.6,0,1.2-0.3,1.7-0.9c4.8-6.8,10-10.2,19.3-10.2c1.9,0,3.1,0,4.1,0v7.9c0,1.2,1,2,2,2  c0.4,0,0.8-0.1,1.2-0.4l18.6-14.2C75.4,50.2,75.4,47.8,73.8,46.6z"/></svg> ' + btnText;
    document.querySelector('.recipe-action-buttons').insertBefore(shareBtn, document.querySelector('.button--print'));

    const shareTitle = document.title.split(' | ')[0];
    const shareUrl = window.location.href.split('?')[0] + '?utm_source=android_share';
    const shareText = 'Ett recept från ICA.se';
    const shareData = {title: shareTitle, text: shareText, url: shareUrl}

    shareBtn.addEventListener("click", function(e) {
      e.preventDefault();
      gaPush({ eventAction: 'Androiddelning', eventLabel: window.location.href });
      window.navigator.share(shareData);
    });

  },

};


$(document).ready(() => {
  if (window.navigator.share) {
    Object.assign(test, CROUTIL());
    test.manipulateDom();
  }
});
