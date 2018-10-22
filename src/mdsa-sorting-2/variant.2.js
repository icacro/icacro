// ==UserScript==
// @name         mdsa-sorting
// @path         //./src/mdsa-sorting-2/variant.js
// @namespace    http://tampermonkey.net/
// @version      0.1
// @match        https://www.ica.se/recept/*
// @grant        none
// ==/UserScript==

'use strict';

import { CROUTIL, ELM } from '../util/main';
import { gaPush } from '../util/utils';

const test = {

  manipulateDom() {

    const defaultSorting = 'Saves';

    ELM.get('.filter-dropdown-wrapper filter-option[value="Saves"]').text('Sparad antal gånger');

    let selectedSorting = getCookie('recipeSortingPreferenceSelected');

    if (selectedSorting === null) {
      selectedSorting = defaultSorting;
      document.cookie = 'recipeSortingPreferenceSelected=' + selectedSorting + '; path=/';
      document.cookie = 'recipeSortingPreference=' + selectedSorting + '; path=/';
      test.sort(selectedSorting);
    } else if (selectedSorting === 'Saves') {
      test.sort(selectedSorting);
    } else if (selectedSorting === 'Relevance') {
      ELM.get('.filter-dropdown-selected-content').attr('data-emptycase','Relevans');
    }

    let changeSortingObserver = new MutationObserver(function(mutations) {
      for (var i = 0; i < mutations.length; i++) {
        if ((getCookie('recipeSortingPreferenceSelected') !== getCookie('recipeSortingPreference')) && getCookie('recipeSortingPreference') !== null) {
          document.cookie = 'recipeSortingPreferenceSelected=' + getCookie('recipeSortingPreference') + '; path=/';
        } else if (getCookie('recipeSortingPreference') === null) {
          document.cookie = 'recipeSortingPreferenceSelected=Relevance; path=/';
        }
      }
    });

    let optionsObserver = new MutationObserver(function(mutations) {
      for (var i = 0; i < mutations.length; i++) {
        let filterText;
        if (ELM.get('.filter-dropdown-wrapper filter-option[selected]').exist()) {
          filterText = ELM.get('.filter-dropdown-wrapper filter-option[selected]').text();
        } else {
          filterText = 'Relevans';
        }
        ELM.get('.filter-dropdown-selected-content').attr('data-emptycase',filterText);
      }
    });

    const config = {
      attributes: true,
      childList: true,
      characterData: false,
      subtree: true
    };

    changeSortingObserver.observe(document.querySelector('filter-dropdown.filter-dropdown'), config);
    optionsObserver.observe(document.querySelector('filter-dropdown.filter-dropdown .filter-dropdown-wrapper'), config);

  },

  sort(selectedSorting) {
    ICA.MDSA.recipeList.defaultSort = selectedSorting;
    ICA.MDSA.recipeList.updateSort();
    if (selectedSorting === 'Saves') {
      ELM.get('filter-dropdown').attr('selected','selected');
      ELM.get('.filter-dropdown-selected .filter-dropdown-selected-content').text('Sparad antal gånger');
      ELM.get('.filter-dropdown-selected-content').attr('data-emptycase','Sparad antal gånger');
    }
  }

};

$(document).ready(() => {
  if (ELM.get('.filter-dropdown').exist()) {
    Object.assign(test, CROUTIL());
    test.manipulateDom();
  }
});
