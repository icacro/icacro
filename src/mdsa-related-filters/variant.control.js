// ==UserScript==
// @name         mdsa-priofilter
// @path         //./src/mdsa-priofilter/variant.js
// @namespace    http://tampermonkey.net/
// @version      0.1
// @match        https://www.ica.se/recept/*
// @grant        none
// ==/UserScript==

'use strict';

import { CROUTIL, ELM } from '../util/main';
import { gaPush } from '../util/utils';
let related;

const test = {

  manipulateDom() {

    if (document.getElementById('PopularPages')) {
      related = document.querySelector('.right-content .accordion');
    } else {
      related = document.getElementById('RelatedPages');
    }

    if (related) {

      const relatedList = related.querySelectorAll('.accord-content .grid_fluid a');
      for (var i = 0; i < relatedList.length; i++) {
        relatedList[i].addEventListener('click', trackClick);
      }

      function trackClick() {
        gaPush({ eventAction: 'MDSA, relaterad-länk original', eventLabel: this.href });
      }

    }

  }

};

$(document).ready(() => {
  Object.assign(test, CROUTIL());
  test.manipulateDom();
});
