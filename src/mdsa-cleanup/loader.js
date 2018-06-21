// ==UserScript==
// @name         Banner
// @path         //./src/mdsa-cleanup/variant.js
// @namespace    http://tampermonkey.net/
// @version      0.1
// @match        https://www.ica.se/*
// @grant        none
// ==/UserScript==

/*eslint-disable */

'use strict';

function init() {
  var css = '.mdsa-main-grid .right-content {display:none;} #RecipeFilterMenu fieldset {margin-bottom:0;} #content, .recipes article footer {visibility:hidden;}';
  var style = document.createElement('style');
  var script = document.createElement('script');
  var head = document.querySelector('head');

  script.setAttribute('async', '');
  script.setAttribute('src', 'https://cdn.rawgit.com/icacro/icacro/v1.0.192/src/mdsa-cleanup/variant.min.js');

  style.appendChild(document.createTextNode(css));

  head.appendChild(style);
  head.appendChild(script);
}
init();
