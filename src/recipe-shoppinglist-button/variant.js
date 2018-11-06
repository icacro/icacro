// ==UserScript==
// @name         recipe-toggle-ingredients
// @path         //./src/recipe-shoppinglist-button/variant.js
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
    var btn = document.querySelector(".button.js-open-shoppinglist-modal");
    document.querySelector(".ingredients__header").insertAdjacentElement("beforeend", btn);
    //document.querySelector(".ingredients__header").insertAdjacentElement("beforeend", document.querySelector(".servings-picker.servings-picker--dynamic"));
  }
};

$(document).ready(() => {
  Object.assign(test, CROUTIL());
  test.manipulateDom();
});
