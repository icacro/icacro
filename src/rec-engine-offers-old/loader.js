// ==UserScript==
// @name         Banner
// @path         //./src/mdsa-toprecipes/variant.js
// @namespace    http://tampermonkey.net/
// @version      0.1
// @match        https://www.ica.se/*
// @grant        none
// ==/UserScript==

/*eslint-disable */

'use strict';

function init() {
  var css = '.grid_fluid.banner-area { visibility: hidden; }';
  var style = document.createElement('style');
  var script = document.createElement('script');
  var head = document.querySelector('head');

  script.setAttribute('async', '');
  script.setAttribute('src', 'https://cdn.rawgit.com/icacro/icacro/v1.0.323/src/rec-engine-offers/variant.min.js');

  style.appendChild(document.createTextNode(css));

  head.appendChild(style);
  head.appendChild(script);
}
init();
