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
  var css = '.js-track-nav-online > svg, #js-toggle-avatar > svg, #js-toggle-dropdown-search > svg, #js-open-toggle-offcanvas-left > svg { visibility: hidden; }';

  var style = document.createElement('style');
  var script = document.createElement('script');

  var head = document.querySelector('head');

  style.appendChild(document.createTextNode(css))
  head.appendChild(style);
  script.setAttribute('async', '');
  script.setAttribute('src', 'https://cdn.rawgit.com/Banzaci/ica/v1.0.43/src/id-nav-icons/variant.min.js');

  head.appendChild(script);
}

init();
