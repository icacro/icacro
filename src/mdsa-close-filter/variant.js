// ==UserScript==
// @name         testName
// @path         testPath
// @namespace    http://tampermonkey.net/
// @version      0.1
// @match        https://www.ica.se/*
// @grant        none
// ==/UserScript==

'use strict';

import { CROUTIL } from '../util/main';
import { throttle, gaPush } from '../util/utils';
import './style.css';

const test = {
  manipulateDom() {
    const txt = "<svg><use xlink:href='/Assets/icons/v2-symbols.svg#close'></use></svg>";
    /*const txt = "<a href='#' class='button button--link button--icon'><svg viewBox='0 0 32 32' width='32px' height='32px'><use xlink:href='/icons/sprite.svg#close'></use></svg></a>";*/

    $('.cro div.reset-filter-segment').html(txt);
  }
};


$(document).ready(() => {
  Object.assign(test, CROUTIL());
  test.manipulateDom();
});
