// ==UserScript==
// @name         Mdsa-autocomplete
// @path         //./src/mdsa-autocomplete/variant.js
// @namespace    http://tampermonkey.net/
// @version      0.1
// @match        https://www.ica.se/*
// @grant        none
// ==/UserScript==

'use strict';

import { CROUTIL, ELM } from '../util/main';
// import { triggerHotJar } from '../util/utils';
import './style.css';

const filterStartsWith = q => (
  f => f.toLowerCase().startsWith(q.toLowerCase())
);

const test = {
  filters: [],
  getFilters() {
    test.filters = [];
    $('.filtermenu .filtersegment').each(function () {
      const type = $('legend', this).text().trim();
      const list = $.makeArray($('li > a:first-child', this).map((i, e) => $(e).text()));
      test.filters.push({ type, list });
    });
  },
  findFilter(q) {
    const hasAtLeastOneFilterStartingWith = s => (t => t.list.some(filterStartsWith(s)));
    const toFilterTypeWithMatchingFilters = t => (
      { type: t.type, list: t.list.find(filterStartsWith(q)) }
    );

    return test.filters.filter(hasAtLeastOneFilterStartingWith(q))
      .map(toFilterTypeWithMatchingFilters(q));
  },
  manipulateDom() {
    $('.cro .recipe-search').removeClass('sm_gte_hidden');
  },
};

$(document).ready(() => {
  Object.assign(test, CROUTIL());
  test.manipulateDom();
  test.getFilters()
  console.log(test.filters);
  console.log(test.findFilter('Bil'));
  // triggerHotJar('mdsaAutocompleteVariant');
});
