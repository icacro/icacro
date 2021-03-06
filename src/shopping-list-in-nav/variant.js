// ==UserScript==
// @name         Shopping-list-in-nav
// @path         //./src/shopping-list-in-nav/variant.js
// @namespace    http://tampermonkey.net/
// @version      0.1
// @match        https://www.ica.se/*
// @grant        none
// ==/UserScript==

'use strict';

import { CROUTIL, ELM } from '../util/main';
import { gaPush } from '../util/utils';
import './style.css';

//Fixa inloggad desktop - återställ desktop och kör mindre ikoner enbart i mobil
//Fixa flicker

const test = {
  manipulateDom() {
    const profile = ELM.get('#js-toggle-avatar');
    const svg = ELM.svg('purchase-list', 'purchase-list');
    svg.click(() => {
      gaPush({ eventAction: 'Inköpslista i menyn, gå till inköpslista' });
      window.location.href = 'https://www.ica.se/inkopslista/';
    });
    svg.insertAfter(profile);
  },
};

$(document).ready(() => {
  Object.assign(test, CROUTIL());
  test.manipulateDom();
});
