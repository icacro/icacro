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
import './style.css';

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
      f => filterStartsWith(q)(f.name) && !f.element.parent().hasClass('active'),
    );
  },
  createAutocompleteItem(filter) {
    return $(`<li/>`)
      .text(filter.name)
      .click(() => {
        if (filter.element.attr('href') === '#') {
          test.createFilterElement(filter);
        }
        filter.element[0].click();
        test.searchField.val('');
      });
  },
  getAutocompleteList(list) {
    if (!list.length) return undefined;

    return $('<ul class="autocomplete"/>').append(
      test.sortList(list).map(test.createAutocompleteItem),
    );
  },
  manipulateDom() {
    // test.collapseFilterMenu();
    test.hideFilterMenu();
    window.setTimeout(() => test.initFilters(), 0);

    test.searchField = $('.cro .recipe-search').find('#search2');

    $('.cro .recipe-search').removeClass('sm_gte_hidden');

    test.searchField
      .on('input', test.debounce(test.searchFieldInputHandler, 1000))
      .on('blur', test.searchFieldBlurHandler);
  },
  searchFieldInputHandler(e) {
    const q = $(e.target).val();
    $('.autocomplete', e.target.parentNode).remove();
    if (q.length > 1) {
      test.searchField.after(test.getAutocompleteList(test.findFilter(q)));
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
  hideFilterMenu() {
    const filterMenu = $('.filtermenu');
    const button = $(`<a role="button" class="filter-toggle-button button"">
      <span class="animated-toggle-arrow inherited-color"></span>
      <span class="filter-toggle-button__text">Visa alla receptfilter</span>
    </a>`);
    button.click(() => {
      button.toggleClass('open');
      if (button.hasClass('open')) {
        button.find('.filter-toggle-button__text').text('Dölj receptfilter');
      } else {
        button.find('.filter-toggle-button__text').text('Visa alla receptfilter');
      }
      filterMenu.toggle();
    });
    filterMenu.hide().before(button).addClass('cro-loaded');
  },
};

$(document).ready(() => {
  Object.assign(test, CROUTIL());
  test.getFilters();
  test.manipulateDom();
  // triggerHotJar('mdsaAutocompleteVariant');
});
