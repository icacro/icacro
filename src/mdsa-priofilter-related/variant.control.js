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
      related = document.getElementById('PopularPages');
    } else {
      related = document.getElementById('RelatedPages');
    }

    if (related) {

      gaPush({ eventAction: 'MDSA-original, sida med relateratlänkar', eventLabel: document.location.href });

      const toggleArrow = document.querySelector('a.toggle-arrow');

      if (toggleArrow) {
        toggleArrow.addEventListener('click', function() {
          setTimeout(function () {
            let eventAction;
            if (toggleArrow.classList.contains('open')) {
              eventAction = 'MDSA-original, öppna filter';
            } else {
              eventAction = 'MDSA-original, stäng filter';
            }
            gaPush({ eventAction: eventAction, eventLabel: document.location.href });
          }, 50);
        });
      }

    }

  }

};

$(document).ready(() => {
  Object.assign(test, CROUTIL());
  test.manipulateDom();
});
