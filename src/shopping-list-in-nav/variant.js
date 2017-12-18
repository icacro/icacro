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
import { triggerHotJar, gaPush } from '../util/utils';
import './style.css';

const test = {
  manipulateDom() {
    const profile = ELM.get('#js-toggle-avatar');
    const svg = ELM.svg('purchase-list', 'purchase-list');
    svg.click(() => {
      gaPush({ eventAction: 'Inköpslista i menyn, gå till inköpslista' });
      window.location.href = 'https://www.ica.se/mittica/#:mittica=inkopslistor';
    });
    svg.insertAfter(profile);
  },
};

$(document).ready(() => {
  Object.assign(test, CROUTIL());
  test.manipulateDom();
  triggerHotJar('shoppingListInNavVariant');
});
