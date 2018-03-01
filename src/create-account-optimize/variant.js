// ==UserScript==
// @name         Create-account-optimize
// @path         //./src/create-account-optimize/variant.js
// @namespace    http://tampermonkey.net/
// @version      0.1
// @match        https://www.ica.se/*
// @grant        none
// ==/UserScript==

'use strict';

import { CROUTIL, ELM } from '../util/main';
import { triggerHotJar, removeElements } from '../util/utils';
import './style.css';

const test = {
  space(str, e) {
    const key = e.keyCode || e.charCode;
    console.log(str, key);
  },
  validateField(pattern, value, len) {
    return (pattern.test(value) && value.length > 0 && value.length === len) || value.length === 0;
  },
  toggleError(box, pattern, value, len) {
    if (this.validateField(pattern, value, len)) {
      box.removeClass(['validation-error']);
    } else {
      box.css('validation-error');
    }
  },
  generateSteps() {
    const accountSteps = ELM.get('.account-steps');
    accountSteps.html(' ');
    const steps = ELM.create('ul');
    steps.appendAll([
      ELM.create('li active').append('<label>1</label>'),
      ELM.create('li').append('<label>2</label>'),
      ELM.create('li').append('<label>Klar</label>'),
    ]);
    accountSteps.append(steps);
  },
  manipulateDom() {
    removeElements(['.icon.icon-tooltip.sprite1', '.civic-registration-format', '.error']);
    this.generateSteps();
    const ssn = ELM.get('#CivicForm\\.CivicRegistrationNumber');
    const box = ELM.create('div validate-box');
    box.insertAfter('#CivicForm\\.CivicRegistrationNumber');
    ssn.attr('placeholder', 'ÅÅÅÅ MM DD NNNN');
    ssn.removeClass(['required', 'dont-validate-as-tel', '_useCheckmarkOnValidate']);
    ssn.css('masking', 'masking__crn');
    ssn.listenTo('keyup', (e) => {
      const { value } = e.currentTarget;
      if (value.length) {
        this.space(value, e);
      }
    }).listenTo('blur', (e) => {
      removeElements(['p.error']);
      ssn.removeClass(['error']);
      this.toggleError(box, /^\d+$/, e.currentTarget.value, 12);
    });
  },
};


$(document).ready(() => {
  Object.assign(test, CROUTIL());
  test.manipulateDom();
  triggerHotJar('createAccountOptimizeVariant');
});
