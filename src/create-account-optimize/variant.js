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
    let output = str.replace(/[^\d0-9]/g, '');
    let chars = output.length;
    if (key !== 8 && key !== 46) {
      chars += 1;
    }
    if (chars > 4) {
      const year = output.substr(0, 4);
      const month = output.substr(4, 2);
      const day = output.substr(6, 2);
      const lastdigits = output.substr(8, 12);
      output = `${year} ${month}`;
      if (chars > 8) {
        output += ` ${day} ${lastdigits}`;
      } else if (chars > 6) {
        output += ` ${day}`;
      }
    }
    return output;
  },
  validateField(pattern, value, len) {
    return (pattern.test(value.replace(/\s/g, '')) && value.length > 0 && value.length === len);
  },
  toggleError(box, pattern, value, len) {
    if (this.validateField(pattern, value, len)) {
      box.removeClass(['validation-error']).css('validation-ok');
    } else {
      box.removeClass(['validation-ok']).css('validation-error');
    }
  },
  generateSteps(step) {
    const accountSteps = ELM.get('.account-steps');
    const steps = ELM.create('ul');
    accountSteps.html(' ');
    removeElements(['.icon.icon-tooltip.sprite1']);
    steps.appendAll([
      ELM.create(`li circle ${(step === 1) ? 'active' : ''}`).append('<label>1</label>'),
      ELM.create('li line'),
      ELM.create(`li circle ${(step === 2) ? 'active' : ''}`).append('<label>2</label>'),
      ELM.create('li line'),
      ELM.create(`li circle ${(step === 3) ? 'active' : ''}`).append('<label>Klar</label>'),
    ]);
    accountSteps.append(steps);
  },
  stepTwo() {
    removeElements(['.verify-email-field']);
    const hiddenSSN = ELM.get('#CivicRegistrationNumberDisabled');
    const passwordConfirm = ELM.get('#LoyaltyNewCustomerForm\\.ConfirmPassword').attr('type', 'text');
    const password = ELM.get('#LoyaltyNewCustomerForm\\.Password');
    const ssn = hiddenSSN.value();
    const newSSN = `${ssn.substr(0, 7)}-${ssn.substr(8)}`;
    const ssnConfirmed = ELM.create('li ssn-confirmed light').text(newSSN);
    passwordConfirm.parent().parent().parent().hide();
    password.listenTo('keyup', (e) => {
      passwordConfirm.value(e.currentTarget.value);
    }).listenTo('blur', () => {});
    ELM.get('.form').appendFirst(ssnConfirmed);
    ELM.get('#CivicRegistrationNumberDisabled').parent().parent().hide();
    this.removeStar('#LoyaltyNewCustomerForm\\.FirstName', 'Förnamn');
    this.removeStar('#LoyaltyNewCustomerForm\\.LastName', 'Efternamn');
    this.removeStar('#LoyaltyNewCustomerForm\\.CellPhone', 'Mobiltelefon <span class="light">(frivillig uppgift)</span>');
    this.removeStar('#LoyaltyNewCustomerForm\\.Password', 'Lösenord <span class="light">(6 siffror)</span>');
  },
  removeStar(selector, txt) {
    const org = ELM.get(selector);
    const copy = ELM.copy(selector);
    const parent = org.parent().parent();
    parent.html(txt);
    parent.append(copy);
  },
  stepOne() {
    removeElements(['.icon.icon-tooltip.sprite1', '.civic-registration-format', '.error']);
    const ssn = ELM.get('#CivicForm\\.CivicRegistrationNumber');
    const wrapper = ELM.get('.tooltip-wrapper');
    const box = ELM.create('div validate-box');
    const ssnCopy = ELM.create('input ssn-copy');
    ssn.removeAttr('autofocus');
    ssn.hide();
    wrapper.append(ssnCopy);
    box.insertAfter(ssnCopy);
    ssnCopy.attr('placeholder', 'ÅÅÅÅ MM DD NNNN');
    ssnCopy.attr('maxlength', '15');
    ssnCopy.attr('autofocus', 'autofocus');

    ssnCopy.removeClass(['required', 'dont-validate-as-tel', '_useCheckmarkOnValidate']);
    ssnCopy.css('masking', 'masking__crn');
    ssnCopy.listenTo('keyup', (e) => {
      const { value } = e.currentTarget;
      if (value.length) {
        e.currentTarget.value = this.space(value, e);
        ssn.value(e.currentTarget.value.replace(/\s/g, ''));
      }
    }).listenTo('blur', (e) => {
      removeElements(['p.error']);
      ssnCopy.removeClass(['error']);
      this.toggleError(box, /^\d+$/, e.currentTarget.value, 15);
    });
  },
  manipulateDom() {
    const stepTwo = ELM.get('#CivicRegistrationNumberDisabled').exist();
    if (stepTwo) {
      this.stepTwo();
      this.generateSteps(2);
    } else {
      this.stepOne();
      this.generateSteps(1);
    }
  },
};


$(document).ready(() => {
  Object.assign(test, CROUTIL());
  test.manipulateDom();
  triggerHotJar('createAccountOptimizeVariant');
});
