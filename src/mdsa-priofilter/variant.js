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
const filter2='billiga-veckan';
const filter2name='Prisvärt';
const filter3='under-30-minuter';
const filter3name='Snabbt';

const buttonRow = ELM.create('div button-row');

const test = {

  manipulateDom() {

    const btnToggle = ELM.get('.mob-filter-container .filter-toggle-button');

    if (btnToggle.exist()) {
      test.createFilters(btnToggle);
    } else {

      const filterWrapper = document.querySelector('.mob-filter-container');

      let btnToggleObserver = new MutationObserver(function(mutations) {
        for (var i = 0; i < mutations.length; i++) {
          console.log('checking...');
          if (btnToggle.exist()) {
            console.log('found!');
            test.createFilters(btnToggle);
            btnToggleObserver.disconnect();
            break;
          }
        }
      });

      btnToggleObserver.observe(filterWrapper, {
        attributes: false,
        characterData: false,
        childList: true,
        subtree: false
      });

    }

  },

  createFilters(btnToggle) {

    btnToggle.text('Fler filter');

    ELM.get('.mob-filter-container .active-filter-display').css('hidden');
    ELM.get('.mob-filter-container').append(buttonRow);

    test.createButton(filter3name,filter3);
    test.createButton(filter2name,filter2);
    test.createButton(filter1name,filter1);

    buttonRow.append(btnToggle);
    buttonRow.insertAfter(ELM.get('.mob-filter-container .active-filter-display'));

  },

  createButton(btnText,filter) {

    const btn = ELM.create('a').text(btnText);
    const filtermatch = document.querySelector('.filtermenu a[data-urlname=' + filter + ']');
    btn.attr('href','#').css('button').css('btn-' + filter);
    buttonRow.append(btn);

    btn.click((e) => {
      e.preventDefault();
    });

    if(filtermatch) {
      test.createListener(btn,filter,filtermatch);
      setTimeout(function() {
        if(filtermatch.getAttribute('data-hits') === '0' || test.hasActiveSiblings(filtermatch)) {
          btn.css('inactive');
        } else if (filtermatch.parentNode.classList.contains('active')) {
          btn.css('active');
        }
      },500);
      return btn;
    } else {
      btn.css('inactive').css('no-filter');
      return btn;
    }

  },

  hasActiveSiblings(filtermatch) {
    const activeFilters = filtermatch.parentNode.parentNode.getElementsByClassName('active');
    for (var i = 0; i < activeFilters.length; i++) {
      if (activeFilters[i].innerHtml !== filtermatch.innerHtml) {
        return true;
      }
    }
    return false;
  },

  createListener(btn,filter,filtermatch) {

    btn.click((e) => {
      if (!btn.hasClass('inactive')) {
        btn.toggle('active');
        filtermatch.click();
        setTimeout(function() {
          if (filter !== filter1) test.checkFilter(filter1);
          if (filter !== filter2) test.checkFilter(filter2);
          if (filter !== filter3) test.checkFilter(filter3);
        },500);
      }
    });

  },

  checkFilter(filter) {

    const btn = ELM.get('.button-row .btn-' + filter);
    const filtermatch = document.querySelector('.filtermenu a[data-urlname="'+filter+'"]');
    if (filtermatch) {
      if (filtermatch.getAttribute('data-hits') === '0' || test.hasActiveSiblings(filtermatch)) {
        btn.css('inactive');
      } else {
        btn.removeClass('inactive');
        if (btn.hasClass('no-filter')) {
          test.createListener(btn,filter,filtermatch);
        }
      }
    } else {
      btn.css('inactive');
    }

  }

};

$(document).ready(() => {
  if (ELM.get('.mob-filter-container').exist()) {
    Object.assign(test, CROUTIL());
    test.manipulateDom();
  }
});
