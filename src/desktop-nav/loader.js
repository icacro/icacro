// ==UserScript==
// @name         Desktop-nav
// @path         //./src/desktop-nav/variant.search.min.js
// @namespace    http://tampermonkey.net/
// @version      0.1
// @match        https://www.ica.se/*
// @grant        none
// ==/UserScript==

/*eslint-disable */




'use strict';

var head = document.querySelector('head');

var style = document.createElement('style');
style.setAttribute('type', 'text/css');
style.innerHTML = '@media only screen and (min-width: 1024px){.top-bar__wrapper, .offcanvas, .top-bar__left, .top-bar__middle, .top-bar__right, .top-bar__sub-menu, #js-toggle-dropdown-search { visibility: hidden; } .top-bar__wrapper { height: 75px; } body.sticky-header.submenu-header { padding-top: 125px; } body.sticky-header { padding-top: 75px; } #js-toggle-avatar { margin-right: 48px; }}';
head.appendChild(style);

var script = document.createElement('script');
script.setAttribute('async', '');
script.setAttribute('src', 'https://cdn.rawgit.com/Banzaci/ica/v1.0.96/src/desktop-nav/variant.centered.min.js');
head.appendChild(script);




'use strict';

var head = document.querySelector('head');

var style = document.createElement('style');
style.setAttribute('type', 'text/css');
style.innerHTML = '@media only screen and (min-width: 1024px){.top-bar__wrapper, .offcanvas, .top-bar__left, .top-bar__middle, .top-bar__right, .top-bar__sub-menu, #js-toggle-dropdown-search { visibility: hidden; } .top-bar__wrapper { height: 75px; } body.sticky-header.submenu-header { padding-top: 125px; } body.sticky-header { padding-top: 75px; } #js-toggle-avatar { margin-right: 48px; }}';
head.appendChild(style);

var script = document.createElement('script');
script.setAttribute('async', '');
script.setAttribute('src', 'https://cdn.rawgit.com/Banzaci/ica/v1.0.96/src/desktop-nav/variant.3dots.min.js');
head.appendChild(script);




'use strict';

var head = document.querySelector('head');

var style = document.createElement('style');
style.setAttribute('type', 'text/css');
style.innerHTML = '@media only screen and (min-width: 1024px){.top-bar__wrapper, .offcanvas, .top-bar__left, .top-bar__middle, .top-bar__right, .top-bar__sub-menu, #js-toggle-dropdown-search { visibility: hidden; } .top-bar__sub-menu-trunc { visibility:visible; } #recipe-howto-steps .timers-mini { top: 146px; } body.sticky-header, body.sticky-header.submenu-header { padding-top: 140px; } .top-bar {height:140px;}}';
head.appendChild(style);

var script = document.createElement('script');
script.setAttribute('async', '');
script.setAttribute('src', 'https://cdn.rawgit.com/Banzaci/ica/v1.0.96/src/desktop-nav/variant.search.min.js');
head.appendChild(script);
