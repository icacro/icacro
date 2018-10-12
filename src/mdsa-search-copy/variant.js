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

    const h1 = document.querySelector('h1');
    h1.innerHTML = 'Hitta recept';
    const searchInput = document.getElementById('search2');

    const placeHolderLong = 'Sök ingrediens, måltid, specialkost m.m.';
    const placeHolderShort = 'Sök ingrediens, måltid m.m.';

    let placeholderText;
    setPlaceholder();

    window.onresize = function(e){
      setPlaceholder();
    };

    function setPlaceholder() {
      if(window.innerWidth > 400) {
        placeholderText = placeHolderLong;
      } else {
        placeholderText = placeHolderShort;
      }
      if (placeholderText !== searchInput.getAttribute('placeholder')) {
        searchInput.setAttribute('placeholder',placeholderText);
      }
    }

  },

};


$(document).ready(() => {
  Object.assign(test, CROUTIL());
  test.manipulateDom();
});
