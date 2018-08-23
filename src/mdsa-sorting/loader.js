// ==UserScript==
// @name         Banner
// @path         //./src/mdsa-sorting/variant.1.js
// @namespace    http://tampermonkey.net/
// @version      0.1
// @match        https://www.ica.se/*
// @grant        none
// ==/UserScript==

/*eslint-disable */

'use strict';

function init() {
  var css = 'filter-dropdown.filter-dropdown {border:0;} filter-dropdown .toggle-arrow-icon {display:none} .filter-dropdown-selected-content {color:#fff;}';
  var style = document.createElement('style');
  var script = document.createElement('script');
  var head = document.querySelector('head');

  script.setAttribute('async', '');
  script.setAttribute('src', 'https://cdn.rawgit.com/icacro/icacro/v1.0.228/src/mdsa-sorting/variant.1.min.js');

  style.appendChild(document.createTextNode(css));

  head.appendChild(style);
  head.appendChild(script);
}
init();
