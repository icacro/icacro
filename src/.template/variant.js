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
import { triggerHotJar } from '../util/utils';
import './style.css';

const test = {
  manipulateDom() {},
};

$(document).ready(() => {
  Object.assign(test, CROUTIL());
  test.manipulateDom();
  triggerHotJar(hjf);
});
