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

const test = {
  manipulateDom() {
    $('.cro .filtersegment div.reset-filter-segment').on("click", function() {
      //console.log($(this).closest('legend').text().trim());
      gaPush({ eventAction: 'Stäng filter', eventLabel: $(this).closest('legend').text().trim() });
    });
  }
};


$(document).ready(() => {
  Object.assign(test, CROUTIL());
  test.manipulateDom();
});
