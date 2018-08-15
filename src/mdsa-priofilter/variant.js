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

//Välja bort
//Filterlevel > 0

const test = {

  manipulateDom() {

    let filterlevel;
    if (/barn/.test(window.location.href) || /billiga-veckan/.test(window.location.href) || /under-15-minuter/.test(window.location.href)) {
      filterlevel=1;
      if (/#:recipefilter=/.test(window.location.href)) {
        filterlevel=2;
      }
    } else {
      filterlevel=0;
    }

    const btnToggle = ELM.get('.mob-filter-container .filter-toggle-button');
    const btnQuick = ELM.create('a').text('Snabbt');
    const btnCostEff = ELM.create('a').text('Prisvärt');
    const btnChildren = ELM.create('a').text('Barnvänligt');

    const buttonRow = ELM.create('div button-row');

    ELM.get('.mob-filter-container').append(buttonRow);

    ELM.get('.mob-filter-container .active-filter-display').remove();
    btnToggle.text('Fler filter');

    test.createButton(btnQuick,'under-15-minuter',buttonRow,btnToggle,filterlevel);
    test.createButton(btnCostEff,'billiga-veckan',buttonRow,btnToggle,filterlevel);
    test.createButton(btnChildren,'barn',buttonRow,btnToggle,filterlevel);
    buttonRow.append(btnToggle);
    ELM.get('#RecipeFilterMenu').insertAfter(buttonRow);

  },

  createButton(btn,filter,buttonRow,btnToggle,filterlevel) {
    buttonRow.append(btn.css('button'));
    btn.attr('href','#');

    const filtermatch = ELM.get('.filtermenu a[data-urlname=' + filter + ']');

    if(filtermatch.exist()) {
      btn.css('clickable');
      btn.click((e) => {
        filtermatch.click();
      });
    }

  }

};

$(document).ready(() => {
  if (ELM.get('.mob-filter-container').exist()) {
    Object.assign(test, CROUTIL());
    test.manipulateDom();
  }
});
