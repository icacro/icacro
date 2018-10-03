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
                '#c-login {' +
                'background: transparent; border: 1px solid #fff; border-radius: 5rem;' +
                'padding: .2rem 2rem; color:#fff; font-size: 1.4rem;' +
                'margin: 10px 10px 0 0; height:27px;' +
                '}' +
                '#c-login:hover {' +
                'opacity:0.75; -webkit-transition: fill .1s ease-in-out; transition: fill .1s;' +
                '}' +
                '#c-login.black {' +
                'color:#3F3F40; border-color:#3F3F40;' +
                '}' +
                '@media only screen and (max-width: 767px) { #c-login {display:none;} }' +
                '</style>';
            $('head').append(styles);
        },
        manipulateDom: function () {
            if ($('.top-bar__wrapper').css('background-color') === 'rgb(230, 0, 100)') {
              var loginClass='white';
            } else {
              var loginClass='black';
            }
            var loginBtn = '<a href="#" id="c-login" class="'+ loginClass +'">Logga in</a>';
            $('.top-bar__right').prepend(loginBtn);
            $('#c-login').on('click',function(e) {
              e.preventDefault();
              if (ga) {
                ga('send', 'event', 'A/B', 'Klick på loginknapp i nav');
              }
              document.querySelector('#js-toggle-avatar .js-track-nav-user-login').click();
            });
        }
    };

    test.addStyles();

    $(document).ready(function (){
        $('body').addClass('cro');
        test.manipulateDom();
    });

})(jQuery);
