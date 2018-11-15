// ==UserScript==
// @name         Banner
// @path         //./src/mdsa-priofilter/variant.js
// @namespace    http://tampermonkey.net/
// @version      0.1
// @match        https://www.ica.se/*
// @grant        none
// ==/UserScript==

/*eslint-disable */

'use strict';

function init() {
  var script = document.createElement('script');
  var style = document.createElement('style');
  var head = document.querySelector('head');

  style.setAttribute('type', 'text/css');
  style.innerHTML = 'header p.truncate {visibility:hidden}';

  script.setAttribute('async', '');
  script.setAttribute('src', 'https://cdn.rawgit.com/icacro/icacro/v1.0.317/src/mdsa-related-filters/variant.min.js');

  head.appendChild(script);
  head.appendChild(style);
}
init();
