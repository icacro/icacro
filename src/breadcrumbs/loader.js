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
  var script = document.createElement('script');
  var head = document.querySelector('head');

  script.setAttribute('async', '');
  script.setAttribute('src', 'https://cdn.rawgit.com/icacro/icacro/v1.0.250/src/breadcrumbs/variant.min.js');

  head.appendChild(script);

  var style = document.createElement('style');
  style.setAttribute('type', 'text/css');
  style.innerHTML = '.recipe-meta--header{visibility:hidden;}';
  head.appendChild(style);
}
init();
