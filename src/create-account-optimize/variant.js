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

function isEmail(email) {
  return /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(email);
}
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
      ELM.create(`li circle ${(step === 1) ? 'active' : ''} ${(step === 2) ? ' checked' : ''}`).append(`${(step === 2) ? '<div class="check"><svg xmlns="http://www.w3.org/2000/svg" viewBox="1.3568336963653564 3.796941041946411 21.142330169677734 18.591215133666992" id="check" width="100%" height="100%"><path d="M22.182 5.794q0.291 0.242 0.315 0.642t-0.218 0.739q-9.188 13.115-9.939 14.158-0.776 1.042-2 1.055t-2.024-1.055l-6.739-9.479q-0.242-0.339-0.218-0.752t0.315-0.655q1.236-1.067 2.764-1.915 0.315-0.17 0.703-0.049t0.63 0.461l4.558 6.4 7.782-11.055q0.242-0.339 0.618-0.449t0.715 0.061q1.6 0.873 2.739 1.891z"></path></svg></div>' : '<label>1</label>'}`),
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
    input.attr('name', id);
    input.attr('placeholder', txt);
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
    const check = ELM.create('div').css('check');
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="1.3568336963653564 3.796941041946411 21.142330169677734 18.591215133666992" id="check" width="100%" height="100%"><path d="M22.182 5.794q0.291 0.242 0.315 0.642t-0.218 0.739q-9.188 13.115-9.939 14.158-0.776 1.042-2 1.055t-2.024-1.055l-6.739-9.479q-0.242-0.339-0.218-0.752t0.315-0.655q1.236-1.067 2.764-1.915 0.315-0.17 0.703-0.049t0.63 0.461l4.558 6.4 7.782-11.055q0.242-0.339 0.618-0.449t0.715 0.061q1.6 0.873 2.739 1.891z"></path></svg>';
    const form = ELM.get('.form');
    const confirm = ELM.copy('.confirm-policy');

    check.html(svg);

    form.html(' ');

    const ssnCopy = ELM.create('li ssn-confirmed light').text(newSSN).append(check);
    const firstname = this.createRow('firstname', 'Förnamn', 'LoyaltyNewCustomerForm.FirstName');
    const lastname = this.createRow('lastname', 'Efternamn', 'LoyaltyNewCustomerForm.LastName');
    const email = this.createRow('email', 'E-post', 'LoyaltyNewCustomerForm.Email');
    const cellphone = this.createRow('cellphone', 'Mobilnummer', 'LoyaltyNewCustomerForm.CellPhone');
    const password = this.createRow('password', '6-siffrig PIN-kod', 'LoyaltyNewCustomerForm.Password', 'password');
    const passwordConfirm = this.createRow('password-confirm', '', 'LoyaltyNewCustomerForm.ConfirmPassword');
    form.appendAll([ssnCopy, firstname, lastname, email, cellphone, password, passwordConfirm, confirm]);

    const inputFirstname = firstname.find('#LoyaltyNewCustomerForm\\.FirstName');
    const inputLasstname = lastname.find('#LoyaltyNewCustomerForm\\.LastName');
    const inputCellPhone = cellphone.find('#LoyaltyNewCustomerForm\\.CellPhone');
    const inputEmail = email.find('#LoyaltyNewCustomerForm\\.Email');
    const inputPassword = password.find('#LoyaltyNewCustomerForm\\.Password');

    inputPassword.attr('maxlength', 6);
    inputCellPhone.attr('maxlength', 10);

    ELM.get('#ctl00_ctl00_Content_cphOutsidePageWrapper_LoyaltyNewCustomerForm_LoyaltyNewCustomerFormSubmit').attr('value','Slutför');

    //ifyllda inputs?

    inputFirstname.listenTo('blur', (e) => {
      if (e.currentTarget.value.length < 2) {
        inputFirstname.css('ssn-error');
        inputFirstname.removeClass('ssn-ok');
      } else {
        inputFirstname.removeClass('ssn-error');
        inputFirstname.css('ssn-ok');
      }
      if (e.currentTarget.value.length !== 0) {
        inputFirstname.parent().css('has-input');
      }
    });

    inputLasstname.listenTo('blur', (e) => {
      if (e.currentTarget.value.length < 2) {
        inputLasstname.css('ssn-error');
        inputLasstname.removeClass('ssn-ok');
      } else {
        inputLasstname.removeClass('ssn-error');
        inputLasstname.css('ssn-ok');
      }
      if (e.currentTarget.value.length !== 0) {
        inputLasstname.parent().css('has-input');
      }
    });

    inputPassword.listenTo('keyup', (e) => {
      passwordConfirm.find('#LoyaltyNewCustomerForm\\.ConfirmPassword').value(e.currentTarget.value);
    }).listenTo('blur', (e) => {
      if (e.currentTarget.value.length !== 6) {
        inputPassword.css('ssn-error');
        inputPassword.removeClass('ssn-ok');
      } else {
        inputPassword.removeClass('ssn-error');
        inputPassword.css('ssn-ok');
      }
    });

    inputEmail.listenTo('blur', (e) => {
      if (!isEmail(e.currentTarget.value)) {
        inputEmail.css('ssn-error');
        inputEmail.removeClass('ssn-ok');
      } else {
        inputEmail.removeClass('ssn-error');
        inputEmail.css('ssn-ok');
      }
    });
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
    const ssn = ELM.copy('#CivicForm\\.CivicRegistrationNumber').attr('placeholder','Personnummer');
    const label = ELM.create('label');
    li.html(' ');
    label.html('Personnummer');
    li.append(label);
    li.append(ssn);

    if (ssn.value.length !== 0) {
      ssn.parent().css('has-input');
    }
    ssn.listenTo('keyup', () => {
      if (!ssn.hasClass('ssn-ok')) {
        ssn.css('ssn-ok');
      } else if (ssn.hasClass('ssn-error')) {
        ssn.removeClass('ssn-error');
      }
    }).listenTo('focus', () => {
      ssn.parent().css('has-input');
      if (ssn.hasClass('ssn-error')) {
        ssn.removeClass('ssn-error');
      }
    }).listenTo('blur', (e) => {
      removeElements(['p.error']);
      const { value } = e.currentTarget;
      if (value.length === 0) {
        ssn.removeClass(['ssn-ok', 'ssn-error']);
        ssn.parent().removeClass('has-input');
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
    const paywithcard = ELM.get('.payWithCard');
    if (paywithcard.exist()) {
      paywithcard.hide();
    }
    const required = ELM.get('.required-wrapper');
    if (required.exist()) {
      required.hide();
    }
  },
};


$(document).ready(() => {
  Object.assign(test, CROUTIL());
  test.manipulateDom();
  triggerHotJar('createAccountOptimizeVariant');
});
