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

const test = {

  manipulateDom() {

    const btnToggle = ELM.get('.mob-filter-container .filter-toggle-button');
    const btnClose = ELM.get('#RecipeFilterMenu .filter-toggle-button');

    if (btnToggle.exist())  createListener(btnToggle);
    if (btnClose.exist())   createListener(btnClose);

    function createListener(btn) {
      btn.click((e) => {
        setTimeout(function() {
          if (btn.hasClass('open')) {
            gaPush({ eventAction: 'Öppnat filtermeny' });
          }
        },200);
      });
    }

  },

};

$(document).ready(() => {
  Object.assign(test, CROUTIL());
  test.manipulateDom();
});
