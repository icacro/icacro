// ==UserScript==
// @name         Add-recipe-button
// @path         //./src/add-recipe-button/variant.js
// @namespace    http://tampermonkey.net/
// @version      0.1
// @match        https://www.ica.se/*
// @grant        none
// ==/UserScript==

'use strict';

import { CROUTIL, ELM } from '../util/main';
import { triggerHotJar } from '../util/utils';
import './style.css';

const test = {
  moveButton() {
    const container = ELM.create('add-to-list');
    ELM.get('#ingredients-section h2').insertAfter(container);
    container.append(ELM.get('.coachmark-arrow--left-up'));
    container.append(ELM.get('.js-open-shoppinglist-modal'));
  },
  moveDDL() {
    const ddl = ELM.get('.servings-picker--dynamic');
    if (ddl.element) {
      const container = ELM.get('.ingredients__content');
      container.append(ddl);
    }
  },
  manipulateDom() {
    this.moveButton();
    this.moveDDL();
  },
};

$(document).ready(() => {
  Object.assign(test, CROUTIL());
  test.manipulateDom();
  triggerHotJar('addRecipeButtonVariant');
});
