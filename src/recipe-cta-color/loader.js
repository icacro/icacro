// ==UserScript==
// @name         Receptsidan CTA-färger
// @path         //./src/recipe-cta-color/variant.js
// @namespace    http://tampermonkey.net/
// @version      0.1
// @match        https://www.ica.se/*
// @grant        none
// ==/UserScript==

/*eslint-disable */

'use strict';

var style = document.createElement('style');
style.setAttribute('type', 'text/css');
style.innerHTML = '.async-hide{opacity:0;}';
document.querySelector('head').appendChild(style);
document.documentElement.className += ' async-hide';

var script = document.createElement('script');
script.setAttribute('async', '');
script.setAttribute('src', 'https://cdn.rawgit.com/Banzaci/ica/v1.0.69/src/recipe-cta-color/variant.min.js');
document.querySelector('head').appendChild(script);

script.onload = function () {
  var d = document.documentElement;
  setTimeout(function(){
    d.className = d.className.replace(RegExp(' ?async-hide'), '');
  }, 40);
}

setTimeout(function(){
  window.hj=window.hj||function(){(hj.q=hj.q||[]).push(arguments);};
  hj('trigger', 'recipectavariant1');
}, 500);
