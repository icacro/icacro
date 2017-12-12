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
import { insertAfter } from '../util/element-functions';

import './style.css';

hj('trigger','variant6');// eslint-disable-line

function init() {
  const test = {
    moveButton() {
      const container = ELM.create('add-to-list');
      ELM.get('#ingredients-section h2').insertAfter(container);
      container.append(ELM.get('.coachmark-arrow--left-up'));
      container.append(ELM.get('.js-open-shoppinglist-modal'));
    },
    moveDDL() {
      const ddl = ELM.get('.servings-picker--dynamic');
      const container = ELM.get('.ingredients__content');
      container.append(ddl);
    },
    manipulateDom() {
      ELM.push(insertAfter);
      this.moveDDL();
      this.moveButton();
    },
  };
  Object.assign(test, CROUTIL());
  test.manipulateDom();
}

init();
