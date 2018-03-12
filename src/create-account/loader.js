// ==UserScript==
// @name         Banner
// @path         //./src/banner/variant.js
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
script.setAttribute('src', 'https://cdn.rawgit.com/icacro/icacro/util/src/create-account/variant.form.min.js');
document.querySelector('head').appendChild(script);

script.onload = function () {
  var d = document.documentElement;
  setTimeout(function(){
    d.className = d.className.replace(RegExp(' ?async-hide'), '');
  },40);
}
