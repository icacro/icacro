// ==UserScript==
// @name         Banner
// @path         //./src/banner/variant.js
// @namespace    http://tampermonkey.net/
// @version      0.1
// @match        https://www.ica.se/ica-kort/
// @grant        none
// ==/UserScript==

/*eslint-disable */

'use strict';

function init() {
  var css = '.cro .listed-articles,.cro .quick-links,.cro article header,.cro .imagebox {visibility: hidden;}';
  var style = document.createElement('style');
  var script = document.createElement('script');
  var head = document.querySelector('head');

  script.setAttribute('async', '');
  script.setAttribute('src', 'https://cdn.rawgit.com/Banzaci/ica/v1.0.97/src/ica-kort-entry/variant.min.js');

  style.appendChild(document.createTextNode(css));

  head.appendChild(style);
  head.appendChild(script);
}
init();
