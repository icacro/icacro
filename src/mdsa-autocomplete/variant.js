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
      /*.click(() => {
        /*if (filter.element.attr('href') === '#') {
          test.createFilterElement(filter);
        }
        if (filter.element.parent().hasClass('subcat')) {
          test.searchField.val(filter.name);
          $('.search > button:submit').click();
        } else {
          filter.element[0].click();
        }
        test.searchField.val('');
      });*/
  },
  onItemSelected(name) {
    var filter = test.filters.find(function(element) {
      return element.name == name;
    });

    if (filter.element.parent().hasClass('subcat')) {
      test.searchField.val(filter.name);
      $('.search > button:submit').click();
    } else {
      filter.element[0].click();
    }
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
    //$('.mdsa-main-grid').parent().removeClass('lg_size15of20 xl_size16of20');
    //$('.cro .recipe-search').removeClass('sm_gte_hidden');

    window.setTimeout(() => test.initFilters(), 0);

    //.cro div.filter-search cssSearch //lilla
    //.cro div.recipe-search cssSearch //stora mitten sm_gte_hidden
    if($('.cro div.recipe-search').hasClass('sm_gte_hidden')){
      test.searchField = $('.cro div.filter-search').find('#search2');
    }
    else {
      test.searchField = $('.cro div.recipe-search').find('#search2');
    }

    //test.searchField = $('.cro .recipe-search').find('#search2');

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

    //test.searchField.parent().parent().removeAttr('data-desktopclass');
    test.searchField.parent().parent().parent().removeClass('md_lte_hidden');

    //test.addHelpLinks();
  },
  searchFieldKeyHandler(e) {
    e = e || window.event;

    var $item = $('.autocomplete:first li.ui-selecting');

    if (e.keyCode == '13' && $item.length) {
      //e.preventDefault();
      $item.removeClass('ui-selecting');
      $item.addClass('ui-selected');
      $item.parent().trigger('selectableselected', $item);
      //test.searchField.val('');
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
  /*createFilterElement(filter) {
    const closeIcon = $('<span class="sprite1-p remove"></span>')
      .click((e) => {
        $(e.target.parentNode).remove();
        filter.element[0].click();
        gaPush({ eventAction: 'Ta bort filter', eventLabel: filter.name });
      });
    const filterElement = $('<span class="filter-tag"></span>')
      .text(filter.name)
      .append(closeIcon);
    test.searchField.parent().after(filterElement);
  },*/
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
    //activeFilters.forEach(test.createFilterElement);
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
  /*hideFilterMenu() {
    if ($('html').hasClass('is-mobile') ||
        $('html').hasClass('is-tablet')) {
      return;
    }

    const filterMenu = $('.filtermenu');
    const button = $(`<a role="button" class="cro-filter-toggle-button button"">
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
  },*/
  /*addHelpLinks() {
    const links = $(`
      <ul class="cro-help-links">
          <li class="cro-help-links__item">
              <a href="/recept/ingrediens/">Ingrediens</a>
          </li>
          <li class="cro-help-links__item">
              <a href="/recept/typ-av-recept/">Typ av recept</a>
          </li>
          <li class="cro-help-links__item">
              <a href="/recept/specialkost/">Specialkost</a>
          </li>
          <li class="cro-help-links__item">
              <a href="/recept/maltid/">Måltid</a>
          </li>
          <li class="cro-help-links__item">
              <a href="/recept/tillfalle/">Tillfälle</a>
          </li>
          <li class="cro-help-links__item">
              <a href="/recept/varldens-kok/">Världens kök</a>
          </li>
          <li class="cro-help-links__item">
              <a href="/recept/tillagningssatt/">Tillagningssätt</a>
          </li>
      </ul>
    `)
      .on('click', (e) => {
        const el = $(e.target);
        if (el.parent().hasClass('cro-help-links__item')) {
          gaPush({ eventAction: 'Klicka på hjälplänk', eventLabel: el.attr('href') });
        }
      });
    const button = $(`
      <button class="cro-help-button"><span class="arrow"></span> Hjälp mig hitta nåt att laga</button>
    `)
      .on('click', () => {
        button.toggleClass('open');
        links.toggleClass('open');
        gaPush({ eventAction: 'Klicka på hjälpknapp', eventLabel: button.hasClass('open') ? 'Öppnar' : 'Stänger' });
      });

    $('.recipe-search').append(button).append(links);
  },*/
};

$(document).ready(() => {
  if($("meta[name='IsMdsaLandingPage']").attr('content') == undefined && $("meta[name='PageType']").attr('content') != "RecipeStartPageType" ) {
    return; // wrong page type
  }
  Object.assign(test, CROUTIL());
  test.getFilters();
  test.manipulateDom();
  // triggerHotJar('mdsaAutocompleteVariant');
});
