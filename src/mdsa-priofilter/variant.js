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
import { gaPush } from '../util/utils';
import './style.css';

// const filter1='barn'; //Typ av recept - krockar med många andra kategorier
// const filter1name='Barnvänligt';
// const filter2='billiga-veckan';
// const filter2name='Prisvärt';
// const filter3='under-15-minuter';
// const filter3name='Snabbt';

const filter1='enkel';
const filter1name='Enkelt';
const filter1Id='61';
const filter2='billiga-veckan';
const filter2name='Prisvärt';
const filter2Id='138';
const filter3='under-30-minuter';
const filter3name='Snabbt';
const filter3Id='146';

const buttonRow = ELM.create('div button-row');

const test = {

  manipulateDom() {

    const btnToggle = ELM.get('.mob-filter-container .filter-toggle-button');

    if (btnToggle.exist()) {
      test.createFilters(btnToggle);
    } else {
      const filterWrapper = document.querySelector('.mob-filter-container');
      let i = 0;
      setInterval(function() {
        i++;
        if (btnToggle.exist()) {
          console.log('filters ok');
          test.createFilters(btnToggle);
        } else if (i === 20) {
          console.log('filters timeout');
          clearInterval(this);
        }
      }, 500);
    }

    let filterObserver = new MutationObserver(function(mutations) {
      let filterId;
      for (var i = 0; i < mutations.length; i++) {
        if (mutations[i].target.hasAttribute('data-id')) {
          filterId = mutations[i].target.getAttribute('data-id');
          if (filterId === filter1Id || filterId === filter2Id || filterId === filter3Id) {
            test.filterClasses(mutations[i].target, filterId);
          }
        }
      }
    });

    filterObserver.observe(document.getElementById('RecipeFilterMenu'), {
      attributes: true,
      childList: false,
      characterData: false,
      subtree: true
    });

  },

  createFilters(btnToggle) {

    btnToggle.text('Fler filter');
    ELM.get('.mob-filter-container .active-filter-display').css('hidden');
    ELM.get('.mob-filter-container').append(buttonRow);

    test.createButton(filter3name,filter3,filter3Id);
    test.createButton(filter2name,filter2,filter2Id);
    test.createButton(filter1name,filter1,filter1Id);
    buttonRow.append(btnToggle);
    buttonRow.insertAfter(ELM.get('.mob-filter-container .active-filter-display'));

  },

  createButton(btnText,filter,filterId) {

    const btn = ELM.create('a').attr('data-filter-id', filterId).text(btnText);
    const filtermatch = document.querySelector('.filtermenu a[data-urlname=' + filter + ']');
    btn.attr('href','#').css('button').css('btn-' + filter);
    buttonRow.append(btn);

    btn.click((e) => {
      e.preventDefault();
    });

    if(filtermatch) {
      test.addClickListener(btn,filter,filtermatch);
    }

    test.filterClasses(filtermatch, filterId);
    return btn;

  },

  addClickListener(btn,filter,filtermatch) {
    btn.click((e) => {
      if (!btn.hasClass('inactive')) {
        filtermatch.click();
      }
    });
  },

  filterClasses(filtermatch,filterId) {

    if (filtermatch) {

      const button = ELM.get('.button-row a[data-filter-id="' + filterId + '"]');
      
      if(filtermatch.getAttribute('data-hits') === '0') {
        button.css('inactive');
      } else {
        button.removeClass('inactive');
      }
      if(filtermatch.parentNode.classList.contains('active')) {
        button.css('active');
      } else {
        button.removeClass('active');
      }

    } else {
      button.css('inactive');
    }

  }

};

$(document).ready(() => {
  if (ELM.get('.mob-filter-container').exist()) {
    Object.assign(test, CROUTIL());
    test.manipulateDom();
  }
});
