// ==UserScript==
// @name         testName
// @path         testPath
// @namespace    http://tampermonkey.net/
// @version      0.1
// @match        https://www.ica.se/*
// @grant        none
// ==/UserScript==

'use strict';

import { CROUTIL, ELM } from '../util/main';
import './style.css';

if (hj) hjf;// eslint-disable-line

function init() {
  const test = {
    manipulateDom() {},
  };
  Object.assign(test, CROUTIL());
  test.manipulateDom();
}

init();
