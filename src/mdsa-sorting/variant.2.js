// ==UserScript==
// @name         mdsa-sorting
// @path         //./src/mdsa-sorting/variant.2.js
// @namespace    http://tampermonkey.net/
// @version      0.1
// @match        https://www.ica.se/recept/*
// @grant        none
// ==/UserScript==

'use strict';

import { CROUTIL, ELM } from '../util/main';
import { gaPush } from '../util/utils';
import './style.css';

const test = {

  manipulateDom() {

    const defaultSorting = 'Saves';

    ELM.get('.filter-dropdown-wrapper filter-option[value="Grade"]').css('hidden');
    ELM.get('.filter-dropdown-wrapper filter-option[value="Votes"]').css('hidden');
    ELM.get('.filter-dropdown-wrapper filter-option[value="Climate"]').css('hidden');
    ELM.get('.filter-dropdown-wrapper filter-option[value="Comments"]').css('hidden');
    ELM.get('.filter-dropdown-wrapper filter-option[value="Nutrition"]').css('hidden');
    ELM.get('.filter-dropdown-wrapper filter-option[value="Saves"]').text('Populärast');

    let selectedSorting = getCookie('recipeSortingPreferenceSelected');

    if (selectedSorting === null) {
      selectedSorting = defaultSorting;
      document.cookie = 'recipeSortingPreferenceSelected=' + selectedSorting + '; path=/';
      if (defaultSorting === 'Saves') {

        ELM.get('filter-dropdown').attr('selected','selected');
        document.cookie = 'recipeSortingPreference=' + selectedSorting + '; path=/';

        let filterObserver = new MutationObserver(function(mutations) {
          console.log('observer');
          const option = ELM.get('.filter-dropdown-wrapper filter-option[value="Saves"]');
          for (var i = 0; i < mutations.length; i++) {
            if (option.exist()) {
              setTimeout(function () {
                ELM.get('.filter-dropdown-wrapper filter-option[value="Saves"]').click();
                console.log('click');
              }, 1000);
            }
          }
        });

        const config = {
          attributes: true,
          childList: false,
          characterData: false,
          subtree: false
        };

        filterObserver.observe(document.getElementById('recipe-header'), config);

      }

    } else if (selectedSorting === 'Saves') {
      ELM.get('filter-dropdown').attr('selected','selected');
      ELM.get('.filter-dropdown-selected .filter-dropdown-selected-content').text('Populärast');
    }

    const relevanceBtn = ELM.get('.filter-dropdown-wrapper filter-option:first-child');
    const savesBtn = ELM.get('.filter-dropdown-wrapper filter-option[value="Saves"]');

    savesBtn.click((e) => {
      document.cookie = 'recipeSortingPreference=Saves; path=/';
      document.cookie = 'recipeSortingPreferenceSelected=Saves; path=/';
      gaPush({ eventAction: 'Klick på sorteringsknapp', eventLabel: 'Populärast' });
    });

    relevanceBtn.click((e) => {
      document.cookie = 'recipeSortingPreference=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
      document.cookie = 'recipeSortingPreferenceSelected=Relevance; path=/';
      gaPush({ eventAction: 'Klick på sorteringsknapp', eventLabel: 'Relevans' });
    });

  },

};

$(document).ready(() => {
  if (ELM.get('.filter-dropdown').exist()) {
    Object.assign(test, CROUTIL());
    test.manipulateDom();
  }
});
