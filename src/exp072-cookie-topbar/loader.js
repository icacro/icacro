// ==UserScript==
// @name         CookieTopbar
// @path         //./src/src/exp072-cookie-topbar/variant.js
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
  script.setAttribute('src', 'https://cdn.rawgit.com/icacro/icacro/v1.0.359/src/exp072-cookie-topbar/variant.min.js');

  head.appendChild(script);
}

init();
