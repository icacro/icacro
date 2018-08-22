// ==UserScript==
// @name         mdsa-sorting
// @path         //./src/mdsa-sorting/variant.2.js
// @namespace    http://tampermonkey.net/
// @version      0.1
// @match        https://www.ica.se/recept/*
// @grant        none
// ==/UserScript==


//Dölj otydliga filter, visa som synliga knappar

'use strict';

import { CROUTIL, ELM } from '../util/main';
import { gaPush } from '../util/utils';
import './style.css';

const test = {

  manipulateDom() {

    const sorting = getCookie('recipeSortingPreference');

    ELM.get('.filter-dropdown-wrapper filter-option[value="Grade"]').css('hidden');
    ELM.get('.filter-dropdown-wrapper filter-option[value="Votes"]').css('hidden');
    ELM.get('.filter-dropdown-wrapper filter-option[value="Climate"]').css('hidden');
    ELM.get('.filter-dropdown-wrapper filter-option[value="Comments"]').css('hidden');
    ELM.get('.filter-dropdown-wrapper filter-option[value="Nutrition"]').css('hidden');

    ELM.get('.filter-dropdown-wrapper filter-option[value="Saves"]').text('Populärast');

    if (sorting === 'Saves') {
      ELM.get('.filter-dropdown-selected .filter-dropdown-selected-content').text('Populärast');
      ELM.get('filter-dropdown').attr('selected','selected');
    } else if (sorting === null) {
      //Ingen åtgärd?
      console.log('null');
    } else {
      //Spelar ingen större roll?
      console.log('other sorting options');
    }

    //Event vid öppning?

  },

};

$(document).ready(() => {
  if (ELM.get('.filter-dropdown').exist()) {
    Object.assign(test, CROUTIL());
    test.manipulateDom();
  }
});
