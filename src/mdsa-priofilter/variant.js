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

//safaristyling
//"Snabbt" vs "under 30 minuter" (obs! finns ett annat "snabbt")
//"Prisvärt" vs "billiga veckan"
//fördröjning markering i mobil - ställa om redan vid klick

const test = {

  manipulateDom() {

    const btnToggle = ELM.get('.mob-filter-container .filter-toggle-button');

    if (btnToggle.exist()) {
      test.createPrioFilters(btnToggle);
    } else {
      const filterWrapper = document.querySelector('.mob-filter-container');
      let i = 0;
      setInterval(function() {
        i++;
        if (btnToggle.exist()) {
          test.createPrioFilters(btnToggle);
          clearInterval(this);
        } else if (i === 20) {
          clearInterval(this);
        }
      }, 200);
    }

    let filterObserver = new MutationObserver(function(mutations) {
      let filterId;
      for (var i = 0; i < mutations.length; i++) {
        filterId = mutations[i].target.getAttribute('data-id');
        test.filterClasses(mutations[i].target, filterId);
      }
    });

    const config = {
      attributes: true,
      childList: false,
      characterData: false,
      subtree: false
    };

    const filternode1 = document.querySelector('.filtermenu a[data-id="' + filter1Id + '"]');
    const filternode2 = document.querySelector('.filtermenu a[data-id="' + filter2Id + '"]');
    const filternode3 = document.querySelector('.filtermenu a[data-id="' + filter3Id + '"]');

    if (filternode1) filterObserver.observe(filternode1, config);
    if (filternode2) filterObserver.observe(filternode2, config);
    if (filternode3) filterObserver.observe(filternode3, config);

  },

  createPrioFilters(btnToggle) {

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
    btn.attr('href','#').css('button');
    buttonRow.append(btn);

    const filtermatch = document.querySelector('.filtermenu a[data-id="' + filterId + '"]');
    btn.click((e) => {
      e.preventDefault();
      if (btn.hasClass('clickable')) {
        if(filtermatch) {
          filtermatch.click();
          btn.toggle('active');
          //prevent double clicks
          btn.removeClass('clickable');
        }
      }
    });
    if(filtermatch) {
      test.filterClasses(filtermatch, filterId);
      btn.css('clickable');
    } else {
      btn.css('inactive');
    }

    return btn;

  },

  filterClasses(filtermatch,filterId) {
    const btn = ELM.get('.button-row a[data-filter-id="' + filterId + '"]');
    if(btn.exist()) {
      if(filtermatch.getAttribute('data-hits') === '0' || test.hasActiveSiblings(filtermatch)) {
        btn.css('inactive');
        setTimeout(function() {
          btn.removeClass('clickable');
        },200);
      } else {
        btn.removeClass('inactive');
        setTimeout(function() {
          btn.css('clickable');
        },200);
      }
      if(filtermatch.parentNode.classList.contains('active')) {
        btn.css('active');
      } else {
        btn.removeClass('active');
      }
    }
  },

  hasActiveSiblings(filtermatch) {
    const activeFilters = filtermatch.parentNode.parentNode.getElementsByClassName('active');
    for (var i = 0; i < activeFilters.length; i++) {
      if (activeFilters[i] !== filtermatch.parentNode) {
        return true;
      }
    }
    return false;
  }

};

$(document).ready(() => {
  if (ELM.get('.mob-filter-container').exist()) {
    Object.assign(test, CROUTIL());
    test.manipulateDom();
  }
});
