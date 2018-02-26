// ==UserScript==
// @name         Desktop-nav
// @path         //./src/desktop-nav/variant.js
// @namespace    http://tampermonkey.net/
// @version      0.1
// @match        https://www.ica.se/*
// @grant        none
// ==/UserScript==

import { CROUTIL, ELM } from '../util/main';
import { isLoggedIn } from '../util/utils';
import './style.css';
import common from './common.js';

(function ($) {
  'use strict';

  $(document).ready(() => {
    //Object.assign(common, CROUTIL());
    if($('header.top-bar').length) {
      $('body').addClass('cro-centered');
      if(isLoggedIn()) {
        $('body').addClass('cro-loggedin');
      }
      common.createMenus();
      common.createStorelink();
      common.manipulateDom();

      let isDesktop=0;
      isDesktop=common.checkResponsive(isDesktop);
      let resizeTimer;
      $(window).on('resize', function(e) {
        $('.top-bar').find('.dropdown').removeClass('dropdown--active');
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
          isDesktop=common.checkResponsive(isDesktop);
        }, 250);
      });
    }
  });

})(jQuery);
