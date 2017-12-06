// ==UserScript==
// @name         Add-recipe-button
// @path         //./src/add-recipe-button/variant.js
// @namespace    http://tampermonkey.net/
// @version      0.1
// @match        https://www.ica.se/*
// @grant        none
// ==/UserScript==

'use strict';

import { ICACRO, $ELM } from '../util/main';

import './style.css';

if (hj) hj('trigger','variant6');// eslint-disable-line

function init() {
  const test = {
    manipulateDom() {},
  };
  Object.assign(test, ICACRO());
  test.manipulateDom();
}

init();
