// ==UserScript==
// @name         recipe-toggle-ingredients
// @path         //./src/mdsa-cleanup/variant.js
// @namespace    http://tampermonkey.net/
// @version      0.1
// @match        https://www.ica.se/recept/*
// @grant        none
// ==/UserScript==

'use strict';

import { CROUTIL, ELM } from '../util/main';
import { gaPush } from '../util/utils';
import './style.css';

const btnToggle = ELM.get('.mob-filter-container .filter-toggle-button');
let filterlevel;
if (/barn/.test(window.location.href) || /billiga-veckan/.test(window.location.href) || /under-15-minuter/.test(window.location.href)) {
  filterlevel=1;
  if (/#:recipefilter=/.test(window.location.href)) {
    filterlevel=2;
  }
} else {
  filterlevel=0;
}

const test = {

  manipulateDom() {

    const btnQuick = ELM.create('a').text('Snabbt');
    const btnCostEff = ELM.create('a').text('Prisvärt');
    const btnChildren = ELM.create('a').text('Barnvänligt');

    ELM.get('.mob-filter-container .active-filter-display').remove();
    btnToggle.text('Fler filter');

    test.createButton(btnChildren,'barn');
    test.createButton(btnCostEff,'billiga-veckan');
    test.createButton(btnQuick,'under-15-minuter');

  },

  createButton(btn,filter) {
    btn.css('button').insertAfter(btnToggle);
    console.log(window.location.href + ' - ' + filter + ' - ' + filterlevel);
    if (window.location.href.indexOf(filter) === -1) {
      let useHref;
      if (filterlevel===0) {
        useHref = window.location.href + filter + '/';
      } else if (filterlevel===1) {
        useHref = window.location.href + '#:recipefilter=' + filter;
      } else {
        //
      }
      btn.attr('href',useHref);
    }
  }

};

$(document).ready(() => {
  if (ELM.get('.mob-filter-container').exist()) {
    Object.assign(test, CROUTIL());
    test.manipulateDom();
  }
});
