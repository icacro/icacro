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
  var css = '.cro-cardstart .listed-articles,.cro-cardstart .quick-links,.cro-cardstart article header,.cro-cardstart .imagebox {visibility: hidden;}';
  var style = document.createElement('style');
  var script = document.createElement('script');
  var head = document.querySelector('head');

  script.setAttribute('async', '');
  script.setAttribute('src', 'https://raw.githubusercontent.com/icacro/icacro/util/src/ica-kort-entry/variant.min.js');

  style.appendChild(document.createTextNode(css));

  head.appendChild(style);
  head.appendChild(script);
}
init();


'use strict';
var style = document.createElement('style');
style.setAttribute('type', 'text/css');
style.innerHTML = '.async-hide{opacity:0;}';
document.querySelector('head').appendChild(style);
document.documentElement.className += ' async-hide';

var script = document.createElement('script');
script.setAttribute('async', '');
script.setAttribute('src', 'https://cdn.rawgit.com/icacro/icacro/util/src/ica-kort-entry/variant.konto.min.js');
document.querySelector('head').appendChild(script);

script.onload = function () {
  var d = document.documentElement;
  setTimeout(function(){
    d.className = d.className.replace(RegExp(' ?async-hide'), '');
  },40);
}
