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

// const filter1='barn';
// const filter1name='Barnvänligt';
// const filter2='billiga-veckan';
// const filter2name='Prisvärt';
// const filter3='under-15-minuter';
// const filter3name='Snabbt';

//Problem - barn och snabbt svårkombinerat som recepten är upptaggade idag! Andra kategorier?

const filter1='middag';
const filter1name='Middag';
const filter2='billiga-veckan';
const filter2name='Prisvärt';
const filter3='under-15-minuter';
const filter3name='Snabbt';

let filterlevel;
if (window.location.href.indexOf(filter1) !== -1 || window.location.href.indexOf(filter2) !== -1 || window.location.href.indexOf(filter3) !== -1) {
  filterlevel=1;
  if (/#:recipefilter=/.test(window.location.href)) {
    filterlevel=2;
  }
} else {
  filterlevel=0;
}

const buttonRow = ELM.create('div button-row');
const btnToggle = ELM.get('.mob-filter-container .filter-toggle-button');

const test = {

  manipulateDom() {

    btnToggle.text('Fler filter');
    ELM.get('.mob-filter-container .active-filter-display').css('hidden');
    ELM.get('.mob-filter-container').append(buttonRow);

    test.createButton(filter3name,filter3);
    test.createButton(filter2name,filter2);
    test.createButton(filter1name,filter1);

    buttonRow.append(btnToggle);
    ELM.get('#RecipeFilterMenu').insertAfter(buttonRow);

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
      window.setTimeout(function () {
        if(filtermatch.getAttribute('data-hits') === '0') {
          // Även kontrollera så att inte annat filter i samma kategori
          btn.css('inactive');
        } else {
          if (filtermatch.parentNode.classList.contains('active')) {
            btn.css('active');
          }
        }
      },500);
    } else {
      btn.css('inactive').css('no-filter');
    }

    return btn;

  },

  createListener(btn,filter,filtermatch) {
    btn.click((e) => {
      if (!btn.hasClass('inactive')) {
        btn.toggle('active');
        filtermatch.click();
        window.setTimeout(function () {
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
      if (filtermatch.getAttribute('data-hits') === '0') {
        // Även kontrollera så att inte annat filter i samma kategori
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
