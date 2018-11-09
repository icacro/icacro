// ==UserScript==
// @name         recipe-toggle-ingredients
// @path         //./src/recipe-save-button/variant.js
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

    var btnOld = document.querySelector("a.button.button--heart");
    var btn = document.createElement("div");
    btn.appendChild(btnOld);
    btn.classList.add('new-save-field');
    btn.classList.add('save-recipe-button');

    btnOld.classList.remove('button');
    btnOld.classList.remove('button--heart');
    btnOld.classList.remove('button--auto-width')
    btnOld.classList.add('sprite2-p');
    btnOld.classList.add('icon-heart');
    btnOld.removeChild(btnOld.querySelector("svg"));

    document.querySelector('header div.col-12').insertAdjacentElement("afterbegin", btn);
  },

};

$(document).ready(() => {
  Object.assign(test, CROUTIL());
  test.manipulateDom();
});
