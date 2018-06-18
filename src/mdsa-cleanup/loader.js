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
  var css = '#content, .recipes article footer {visibility:hidden;} .recipes .mdsa article:before {opacity: 0;} .filtermenu fieldset, .filtermenu fieldset ul, .filtermenu fieldset li {-webkit-transition: none !important; transition: none !important;}';
  var style = document.createElement('style');
  var script = document.createElement('script');
  var head = document.querySelector('head');

  script.setAttribute('async', '');
  script.setAttribute('src', 'https://cdn.rawgit.com/icacro/icacro/v1.0.186/src/mdsa-cleanup/variant.min.js');

  style.appendChild(document.createTextNode(css));

  head.appendChild(style);
  head.appendChild(script);
}
init();
