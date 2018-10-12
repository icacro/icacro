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
import { throttle, gaPush } from '../util/utils';
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
  },
  onItemSelected(name) {
    var filter = test.filters.find(function(element) {
      return element.name == name;
    });
    filter.element[0].click();
    test.searchField.val('');
    gaPush({ eventAction: 'MDSA, autocomplete', eventLabel: name });
  },
  getAutocompleteList(list) {
    if (!list.length) return undefined;

    return $('<ul class="autocomplete"/>').append(
      test.sortList(list).map(test.createAutocompleteItem),
    ).selectable().on('selectableselected', function(e, li) {
      var name = li.selected == undefined ? $(li).text() : li.selected.textContent;
      test.onItemSelected(name);
    });
  },
  manipulateDom() {
    window.setTimeout(() => test.initFilters(), 0);

    if($('.cro div.recipe-search').hasClass('sm_gte_hidden')){
      test.searchField = $('.cro div.filter-search').find('#search2');
    }
    else {
      test.searchField = $('.cro div.recipe-search').find('#search2');
    }

    // placeholder text: sök + rubrik (h1) ex: sök vegansk efterrätt
    var searchTitle = $("meta[name='PageName']").attr("content");
    searchTitle = searchTitle == undefined ? "recept" : searchTitle.toLowerCase();

    test.searchField
      .attr('placeholder', 'Sök ' + searchTitle)
      .attr('autocomplete', 'off')
      .attr('autocorrect', 'off')
      .on('input', throttle(test.searchFieldInputHandler, 300))
      .on('blur', test.searchFieldBlurHandler)
      .on('keydown', test.searchFieldKeyHandler);

    test.searchField.parent().parent().parent().removeClass('md_lte_hidden');
  },
  searchFieldKeyHandler(e) {
    e = e || window.event;

    var $item = $('.autocomplete:first li.ui-selecting');

    if (e.keyCode == '13' && $item.length) {
      $item.removeClass('ui-selecting');
      $item.addClass('ui-selected');
      $item.parent().trigger('selectableselected', $item);
    }

    if (e.keyCode == '40') { // arrow down
      if($item.length) {
        $item.next().addClass('ui-selecting');
        $item.removeClass('ui-selecting');
      }
      else {
        $('.autocomplete:first li:first').addClass('ui-selecting');
      }
    }
    if (e.keyCode == '38') { //arrow up
      if($item.length){
        $item.prev().addClass('ui-selecting');
        $item.removeClass('ui-selecting');
      }
    }
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
};

$(document).ready(() => {
  if($("meta[name='IsMdsaLandingPage']").attr('content') == undefined && $("meta[name='PageType']").attr('content') != "RecipeStartPageType" ) {
    return; // wrong page type
  }
  Object.assign(test, CROUTIL());
  test.getFilters();
  test.manipulateDom();
});
