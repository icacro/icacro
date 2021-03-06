// ==UserScript==
// @name         Navigeringsikoner
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.ica.se/*
// @grant        none
// ==/UserScript==

(function($) {
    'use strict';

    var test = {
        addStyles: function () {
            var styles = '<style type="text/css">' +
                '.cro .js-track-nav-online > svg, .cro #js-toggle-avatar > svg, .cro #js-toggle-dropdown-search > svg, .cro #js-open-toggle-offcanvas-left > svg {' +
                'visibility: visible;' +
                '}' +
                '</style>';
            $('head').append(styles);
        },
        manipulateDom: function () {

            var avatarIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-16 -14 80 80" id="avatar" width="100%" height="100%"><path class="cls-1" d="M9.5,44h-3a.5.5,0,0,1-.5-.5V38c0-5.9,6.73-12,18-12v4c-6.76,0-14,3.21-14,8v5.5A.5.5,0,0,1,9.5,44Z"/><path class="cls-1" d="M39,44H18V40H38V38c0-4.79-7.24-8-14-8V26c11.27,0,18,6.1,18,12v3A3,3,0,0,1,39,44Z"/><path class="cls-1" d="M24,24A10,10,0,1,1,34,14,10,10,0,0,1,24,24ZM24,8a6,6,0,1,0,6,6A6,6,0,0,0,24,8Z"/><path class="cls-1" d="M18,44H14.81a.5.5,0,0,1-.45-.72l1.5-3a.5.5,0,0,1,.45-.28H18Z"/></svg>';
            var cartIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-16 -16 80 80"><path class="cls-1" d="M14.17,28l-.35-4L36,22.08V12H10V8H39.5a.5.5,0,0,1,.5.5V23a3,3,0,0,1-2.89,3Z"/><path class="cls-1" d="M36,30.5v3a.5.5,0,0,1-.5.5H17.44a4,4,0,0,1-3.79-2.74L6.52,8H2.81a.5.5,0,0,1-.45-.72l1.5-3A.5.5,0,0,1,4.31,4h3a3,3,0,0,1,2.87,2.12L17.46,30l18,0A.5.5,0,0,1,36,30.5Z"/><circle class="cls-1" cx="15" cy="39" r="3"/><circle class="cls-1" cx="33" cy="39" r="3"/></svg>';
            var searchIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-16 -16 80 80"><path class="cls-1" d="M28,8A12,12,0,1,1,16,20,12,12,0,0,1,28,8m0-4A16,16,0,1,0,44,20,16,16,0,0,0,28,4Z"/><path class="cls-1" d="M9.06,41.06,6.94,38.94a.5.5,0,0,1,0-.71l9.15-9.15,2.83,2.83L9.77,41.06A.5.5,0,0,1,9.06,41.06Z"/></svg>';
            var navIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-6 -5 60 60"><path class="cls-1" d="M35.5,16H10.81a.5.5,0,0,1-.45-.72l1.5-3a.5.5,0,0,1,.45-.28H35.5a.5.5,0,0,1,.5.5v3A.5.5,0,0,1,35.5,16Z"/><path class="cls-1" d="M35.5,26H10.81a.5.5,0,0,1-.45-.72l1.5-3a.5.5,0,0,1,.45-.28H35.5a.5.5,0,0,1,.5.5v3A.5.5,0,0,1,35.5,26Z"/><path class="cls-1" d="M35.5,36H10.81a.5.5,0,0,1-.45-.72l1.5-3a.5.5,0,0,1,.45-.28H35.5a.5.5,0,0,1,.5.5v3A.5.5,0,0,1,35.5,36Z"/></svg>';

            $('#js-toggle-avatar > svg').html(avatarIcon);
            $('.js-track-nav-online > svg').html(cartIcon);
            $('#js-toggle-dropdown-search > svg').html(searchIcon);
            $('#js-open-toggle-offcanvas-left > svg').html(navIcon);
        }
    };

    test.addStyles();

    $(document).ready(function (){
        $('body').addClass('cro');
        test.manipulateDom();
    });
})(jQuery);
