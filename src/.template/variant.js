// ==UserScript==
// @name         testName
// @path         testPath
// @namespace    http://tampermonkey.net/
// @version      0.1
// @match        https://www.ica.se/*
// @grant        none
// ==/UserScript==

import { ICACRO, $ELM } from '../util/main';
import './style.css';

(function ($) {
  'use strict';
  if (hj) hjf;// eslint-disable-line
  const test = {
    addStyles() {
      return styles;
    },
    manipulateDom() {},
  };

  $(document).ready(() => {
    Object.assign(test, ICACRO());
    test.style(test.addStyles())
    test.manipulateDom();
  });
})(jQuery);
