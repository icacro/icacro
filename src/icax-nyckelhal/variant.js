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

    let headerCopy, bodyCopy, cookieContent;

    if (getCookie('icaxNyckelhal')) cookieContent = getCookie('icaxNyckelhal');

    var currentDate = new Date();
    var maxDate = new Date('4/1/2019');

    if (currentDate < maxDate) {

      if (window.location.href.indexOf('?q=smart-halsa') > 0) {
        cookieContent = 'smart-halsa';
      } else if (window.location.href.indexOf('?q=halsosammare-val') > 0) {
        cookieContent = 'halsosammare-val';
      } else if (!cookieContent) {
        cookieContent = '';
      }

      if(cookieContent === 'smart-halsa') {
        headerCopy  = 'Smart hälsa';
        bodyCopy    = 'Även för den som lever ett aktivt liv och äter en hälsosam kost kan inspirationen tryta. Här hittar du varierande recept med bra fetter och mycket grönsaker som dessutom uppfyller kriterierna för nyckelhålsmärkt mat';
      } else if(cookieContent === 'halsosammare-val') {
        headerCopy  = 'Hälsosammare val';
        bodyCopy    = 'Att ändra sina matvanor kan vara ett bra steg för att förebygga både hjärt- och kärlsjukdomar och förhöjda blodsockernivåer. Här hittar du hälsosamma och goda recept som uppfyller kriterierna för nyckelhålsmärkt mat';
      }

      if (cookieContent !== getCookie('icaxNyckelhal') && cookieContent !== '') {
        document.cookie = 'icaxNyckelhal=' + cookieContent + ';path=/;';
        console.log('cookie set: ' + cookieContent);
      }

      if(headerCopy) {

        const introText = document.querySelector('header p.truncate');
        const h1 = document.querySelector('header h1');
        const miniTitle =  document.querySelector('header h1 .mini-title');

        if (h1)         h1.innerHTML = headerCopy;
        if (miniTitle)  h1.prepend(miniTitle);

        if (introText) {
          introText.innerHTML = bodyCopy;
          let pObserver = new MutationObserver(function(mutations) {
            for (var i = 0; i < mutations.length; i++) {
              if (introText.innerHTML !== bodyCopy) introText.innerHTML = bodyCopy;
            }
          });
          const config = {attributes: true, childList: true, characterData: true, subtree: true};
          pObserver.observe(introText, config);
        }

      }

    }

  }

};

$(document).ready(() => {
  Object.assign(test, CROUTIL());
  test.manipulateDom();
});
