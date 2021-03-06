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

    $('.cro .filtersegment div.reset-filter-segment').html(txt).on("click", function() {
      //console.log($(this).closest('legend').text().trim());
      gaPush({ eventAction: 'Stäng filter', eventLabel: $(this).closest('legend').text().trim() });
    });
    $('.cro .active-filter-display div.reset-filter-segment a').html("återställ alla filter");
  }
};


$(document).ready(() => {
  Object.assign(test, CROUTIL());
  test.manipulateDom();
});
