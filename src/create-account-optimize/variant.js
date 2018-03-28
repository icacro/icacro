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
  createRow(classname, txt, id, errortext, type = 'text') {
    const li = ELM.create(`li form-row ${classname}`);
    const label = ELM.create('label');
    const input = ELM.create(`input ${classname}`);
    const check = ELM.create('span check');
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="1.3568336963653564 3.796941041946411 21.142330169677734 18.591215133666992" id="check" width="100%" height="100%"><path d="M22.182 5.794q0.291 0.242 0.315 0.642t-0.218 0.739q-9.188 13.115-9.939 14.158-0.776 1.042-2 1.055t-2.024-1.055l-6.739-9.479q-0.242-0.339-0.218-0.752t0.315-0.655q1.236-1.067 2.764-1.915 0.315-0.17 0.703-0.049t0.63 0.461l4.558 6.4 7.782-11.055q0.242-0.339 0.618-0.449t0.715 0.061q1.6 0.873 2.739 1.891z"></path></svg>';
    check.html(svg);
    input.attr('id', id);
    input.attr('type', type);
    input.attr('name', id);
    input.attr('placeholder', txt);
    label.html(txt);
    li.append(label);
    li.append(input);
    if(errortext) {
      const errormsg = ELM.create('div errormsg').text(errortext);
      li.append(errormsg);
    }
    li.append(check);
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
    form.parent().css('inactive');
    const ssnCopy = ELM.create('li ssn-confirmed light').text(newSSN).append(check);

    form.html(' ');

    const firstname = this.createRow('firstname', 'Förnamn', 'LoyaltyNewCustomerForm.FirstName', '');
    const lastname = this.createRow('lastname', 'Efternamn', 'LoyaltyNewCustomerForm.LastName', '');
    const email = this.createRow('email', 'E-post', 'LoyaltyNewCustomerForm.Email', 'E-postadressen är felaktig');
    const cellphone = this.createRow('cellphone', 'Mobilnummer', 'phone', 'Ange ett svenskt mobilnummer', 'tel');
    const password = this.createRow('password', '6-siffrig PIN-kod', 'LoyaltyNewCustomerForm.Password', 'PIN-koden ska bestå av 6 siffror', 'tel');
    const passwordConfirm = this.createRow('password-confirm', '', 'LoyaltyNewCustomerForm.ConfirmPassword', '');

    const cellphoneMirror = ELM.create('input');
    cellphoneMirror.attr('type','hidden');
    cellphoneMirror.attr('id', 'LoyaltyNewCustomerForm.CellPhone');
    cellphoneMirror.attr('name', 'LoyaltyNewCustomerForm.CellPhone');
    cellphone.append(cellphoneMirror);

    form.appendAll([ssnCopy, firstname, lastname, email, cellphone, password, passwordConfirm, confirm]);

    const inputFirstname = firstname.find('#LoyaltyNewCustomerForm\\.FirstName');
    const inputLastname = lastname.find('#LoyaltyNewCustomerForm\\.LastName');
    const inputCellPhone = cellphone.find('#phone');
    const inputEmail = email.find('#LoyaltyNewCustomerForm\\.Email');
    const inputPassword = password.find('#LoyaltyNewCustomerForm\\.Password');

    inputPassword.attr('maxlength', 6);
    inputCellPhone.attr('maxlength', 15);


    // Bättre skapa upp fält via copy???

    // const items = ELM.get('ol.form').children('li');
    // items.forEach((item,index) => {
    //   item.css('form-row')
    //   let tooltip = item.find('.tooltip-wrapper');
    //   let checkmark = item.find('.checkmark-wrapper');
    //   if (tooltip.exist() || checkmark.exist()) {
    //     let moveelem;
    //     const input = item.copy('input');
    //     item.find('input').remove();
    //     if (tooltip.exist()) {
    //       moveelem = item.copy('.tooltip-wrapper');
    //     } else if (checkmark.exist()) {
    //       moveelem = item.copy('.checkmark-wrapper');
    //     }
    //     item.append(moveelem);
    //     const movedinput = item.append(input);
    //     if (item.find('label').attr('data-label')) {
    //       item.find('label').text(item.find('label').attr('data-label'));
    //       input.attr('placeholder',item.find('label').attr('data-label'));
    //     } else if (item.find('label').attr('for') == 'LoyaltyNewCustomerForm.CellPhone') {
    //       item.find('label').text('Mobilnummer').attr('data-label','Mobilnummer');
    //       input.attr('placeholder','Mobilnummer');
    //     }
    //   } else {
    //     //console.log(item);
    //   }
    // });

    ELM.get('#ctl00_ctl00_Content_cphOutsidePageWrapper_LoyaltyNewCustomerForm_LoyaltyNewCustomerFormSubmit').attr('value','Slutför').attr('disabled','disabled');

    test.checkInput(document.getElementById('LoyaltyNewCustomerForm.FirstName'),'text','');
    test.checkInput(document.getElementById('LoyaltyNewCustomerForm.LastName'),'text','');
    test.checkInput(document.getElementById('phone'),'tel',document.getElementById('LoyaltyNewCustomerForm.CellPhone'));
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
    let valStatus;
    if (input.value.length) {
      input.parentNode.classList.add('has-input');
    } else {
      input.parentNode.classList.remove('has-input');
    }
    if(type === 'ssn') {
      valStatus = test.checkSSN(input,typedata, evt);
    } else if(type === 'tel') {
      valStatus = test.checkPhone(input,evt);
    } else if(type === 'pwd') {
      valStatus = test.checkPIN(input,evt);
    } else if(type === 'mail') {
      if (evt === 'blur') {
        if (test.isEmail(input.value) === true) {
          valStatus= 'done';
        }
      } else if (input.value.length) {
        valStatus= 'ontrack';
      }
    } else if(type === 'text') {
      if (input.value.length) {
        if (evt === 'blur') {
          valStatus= 'done';
        } else {
          valStatus= 'ontrack';
        }
      }
    }
    if (valStatus === 'done') {
      input.classList.remove('field-error');
      input.parentNode.classList.remove('field-ok');
      if (input.value.length > 0) {
        input.parentNode.classList.add('field-validated');
      } else {
        input.parentNode.classList.remove('field-validated');
      }
    } else if (valStatus === 'ontrack') {
      input.classList.remove('field-error');
      input.parentNode.classList.remove('field-validated');
      input.parentNode.classList.add('field-ok');
    } else {
      input.classList.add('field-error');
      input.parentNode.classList.remove('field-validated');
      input.parentNode.classList.remove('field-ok');
    }
  },
  isEmail(email) {
    return /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(email);
  },
  checkSSN(input, mirror, evt) {
    if (/^[0-9-]+$/.test(input.value)) {
      let ssnValue=input.value;
      if(parseInt(ssnValue.substring(0, 2)) > 20) {
        ssnValue='19' + ssnValue;
      }
      ssnValue = ssnValue.replace('-', '');
      ssnValue = ssnValue.replace('+', '');
      const submit = ELM.get('input[type="submit"]');
      if (!SSNValidator(ssnValue) && evt === 'keyup') {
        input.classList.remove('field-ok');
        input.parentNode.classList.remove('field-validated');
        mirror.setAttribute('value','');
        test.disableSubmit(submit);
        return 'ontrack';
      } else if (SSNValidator(ssnValue)) {
        input.classList.add('field-ok');
        input.parentNode.classList.add('field-validated');
        mirror.setAttribute('value',ssnValue);
        test.enableSubmit(submit);
        return 'done';
      }
    }
  },
  checkPIN(input,evt) {
    if (/^[0-9]+$/.test(input.value)) {
      const pin = input.value;
      //inte pnr, stegar
      if (pin.length === 6) {
        return 'done';
      } else if (pin.length < 6 && evt === 'keyup') {
        return 'ontrack';
      }
    }
  },
  checkPhone(input,evt) {
    const tel = input.value.replace('-', '');
    if (tel === '' || /^[0-9+-]+$/.test(input.value)) {
      if (tel === '' || (/^(7|07|00467|\+467|467)\d{8}$/.test(tel))) {
        //justera om börjar på + el 4
        document.getElementById('LoyaltyNewCustomerForm.CellPhone').value=tel;
        return 'done';
      } else if (evt === 'keyup' && (tel === '' || (/^[0|7|\+|4]{1}$/.test(tel)) || (/^(00|\+4|46){2}$/.test(tel)) || (/^(004|\+46){3}$/.test(tel)) || (/^(0046){4}$/.test(tel)) || (/^(07|00467|\+467|467)\d{0,8}$/.test(tel)))) {
        document.getElementById('LoyaltyNewCustomerForm.CellPhone').value='';
        return 'ontrack';
      }
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
    const check = ELM.create('span check');
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="1.3568336963653564 3.796941041946411 21.142330169677734 18.591215133666992" id="check" width="100%" height="100%"><path d="M22.182 5.794q0.291 0.242 0.315 0.642t-0.218 0.739q-9.188 13.115-9.939 14.158-0.776 1.042-2 1.055t-2.024-1.055l-6.739-9.479q-0.242-0.339-0.218-0.752t0.315-0.655q1.236-1.067 2.764-1.915 0.315-0.17 0.703-0.049t0.63 0.461l4.558 6.4 7.782-11.055q0.242-0.339 0.618-0.449t0.715 0.061q1.6 0.873 2.739 1.891z"></path></svg>';
    check.html(svg);
    li.html(' ');
    label.html('Personnummer');
    li.append(label);
    li.append(ssn);
    li.append(check);
    li.append(ssnMirror);

    // let errorcontainer=ELM.create('p');
    // let errorlist=ELM.create('ul simple-list');
    // const erroritem1=ELM.create('li').text('Fel 1');
    // const erroritem2=ELM.create('li').text('Fel 2');
    // errorlist = errorlist.append(erroritem1).append(erroritem2);
    // errorcontainer = errorcontainer.append(errorlist);
    // ELM.get('.step1 .form-wrapper').append(errorcontainer);

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
  //hantera URLar i optimize/targeting - end 6369766963666f726d och 6c6f79616c74796e6577637573746f6d6572666f726d - inte returnURL
  //is-skt = stamkundsterminal
  const skt = ELM.get('.is-skt');
  if(!skt.exist()) {
    ELM.get('html').css('cro-form');
    Object.assign(test, CROUTIL());
    test.manipulateDom();
    triggerHotJar('createAccountOptimizeVariant');
  }
});
