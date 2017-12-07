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
    const project = 'checkboxes-to-list';
    const script = document.createElement('script');
    script.setAttribute('async', '');
    script.setAttribute('src', `https://cdn.rawgit.com/Banzaci/ica/master/src/${project}/variant.min.js`);
    document.querySelector('head').appendChild(script);
  };
  $(document).ready(loadJS);
})(jQuery);
