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
  activeFilters: [],
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
      { type: t.type, list: t.list.filter(filterStartsWith(q)) }
    );

    return test.filters.filter(hasAtLeastOneFilterStartingWith(q))
      .map(toFilterTypeWithMatchingFilters);
  },
  searchWithFilters() {
    let baseUrl = '/Templates/ajaxresponse.aspx?ajaxFunction=RecipeListMdsa&';
    baseUrl += test.activeFilters.map(f => `filter=${encodeURIComponent(`${f.type}:${f.name}`)}`).join('&');

    // filter=Ingrediens%3AKyckling&filter=Typ+av+recept%3AGryta
    // &mdsarowentityid=f7463ed4-2b41-42e7-9876-a42700eb38db
    // &num=16
    // &query=kyckling+bacon&sortbymetadata=Relevance
    // &id=12
    // &_hour=14
    fetch(baseUrl).then((response) => {
      response.text().then((data) => {
        $('.mdsa').html(data);
        $('.status .count').text($('.mdsa .TotalSearchItems').val());
      });
    })
  },
  createAutocompleteItem(type, name) {
    return $(`<li/>`)
      .text(name)
      .click(() => {
        const filter = { type, name };
        console.log(filter);
        test.activeFilters.push(filter);
        test.searchWithFilters()
      });
  },
  getAutocompleteList(list) {
    return $('<ul class="autocomplete"/>').append(
      list.reduce(
        (acc, curr) => acc.concat(curr.list.map(i => test.createAutocompleteItem(curr.type, i))),
        [],
      )
    );
  },
  manipulateDom() {
    $('.cro .recipe-search')
      .removeClass('sm_gte_hidden')
      .find('#search2')
      .on('input', test.debounce(test.searchFieldInputHandler, 1000))
      .on('blur', test.searchFieldBlurHandler);
  },
  searchFieldInputHandler(e) {
    const q = $(e.target).val();
    if (q.length > 1) {
      $('.autocomplete', e.target.parentNode).remove();
      $('.cro .recipe-search #search2').after(test.getAutocompleteList(test.findFilter(q)))
    }
  },
  searchFieldBlurHandler(e) {
    window.setTimeout(() => $('.autocomplete', e.target.parentNode).remove(), 500);
  },
  debounce(func, wait) {
    let timeout;
    return function () {
      const context = this;
      const args = arguments;
      const later = function () {
        timeout = null;
        func.apply(context, args);
      };
      window.clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
};

$(document).ready(() => {
  Object.assign(test, CROUTIL());
  test.getFilters();
  test.manipulateDom();
  // triggerHotJar('mdsaAutocompleteVariant');
});
