// ==UserScript==
// @name         CTA-texter ansökningsflödet
// @path         //./src/ica-kort-cta/variant.js
// @namespace    http://tampermonkey.net/
// @version      0.1
// @match        https://www.ica.se/*
// @grant        none
// ==/UserScript==

/*

'use strict';

function init() {

  var css = "#dropdown-avatar .quick-login a[href='/ansokan/'].button," +
  ".quicklink-list a[href='http://www.ica.se/ica-kort/'].button," +
  ".login-page .login-help-area .right-link a," +
  ".easy-signup-page .proceed input," +
  ".easy-signup-page .container-steps .step-header h1," +
  ".top-bar-sub-menu .top-bar-sub-menu__item a[href='/ica-kort/ansok-om-ica-kort/']," +
  "form[action='/ica-kort/'] .imagebox a[href=\'/ica-kort/ansok-om-ica-kort/\']," +
  "form[action='/ica-kort/'] .listed-articles h2.title a[href='/ica-kort/ansok-om-ica-kort/']," +
  "form[action='/ica-kort/ansok-om-ica-kort/'] header h1," +
  "form[action='/ica-kort/ansok-om-ica-kort/'] .content a[href='/ansokan/']," +
  "form[action='/ica-kort/ansok-om-ica-kort/'] .primary .content .clearfix > strong," +
  "form[action='/ica-kort/samla-och-fa-tillbaka/'] .lead a[href='http://www.ica.se/ica-kort/ansok-om-ica-kort/'].button," +
  "form[action='/ica-kort/samla-och-fa-tillbaka/'] .content a[href='/ica-kort/ansok-om-ica-kort/'].button," +
  "form[action='/ica-kort/icas-olika-kort/'] .content a[href='/ansokan/'].button" +
  "{ visibility: hidden; }" +
  ".top-bar-sub-menu .top-bar-sub-menu__item a[href='/ica-kort/ansok-om-ica-kort/']" +
  "{ display: inline-block; width: 118px; }";

  var style = document.createElement('style');
  var script = document.createElement('script');
  var head = document.querySelector('head');

  script.setAttribute('async', '');
  script.setAttribute('src', 'https://cdn.rawgit.com/Banzaci/ica/v1.0.55/src/ica-kort-cta/variant.min.js');

  style.appendChild(document.createTextNode(css));

  head.appendChild(style);
  head.appendChild(script);
}

init(); */

var style = document.createElement('style');
style.setAttribute('type', 'text/css');
style.innerHTML = '.async-hide{opacity:0;}';
document.querySelector('head').appendChild(style);
document.documentElement.className += ' async-hide';

var script = document.createElement('script');
script.setAttribute('async', '');
script.setAttribute('src', 'https://cdn.rawgit.com/Banzaci/ica/v1.0.58/src/ica-kort-cta/variant.min.js');
document.querySelector('head').appendChild(script);

script.onload = function () {
  var d = document.documentElement;
  setTimeout(function(){
    d.className = d.className.replace(RegExp(' ?async-hide'), '');
  },40);
}
