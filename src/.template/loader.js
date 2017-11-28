// ==UserScript==
// @name         Banner
// @path         //./src/banner/variant.js
// @namespace    http://tampermonkey.net/
// @version      0.1
// @match        https://www.ica.se/*
// @grant        none
// ==/UserScript==

(function ($) {
  'use strict';

  const loadJS = (callback) => {
    const project = '#project';
    const script = document.createElement('script');
    script.setAttribute('async', '');
    script.setAttribute('src', `https://localhost:8080/src/${project}/variant.min.js`);
    document.querySelector('head').appendChild(script);
  };
  $(document).ready(loadJS);
})(jQuery);
