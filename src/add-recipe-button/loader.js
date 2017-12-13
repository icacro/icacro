// ==UserScript==
// @name         Banner
// @path         //./src/banner/variant.js
// @namespace    http://tampermonkey.net/
// @version      0.1
// @match        https://www.ica.se/*
// @grant        none
// ==/UserScript==

/*eslint-disable */

'use strict';

function init() {
  var css = '.servings-picker--dynamic, .coachmark-arrow, .js-open-shoppinglist-modal { visibility: hidden; }';

  var style = document.createElement('style');
  var script = document.createElement('script');

  var head = document.querySelector('head');

  style.appendChild(document.createTextNode(css))
  head.appendChild(style);
  script.setAttribute('async', '');
  script.setAttribute('src', 'https://cdn.rawgit.com/Banzaci/ica/v1.0.28/src/add-recipe-button/variant.min.js');

  head.appendChild(script);
}

init();
