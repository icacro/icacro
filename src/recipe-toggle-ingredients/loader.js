// ==UserScript==
// @name         Banner
// @path         //./src/recipe-toggle-ingredients/variant.js
// @namespace    http://tampermonkey.net/
// @version      0.1
// @match        https://www.ica.se/*
// @grant        none
// ==/UserScript==

/*eslint-disable */

'use strict';

function init() {
  var css = '.classname { visibility: hidden; }';
  var style = document.createElement('style');
  var script = document.createElement('script');
  var head = document.querySelector('head');

  script.setAttribute('async', '');
  script.setAttribute('src', 'https://cdn.rawgit.com/icacro/icacro/v1.0.1XX/src/recipe-toggle-ingredients/variant.min.js');

  style.appendChild(document.createTextNode(css));

  head.appendChild(style);
  head.appendChild(script);
}
init();
