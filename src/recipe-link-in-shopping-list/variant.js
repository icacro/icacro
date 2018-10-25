// ==UserScript==
// @name         recipe-toggle-ingredients
// @path         //./src/recipe-link-in-shopping-list/variant.js
// @namespace    http://tampermonkey.net/
// @version      0.1
// @match        https://www.ica.se/recept/*
// @grant        none
// ==/UserScript==

'use strict';

import { CROUTIL, ELM } from '../util/main';
import { gaPush } from '../util/utils';
import './style.css';

const test = {

  manipulateDom() {

    // klick på lägg till i inköpslista, spara länk till recpet i cookie

  },
};

$(document).ready(() => {
  Object.assign(test, CROUTIL());
  test.manipulateDom();
});
