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
import SSNValidater from './ssn';
import './style.css';
// <span class="icon icon-checkmark sprite1" style="display: inline;"></span>
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
  generateSteps(step) {
    const accountSteps = ELM.get('.account-steps');
    const steps = ELM.create('ul');
    accountSteps.html(' ');
    removeElements(['.icon.icon-tooltip.sprite1']);
    steps.appendAll([
      ELM.create(`li circle ${(step === 1) ? 'active' : ''}`).append(`${(step === 2) ? '<div class="icon icon-checkmark sprite1" style="display: inline;"></div>' : '<label>1</label>'}`),
      ELM.create('li line'),
      ELM.create(`li circle ${(step === 2) ? 'active' : ''}`).append('<label>2</label>'),
      ELM.create('li line'),
      ELM.create(`li circle ${(step === 3) ? 'active' : ''}`).append('<label>Klar</label>'),
    ]);
    accountSteps.append(steps);
  },
  createRow(classname, txt, id, type = 'text') {
    const li = ELM.create(`li form-row ${classname}`);
    const label = ELM.create('label');
    const input = ELM.create(`input ${classname}`);
    input.attr('id', id);
    input.attr('type', type);
    label.html(txt);
    li.append(label);
    li.append(input);
    return li;
  },
  stepTwo() {
    removeElements(['.verify-email-field']);

    const hiddenSSN = ELM.get('#CivicRegistrationNumberDisabled');
    const ssn = hiddenSSN.value();
    const newSSN = `${ssn.substr(0, 7)}-${ssn.substr(8)}`;
    const form = ELM.get('.form');

    form.html(' ');

    const ssnCopy = ELM.create('li ssn-confirmed light').text(newSSN);
    const firstname = this.createRow('firstname', 'Förnamn', 'LoyaltyNewCustomerForm.FirstName');
    const lastname = this.createRow('lastname', 'Efternamn', 'LoyaltyNewCustomerForm.LastName');
    const email = this.createRow('email', 'E-postadress', 'LoyaltyNewCustomerForm.Email');
    const cellphone = this.createRow('cellphone', 'Mobiltelefon <span class="light">(frivillig uppgift)</span>', 'LoyaltyNewCustomerForm.CellPhone');
    const password = this.createRow('password', 'Lösenord <span class="light">(6 siffror)</span>', 'LoyaltyNewCustomerForm.Password', 'password');
    const passwordConfirm = this.createRow('password-confirm', '', 'LoyaltyNewCustomerForm.ConfirmPassword');
    form.appendAll([ssnCopy, firstname, lastname, email, cellphone, password, passwordConfirm]);
    const inputCellPhone = cellphone.find('#LoyaltyNewCustomerForm\\.CellPhone');
    const inputPassword = password.find('#LoyaltyNewCustomerForm\\.Password');
    inputPassword.attr('maxlength', 6);
    inputCellPhone.attr('maxlength', 10);
    inputPassword.listenTo('keyup', (e) => {
      passwordConfirm.find('#LoyaltyNewCustomerForm\\.ConfirmPassword').value(e.currentTarget.value);
    }).listenTo('blur', () => {});
  },
  removeStar(selector, txt) {
    const org = ELM.get(selector);
    const copy = ELM.copy(selector);
    const parent = org.parent().parent();
    parent.html(txt);
    parent.append(copy);
  },
  stepOne() {
    const form = ELM.get('.form');
    const li = form.find('li');
    const ssn = ELM.copy('#CivicForm\\.CivicRegistrationNumber');
    const label = ELM.create('label');
    li.html(' ');
    label.html('Personnummer');
    li.append(label);
    li.append(ssn);

    ssn.listenTo('keyup', () => {
      if (!ssn.hasClass('ssn-ok')) {
        ssn.css('ssn-ok');
      } else if (ssn.hasClass('ssn-error')) {
        ssn.removeClass('ssn-error');
      }
    }).listenTo('focus', () => {
      if (ssn.hasClass('ssn-error')) {
        ssn.removeClass('ssn-error');
      }
    }).listenTo('blur', (e) => {
      removeElements(['p.error']);
      const { value } = e.currentTarget;
      if (value.length === 0) {
        ssn.removeClass(['ssn-ok', 'ssn-error']);
        return;
      }
      if (!SSNValidater(value)) {
        ssn.css('ssn-error');
        ssn.removeClass('ssn-ok');
      } else {
        ssn.removeClass('ssn-error');
        ssn.css('ssn-ok');
      }
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
