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
import { triggerHotJar, gaPush } from '../util/utils';
import './style.css';

const test = {

  manipulateDom() {
    ELM.get('.mdsa-main-grid .right-content').remove();
    ELM.get('h1 .mini-title').remove();
    ELM.get('h1 + .truncate').remove();

    //vänta tills loaded
    ELM.get('fieldset.filtersegment').css('contracted');

    const searchContainer = ELM.create('div search-container');
    searchContainer.append(ELM.get('fieldset.search'));
    ELM.get('header.page-header').append(searchContainer);
    ELM.get('.filter-search fieldset.search').remove();

    ELM.get('.mdsa-main-grid > div').removeClass('xl_size15of20').css('xl_size20of20');
  },

};

$(document).ready(() => {
  Object.assign(test, CROUTIL());
  test.manipulateDom();
});
