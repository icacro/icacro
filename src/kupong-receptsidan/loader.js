// ==UserScript==
// @name         Banner
// @path         //./src/banner/variant.js
// @namespace    http://tampermonkey.net/
// @version      0.1
// @match        https://www.ica.se/*
// @grant        none
// ==/UserScript==


'use strict';

var script = document.createElement('script');
script.setAttribute('async', '');
script.setAttribute('src', 'https://cdn.rawgit.com/Banzaci/ica/v1.0.20/src/kupong-receptsidan/variant.min.js');
document.querySelector('head').appendChild(script);
