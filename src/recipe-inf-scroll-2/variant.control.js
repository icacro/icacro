// ==UserScript==
// @name         recipe-toggle-ingredients
// @path         //./src/recipe-inf-scroll/variant.js
// @namespace    http://tampermonkey.net/
// @version      0.1
// @match        https://www.ica.se/recept/*
// @grant        none
// ==/UserScript==

'use strict';

import { CROUTIL } from '../util/main';
import { gaPush } from '../util/utils';

let relatedSectionViewed = 0;

const test = {

  manipulateDom() {

    $.fn.isInViewport = function() {
      var elementTop = $(this).offset().top;
      var elementBottom = elementTop + $(this).outerHeight();
      var viewportTop = $(window).scrollTop();
      var viewportBottom = viewportTop + $(window).height();
      return elementBottom > viewportTop && elementTop < viewportBottom;
    };

    $(window).on('resize scroll', function() {
      if (relatedSectionViewed === 0) {
        if($('section.related-recipes').isInViewport()) {
          gaPush({ eventAction: 'Inf-scroll original: visat relaterade'});
          relatedSectionViewed = 1;
        }
      }
    });

  },

};


$(document).ready(() => {
  Object.assign(test, CROUTIL());
  test.manipulateDom();
});
