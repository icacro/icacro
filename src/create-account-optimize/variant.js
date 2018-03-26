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
import SSNValidator from './ssn';
import './style.css';

function isEmail(email) {
  return /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(email);
}
const test = {
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
    const newSSN = `${ssn.substr(0, 8)}-${ssn.substr(8)}`;
    const check = ELM.create('div').css('check');
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="1.3568336963653564 3.796941041946411 21.142330169677734 18.591215133666992" id="check" width="100%" height="100%"><path d="M22.182 5.794q0.291 0.242 0.315 0.642t-0.218 0.739q-9.188 13.115-9.939 14.158-0.776 1.042-2 1.055t-2.024-1.055l-6.739-9.479q-0.242-0.339-0.218-0.752t0.315-0.655q1.236-1.067 2.764-1.915 0.315-0.17 0.703-0.049t0.63 0.461l4.558 6.4 7.782-11.055q0.242-0.339 0.618-0.449t0.715 0.061q1.6 0.873 2.739 1.891z"></path></svg>';
    const form = ELM.get('.form');
    const confirm = ELM.copy('.confirm-policy');

    check.html(svg);

    // Skapa upp fält via copy???

    form.html(' ');
    form.parent().css('inactive');

    const ssnCopy = ELM.create('li ssn-confirmed light').text(newSSN).append(check);

    const firstname = this.createRow('firstname', 'Förnamn', 'LoyaltyNewCustomerForm.FirstName');
    const lastname = this.createRow('lastname', 'Efternamn', 'LoyaltyNewCustomerForm.LastName');
    const email = this.createRow('email', 'E-post', 'LoyaltyNewCustomerForm.Email');
    const cellphone = this.createRow('cellphone', 'Mobilnummer', 'LoyaltyNewCustomerForm.CellPhone');
    const password = this.createRow('password', '6-siffrig PIN-kod', 'LoyaltyNewCustomerForm.Password', 'password');
    const passwordConfirm = this.createRow('password-confirm', '', 'LoyaltyNewCustomerForm.ConfirmPassword');
    form.appendAll([ssnCopy, firstname, lastname, email, cellphone, password, passwordConfirm, confirm]);

    const inputFirstname = firstname.find('#LoyaltyNewCustomerForm\\.FirstName');
    const inputLastname = lastname.find('#LoyaltyNewCustomerForm\\.LastName');
    const inputCellPhone = cellphone.find('#LoyaltyNewCustomerForm\\.CellPhone');
    const inputEmail = email.find('#LoyaltyNewCustomerForm\\.Email');
    const inputPassword = password.find('#LoyaltyNewCustomerForm\\.Password');

    inputPassword.attr('maxlength', 6);
    inputCellPhone.attr('maxlength', 15);

    ELM.get('#ctl00_ctl00_Content_cphOutsidePageWrapper_LoyaltyNewCustomerForm_LoyaltyNewCustomerFormSubmit').attr('value','Slutför').attr('disabled','disabled');

    test.checkInput(document.getElementById('LoyaltyNewCustomerForm.FirstName'),'text','');
    test.checkInput(document.getElementById('LoyaltyNewCustomerForm.LastName'),'text','');
    test.checkInput(document.getElementById('LoyaltyNewCustomerForm.CellPhone'),'tel','');
    test.checkInput(document.getElementById('LoyaltyNewCustomerForm.Email'),'mail','');
    test.checkInput(document.getElementById('LoyaltyNewCustomerForm.Password'),'pwd','');
  },
  checkInput(input,type,typedata) {
    if (input.value.length) {
      input.parentNode.classList.add('has-input');
      if(type === 'ssn') {
        test.checkSSN(input,typedata);
      }
    }
    input.addEventListener('keyup', (event) => {
      test.hasInput(input,type,typedata,'keyup');
    });
    input.addEventListener('blur', (event) => {
      test.hasInput(input,type,typedata,'blur');
    });
  },
  hasInput(input,type,typedata,evt) {
    if (input.value.length) {
      input.parentNode.classList.add('has-input');
    } else {
      input.parentNode.classList.remove('has-input');
    }
    if(type === 'ssn') {
      test.checkSSN(input,typedata);
    } else if(evt === 'blur') {
      //HANTERA FIELD-ERROR, FIELD-OK
      if(type === 'text') {
        if (input.value.length) {
          input.parentNode.classList.add('field-validated');
        } else {
          input.parentNode.classList.remove('field-validated');
        }
      } else if(type === 'mail') {
        //HANTERA FEEDBACK
        if (isEmail(input.value)) {
          input.parentNode.classList.add('field-validated');
          input.classList.remove('field-error');
        } else {
          input.parentNode.classList.remove('field-validated');
          input.classList.add('field-error');
        }
      } else if(type === 'tel') {
        //ÄNDRA TILL TFNVALIDERING
        //HANTERA FEEDBACK
        if (input.value.length) {
          input.parentNode.classList.add('field-validated');
        } else {
          input.parentNode.classList.remove('field-validated');
        }
      } else if(type === 'pwd') {
        //ÄNDRA TILL PWDVALIDERING
        //HANTERA FEEDBACK
        if (input.value.length) {
          input.parentNode.classList.add('field-validated');
        } else {
          input.parentNode.classList.remove('field-validated');
        }
      }
    }
  },
  checkSSN(input, mirror) {
    let ssnValue=input.value;
    if(parseInt(ssnValue.substring(0, 2)) > 20) {
      ssnValue='19' + ssnValue;
    }
    ssnValue = ssnValue.replace("-", "");
    ssnValue = ssnValue.replace("+", "");
    const submit = ELM.get('input[type="submit"]');
    if (!SSNValidator(ssnValue)) {
      input.classList.remove('field-ok');
      input.parentNode.classList.remove('field-validated');
      mirror.setAttribute('value','');
      test.disableSubmit(submit);
    } else {
      input.classList.add('field-ok');
      input.parentNode.classList.add('field-validated');
      mirror.setAttribute('value',ssnValue);
      test.enableSubmit(submit);
      console.log(ssnValue);
    }
  },
  enableSubmit(submit) {
    submit.removeAttr('disabled');
    submit.parent().parent().removeClass('inactive');
  },
  disableSubmit(submit) {
    submit.attr('disabled');
    submit.parent().parent().css('inactive');
  },
  ssnCheck() {
    const ssn = document.getElementById('ssn');
    const ssnMirror = document.getElementById('CivicForm\.CivicRegistrationNumber');
    ssn.focus();
    test.disableSubmit(ELM.get('input[type="submit"]'));
    test.checkInput(ssn,'ssn',ssnMirror);
  },
  stepOne() {
    const form = ELM.get('.form');
    const li = form.find('li');
    const label = ELM.create('label');
    const submit = form.find('input[type="submit"]');
    const ssn = ELM.copy('#CivicForm\\.CivicRegistrationNumber').attr('placeholder','Personnummer').attr('id','ssn').attr('name','ssn').attr('maxlength','13');
    const ssnMirror = ELM.create('input').attr('id','CivicForm\.CivicRegistrationNumber').attr('name','CivicForm\.CivicRegistrationNumber').attr('type','hidden');
    li.html(' ');
    label.html('Personnummer');
    li.append(label);
    li.append(ssn);
    li.append(ssnMirror);

    test.ssnCheck();
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
  if (/^https:\/\/www.ica.se\/ansokan/.test(window.location)) {
    Object.assign(test, CROUTIL());
    test.manipulateDom();
    triggerHotJar('createAccountOptimizeVariant');
  }
});
