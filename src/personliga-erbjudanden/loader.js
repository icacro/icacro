// ==UserScript==
// @name         Personliga erbjudanden
// @path         //./src/personliga-erbjudanden/variant.js
// @namespace    http://tampermonkey.net/
// @version      0.1
// @match        https://www.ica.se/*
// @grant        none
// ==/UserScript==

(function ($) {
  'use strict';

  const loadJS = () => {
    const project = 'personliga-erbjudanden';
    const script = document.createElement('script');
    script.setAttribute('async', '');
    script.setAttribute('src', `https://cdn.rawgit.com/Banzaci/ica/${project}/variant.min.js`);
    document.querySelector('head').appendChild(script);
  };
  $(document).ready(loadJS);
})(jQuery);
