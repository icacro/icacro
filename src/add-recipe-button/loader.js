// ==UserScript==
// @name         Banner
// @path         //./src/banner/variant.js
// @namespace    http://tampermonkey.net/
// @version      0.1
// @match        https://www.ica.se/*
// @grant        none
// ==/UserScript==

'use strict';

function init() {
  var css = '.coachmark-arrow, .js-open-shoppinglist-modal { visibility: hidden; }';
  var style = document.createElement('style');
  var script = document.createElement('script');

  style.appendChild(document.createTextNode(css))
  document.querySelector('head').appendChild(style);  
  script.setAttribute('async', '');
  script.setAttribute('src', 'https://cdn.rawgit.com/Banzaci/ica/v1.0.26/src/add-recipe-button/variant.min.js');

  document.querySelector('head').appendChild(script);
}

init();


// Object.assign(document.querySelector('body').style, {
//   display: 'none',
// });
// coachmark-arrow
// js-open-shoppinglist-modal
