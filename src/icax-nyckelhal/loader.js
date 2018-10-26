// ==UserScript==
// @name         Navigeringsikoner
// @path         //./src/id-nav-icons/variant.js
// @namespace    http://tampermonkey.net/
// @version      0.1
// @match        https://www.ica.se/*
// @grant        none
// ==/UserScript==

/*eslint-disable */

'use strict';

function init() {
  var css = '.cro header p.truncate, .cro header h1 {visibility: visible;}';

  var style = document.createElement('style');
  var script = document.createElement('script');

  var head = document.querySelector('head');

  style.appendChild(document.createTextNode(css))
  head.appendChild(style);
  script.setAttribute('async', '');
  script.setAttribute('src', 'https://cdn.rawgit.com/icacro/icacro/v1.0.310/src/icax-nyckelhal/variant.min.js');

  head.appendChild(script);
}

init();
