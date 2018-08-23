// ==UserScript==
// @name         Mdsa-autocomplete
// @path         //./src/mdsa-autocomplete/variant.js
// @namespace    http://tampermonkey.net/
// @version      0.1
// @match        https://www.ica.se/*
// @grant        none
// ==/UserScript==

'use strict';

import { CROUTIL } from '../util/main';
import './style.common.css';
import './style.filter-menu.css';

const filterStartsWith = q => (
  f => f.toLowerCase().startsWith(q.toLowerCase())
);

const test = {
  filters: [],
  searchField: undefined,
  topFilters: ['middag', 'nyttig', 'vegan', 'vegetarisk', 'vardag', 'fredag', 'lax', 'enkel'].reverse(),
  getFilters() {
    test.filters = [];
    $('.filtermenu .filtersegment li > a:first-child').each(function () {
      const filter = $(this);
      test.filters.push({
        urlname: filter.data('urlname'),
        name: filter.text(),
        element: filter,
      });
    });
  },
  findFilter(q) {
    return test.filters.filter(
      f => filterStartsWith(q)(f.name) && !f.element.parent().hasClass('active')
    );
  },
  createAutocompleteItem(filter) {
    return $(`<li/>`)
      .text(filter.name)
      .click(() => {
        filter.element.trigger('click');
        filter.element[0].click();
      });
  },
  getAutocompleteList(list) {
    if (!list.length) return undefined;

    return $('<ul class="autocomplete"/>').append(
      test.sortList(list).map(test.createAutocompleteItem)
    );
  },
  manipulateDom() {
    test.collapseFilterMenu();
    window.setTimeout(() => test.initFilters(), 0);

    test.searchField = $('.cro .recipe-search').find('#search2');

    $('.cro .recipe-search').removeClass('sm_gte_hidden');

    test.searchField
      .on('input', test.debounce(test.searchFieldInputHandler, 1000))
      .on('blur', test.searchFieldBlurHandler);
  },
  searchFieldInputHandler(e) {
    const q = $(e.target).val();
    if (q.length > 1) {
      $('.autocomplete', e.target.parentNode).remove();
      test.searchField.after(test.getAutocompleteList(test.findFilter(q)))
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
  createFilterElement(filter) {
    const closeIcon = $('<span class="sprite1-p remove"></span>')
      .click((e) => {
        $(e.target.parentNode).remove();
        filter.element[0].click();
      });
    const filterElement = $('<span class="filter-tag"></span>')
      .text(filter.name)
      .append(closeIcon);
    test.searchField.parent().before(filterElement);
  },
  initFilters() {
    const activeFilters = ICA.MDSA.urlHandler.getAllSegments()
      .map((s) => {
        const filter = $(`a[data-urlname='${s}']`);
        return {
          urlname: s,
          name: filter.text(),
          element: filter,
        };
      });
    activeFilters.forEach(test.createFilterElement);
  },
  sortList(filters) {
    test.topFilters.forEach((tf) => {
      if (filters.some(f => f.urlname === tf)) {
        const prioFilter = filters.find(f => f.urlname === tf);
        const indexOfPrioFilter = filters.indexOf(prioFilter);
        filters.splice(indexOfPrioFilter, 1);
        filters.unshift(prioFilter);
      }
    });
    return filters;
  },
  collapseFilterMenu(){
    const filterSegments = document.querySelectorAll('fieldset.filtersegment');

    for (var i = 0; i < filterSegments.length; i++) {
      if (!filterSegments[i].classList.contains('selected')) {
        filterSegments[i].classList.add('contracted');
      }

      filterSegments[i].querySelector('legend').onclick = function(){
        if(this.parentNode.classList.contains('open')) {
          this.parentNode.classList.remove('open');
          this.parentNode.classList.remove('contracted');
        } else if (!this.parentNode.classList.contains('selected')){
          this.parentNode.classList.add('open');
          this.parentNode.classList.add('contracted');
        }
      };
    }
  }
};

$(document).ready(() => {
  Object.assign(test, CROUTIL());
  test.getFilters();
  test.manipulateDom();
  // triggerHotJar('mdsaAutocompleteVariant');
});