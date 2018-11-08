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
    var header = document.querySelector(".ingredients__header");
    var position = "beforeend";
    if (header == null) { // recept utan portioner
      header = document.getElementById("ingredients-section");
      position = "afterbegin";
      btn.classList.add("no-portions");
    }
    header.insertAdjacentElement(position, btn);
  }
};

$(document).ready(() => {
  Object.assign(test, CROUTIL());
  test.manipulateDom();
});
