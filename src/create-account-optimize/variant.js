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
import { triggerHotJar, removeElements, gaPush } from '../util/utils';
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
  createRow(classname, txt, id, errortext, type, autocomplete, inputvalue) {
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
    input.attr('value', inputvalue);
    if (inputvalue) {
      li.css('has-input');
    }
    if(autocomplete) {
      input.attr('autocomplete',autocomplete);
    }
    label.html(txt);
    li.append(label);
    li.append(input);
    if(errortext) {
      const errormsg = ELM.create('div errormsg').text(errortext);
      li.append(errormsg);
    }
    if(classname === 'password') {
      let pwspan, pwinput;
      const pwtoggle = ELM.create('a').attr('href','#').attr('id','pwtoggle').text('Dölj');
      const pwchars = ELM.create('div').attr('id','pwchars');
      function createPWField(i) {
        pwspan = ELM.create('span').attr('id','pwspan' + i);
        pwinput = ELM.create('input pwchar').attr('id','pwchar' + i).attr('type','tel').attr('maxlength','2').attr('data-char',i).attr('pattern','[0-9]*').attr('autocomplete','off');
        return pwspan.append(pwinput);
      }
      pwchars.append(createPWField('1')).append(createPWField('2')).append(createPWField('3')).append(createPWField('4')).append(createPWField('5')).append(createPWField('6'));
      label.append(pwtoggle);
      li.append(pwchars);
    }
    li.append(check);
    return li;
  },
  validateInput(input,type,typedata,evt) {
    const parentCL = input.parentNode.classList;
    const valStatusCheck = function() {
      return type === 'ssn' ? test.validateSSN(input,typedata,evt)
       : type === 'tel' ? test.validatePhone(input,evt)
       : type === 'mail' ? test.validateEmail(input,evt)
       : type === 'text' && evt === 'blur' && input.value.length ? 'done'
       : type === 'text' && input.value.length ? 'ontrack'
       : 'error'
    }
    const valStatus = valStatusCheck();
    input.value.length ? parentCL.add('has-input') : parentCL.remove('has-input');
    if (valStatus === 'done') {
      input.classList.remove('field-error');
      parentCL.remove('field-ok');
      input.value.length > 0 ? parentCL.add('field-validated') : parentCL.remove('field-validated');
    } else if (valStatus === 'ontrack') {
      input.classList.remove('field-error');
      parentCL.remove('field-validated');
      parentCL.add('field-ok');
    } else {
      input.classList.add('field-error');
      parentCL.remove('field-validated');
      parentCL.remove('field-ok');
      if (type !== 'text') {
        gaPush({ eventAction: "Fel i formulär", eventLabel: type, eventValue: undefined});
        if (type === 'tel') {
          gaPush({ eventCategory: "Lojalitetskonto", eventAction: "Fel i formulär", eventLabel: "Mobiltelefon\n                            Ange ditt mobilnummer i formatet: 0709999999. Du kan bara fylla i svenskt mobilnummer.Välj sex siffror, varav minst tre olika. Du får inte ange stegar som 123456 eller ditt personnummer som lösenord.Numret måste vara 8-10 siffror utan mellanslag: Numret måste vara 8-10 siffror utan mellanslag", eventValue: undefined});
        } else if (type === 'mail') {
          gaPush({ eventCategory: "Lojalitetskonto", eventAction: "Fel i formulär", eventLabel: "E-postadress\n                            Används vid behov för att återställa ditt lösenord, samt för att hjälpa dig som har digital bonuscheck att hålla reda på den.Ange ditt mobilnummer i formatet: 0709999999. Du kan bara fylla i svenskt mobilnummer.Välj sex siffror, varav minst tre olika. Du får inte ange stegar som 123456 eller ditt personnummer som lösenord.Felaktigt e-postformat: Felaktigt e-postformat", eventValue: undefined});
        } else if (type === 'ssn') {
          gaPush({ eventCategory: "Lojalitetskonto", eventAction: "Fel i formulär", eventLabel: "Personnummer (ÅÅÅÅMMDDNNNN): Felaktigt personnummer. Ange ÅÅÅÅMMDDNNNN.", eventValue: undefined});
        }
      }
    }
    if(type !== 'ssn') test.checkSubmitState();
  },
  validateEmail(input,evt) {
    const validEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(input.value);
    const testInput = function() {
      return evt === 'blur' && validEmail ? 'done'
       : evt !== 'blur' && input.value.length && /^[A-Za-z0-9_@\.\-]+$/.test(input.value) ? 'ontrack'
       : input.value === '' ? 'done'
       : 'error'
    }
    return testInput();
  },
  validatePIN(pin,evt) {
    if (/^[0-9]+$/.test(pin)) {
      const ssn = document.getElementById('ssn-confirmed').innerText.replace('-', '');
      const uniqueChar = function(pw) {
        return pw.split('').filter(function(item, i, ar){ return ar.indexOf(item) === i; }).join('').length;
      }
      const validPIN = (pin !== '012345' && pin !== '123456' && pin !== '234567' && pin !== '345678' &&
      pin !== '456789' && pin !== '567890' && pin !== '987654' && pin !== '876543' &&
      pin !== '765432' && pin !== '654321' && pin !== '543210') && (uniqueChar(pin) > 2) && (!ssn.includes(pin));
      const testInput = function() {
        return pin.length === 6 && validPIN ? 'done' : pin.length === 5 && uniqueChar(pin) === 1 ? 'error' : 'ontrack'
      }
      return testInput();
    }
  },
  validatePhone(input,evt) {
    const telEl = ELM.get('#LoyaltyNewCustomerForm\\.CellPhone');
    let tel = input.value.replace('-', '');
    if (tel === '' || /^[0-9+-]+$/.test(input.value)) {
      if (tel === '' || (/^(7|07|00467|\+467|467)\d{8}$/.test(tel))) {

        if(tel.substring(0,4) === '0046') tel = tel.replace('0046','0');
        else if(tel.substring(0,3) === '+46') tel = tel.replace('+46','0');
        else if (tel.substring(0,2) === '46') tel = tel.replace('46','0');
        else if (tel.substring(0,1) === '7') tel = '0' + tel;

        telEl.attr('value',tel);
        return 'done';
      } else if (evt === 'keyup' && (tel === '' || (tel.length === 1 && (/^(0|7|\+|4)\d{0,1}$/.test(tel))) || (tel.length === 2 && (/^(00|\+4|46)\d{0,2}$/.test(tel))) || (tel.length === 3 && (/^(004|\+46)\d{0,3}$/.test(tel))) || (tel.length === 4 && (/^(0046)\d{0,4}$/.test(tel))) || (/^(7|07|00467|\+467|467)\d{0,8}$/.test(tel)))) {
        telEl.attr('value','');
        return 'ontrack';
      }
    }
  },
  validateSSN(input,mirror,evt) {
    const submit = ELM.get('input[type="submit"]');
    if (input.value === '') {
      test.disableSSNSubmit();
    } else if (/^[0-9-]+$/.test(input.value)) {
      let ssnValue=input.value;
      // 200201192788
      // Utgår från att personen är född efter 1920
      if(parseInt(ssnValue.substring(0, 2)) > 20) ssnValue='19' + ssnValue;
      ssnValue = ssnValue.replace('-', '');
      ssnValue = ssnValue.replace('+', '');
      if (!SSNValidator(ssnValue) && evt === 'keyup' && ssnValue.length !== 12) {
        mirror.setAttribute('value','');
        test.disableSSNSubmit();
        return 'ontrack';
      } else if (SSNValidator(ssnValue)) {
        mirror.setAttribute('value',ssnValue);
        submit.removeAttr('disabled');
        ELM.get('fieldset.form-loaded').removeClass('inactive');
        return 'done';
      }
    }
  },
  disableSSNSubmit() {
    const form = ELM.get('.form-wrapper fieldset');
    const submit = ELM.get('input[type="submit"]');
    submit.attr('disabled');
    form.css('inactive');
  },
  checkSubmitState() {
    const form = ELM.get('fieldset.form-loaded');
    const submit = ELM.get('#ctl00_ctl00_Content_cphOutsidePageWrapper_LoyaltyNewCustomerForm_LoyaltyNewCustomerFormSubmit');
    const email = document.getElementById('LoyaltyNewCustomerForm\.Email');
    const phone = document.getElementById('phone');
    const firstname = document.getElementById('LoyaltyNewCustomerForm\.FirstName');
    const lastname = document.getElementById('LoyaltyNewCustomerForm\.LastName');
    const terms = document.getElementById('LoyaltyNewCustomerForm\.AgreeToTermsHtmlValue');
    const pw = document.getElementById('LoyaltyNewCustomerForm\.Password');

    const validForm = (firstname.value !== '' && lastname.value !== '' && terms.checked && !(email.classList.contains('field-error')) &&
      !(email.parentNode.classList.contains('field-ok')) && !(phone.classList.contains('field-error')) &&
      !(phone.parentNode.classList.contains('field-ok')) && test.validatePIN(pw.value) === 'done');

    validForm ? (
      submit.removeAttr('disabled'),
      form.removeClass('inactive')
    ) : (
      submit.attr('disabled'),
      form.css('inactive')
    )
  },
  toFirstEmpty(pwchar) {
    for (let i = 0; i < pwchar.length; i++) {
      if(pwchar[i].value === '') {
        pwchar[i].focus();
        test.PINFeedback('ontrack');
        break;
      }
    }
  },
  PINFeedback(type) {
    const pwChars = ELM.get('#pwchars');
    const pw = ELM.get('#LoyaltyNewCustomerForm\\.Password');
    const pwNextCL = document.getElementById('LoyaltyNewCustomerForm.Password').nextSibling.classList;
    type==='error' ? (
      pwChars.removeClass('field-validated'),
      pwChars.css('field-error'),
      pw.css('field-error'),
      pwNextCL.remove('showinfo'),
      gaPush({ eventAction: "Fel i formulär", eventLabel: 'pin', eventValue: undefined}),
      gaPush({ eventCategory: "Lojalitetskonto", eventAction: "Fel i formulär", eventLabel: "Lösenord * (6 siffror)\n                            Välj sex siffror, varav minst tre olika. Du får inte ange stegar som 123456 eller ditt personnummer som lösenord.Lösenordet måste vara exakt 6 siffror, varav minst tre olika. Du får inte ange stegar som 123456 eller ditt personnummer som lösenord.: Lösenordet måste vara exakt 6 siffror, varav minst tre olika. Du får inte ange stegar som 123456 eller ditt personnummer som lösenord.", eventValue: undefined})
    ) : type==='done' ? (
      pwChars.css('field-validated'),
      pwChars.removeClass('field-error'),
      pw.removeClass('field-error'),
      pwNextCL.remove('showinfo')
    ) : (
      pwChars.removeClass('field-validated'),
      pwChars.removeClass('field-error'),
      pw.removeClass('field-error'),
      pwNextCL.add('showinfo')
    )
  },
  PINFocusNext(el,checkTwo) {
    if (el.id !== 'pwchar6') {
      const nextEl = el.parentNode.nextSibling.querySelector('input');
      const checkSteps = el.id !== 'pwchar5' && (checkTwo===1 && nextEl.value === '');
      checkSteps ? el.parentNode.nextSibling.nextSibling.querySelector('input').focus() :  nextEl.focus();
    }
  },
  PINFocusPrev(el) {
    if (el.id !== 'pwchar1') el.parentNode.previousSibling.querySelector('input').focus();
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
    const errormsg = ELM.create('div errormsg').text('Du måste ange ett giltigt svenskt personnummer och vara över 18 år');
    check.html(svg);
    li.html(' ');
    label.html('Personnummer');
    li.append(label);
    li.append(ssn);
    li.append(errormsg);
    li.append(check);
    li.append(ssnMirror);

    const ssnEl = document.getElementById('ssn');
    const ssnMirrorEl = document.getElementById('CivicForm\.CivicRegistrationNumber');
    test.disableSSNSubmit();
    ssnEl.value === '' ? (ssnEl.focus()) : (test.validateInput(ssnEl,'ssn',ssnMirrorEl,'keyup'));
    test.addInputEventListeners(ssnEl,'ssn',ssnMirrorEl);

    const button = document.querySelector('input.server-button');
    const wrapper = document.createElement('div');
    button.parentNode.insertBefore(wrapper, button);
    wrapper.appendChild(button);
    wrapper.classList.add('submit-wrapper');
    test.addButtonEventListener(wrapper);
  },
  stepTwo() {
    removeElements(['.verify-email-field']);

    const hiddenSSN = ELM.get('#CivicRegistrationNumberDisabled');
    const ssn = hiddenSSN.value();
    const newSSN = `${ssn.substr(0, 8)}-${ssn.substr(8)}`;
    const ssnConfirmed = ELM.create('span').attr('id','ssn-confirmed').text(newSSN);
    const check = ELM.create('div').css('check');
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="1.3568336963653564 3.796941041946411 21.142330169677734 18.591215133666992" id="check" width="100%" height="100%"><path d="M22.182 5.794q0.291 0.242 0.315 0.642t-0.218 0.739q-9.188 13.115-9.939 14.158-0.776 1.042-2 1.055t-2.024-1.055l-6.739-9.479q-0.242-0.339-0.218-0.752t0.315-0.655q1.236-1.067 2.764-1.915 0.315-0.17 0.703-0.049t0.63 0.461l4.558 6.4 7.782-11.055q0.242-0.339 0.618-0.449t0.715 0.061q1.6 0.873 2.739 1.891z"></path></svg>';
    const form = ELM.get('ol.form');
    const submitparent = ELM.get('fieldset.form-loaded');
    const confirm = ELM.copy('.confirm-policy');

    let firstnameValue, lastnameValue, emailValue, cellphoneValue;
    if (ELM.get('#LoyaltyNewCustomerForm\\.FirstName').value()) {
      firstnameValue = ELM.get('#LoyaltyNewCustomerForm\\.FirstName').value();
    }
    if (ELM.get('#LoyaltyNewCustomerForm\\.LastName').value()) {
      lastnameValue = ELM.get('#LoyaltyNewCustomerForm\\.LastName').value();
    }
    if (ELM.get('#LoyaltyNewCustomerForm\\.Email').value()) {
      emailValue = ELM.get('#LoyaltyNewCustomerForm\\.Email').value();
    }
    if (ELM.get('#LoyaltyNewCustomerForm\\.CellPhone').value()) {
      cellphoneValue = ELM.get('#LoyaltyNewCustomerForm\\.CellPhone').value();
    }

    check.html(svg);
    submitparent.css('inactive');
    const ssnCopy = ELM.create('li ssn-confirmed light').append(ssnConfirmed).append(check);

    const replace = document.querySelectorAll('ol.form li:not(.confirm-policy)');
    for (let i = 1; i < replace.length; i++) {
      replace[i].remove();
    }

    const firstname = this.createRow('firstname', 'Förnamn', 'LoyaltyNewCustomerForm.FirstName', '', 'text', 'fname', '');
    const lastname = this.createRow('lastname', 'Efternamn', 'LoyaltyNewCustomerForm.LastName', '', 'text', 'lname', lastnameValue);
    const email = this.createRow('email', 'E-post', 'LoyaltyNewCustomerForm.Email', 'E-postadressen är felaktig', 'email', 'email', emailValue);
    const cellphone = this.createRow('cellphone', 'Mobilnummer', 'phone', 'Ange ett svenskt mobilnummer', 'tel', 'mobile', cellphoneValue);
    const password = this.createRow('password', '6-siffrig PIN-kod', 'LoyaltyNewCustomerForm.Password', 'Minst 3 olika, ej stegar (123456) eller ditt personnummer.', 'hidden','');
    const passwordConfirm = this.createRow('password-confirm', '', 'LoyaltyNewCustomerForm.ConfirmPassword', '', 'hidden','');

    const cellphoneMirror = ELM.create('input');
    cellphoneMirror.attr('type','hidden');
    cellphoneMirror.attr('id', 'LoyaltyNewCustomerForm.CellPhone');
    cellphoneMirror.attr('name', 'LoyaltyNewCustomerForm.CellPhone');
    cellphone.append(cellphoneMirror);

    const confirmPolicy = ELM.get('.confirm-policy');

    form.appendAll([ssnCopy, firstname, lastname, email, cellphone, password, passwordConfirm, confirmPolicy]);

    const inputFirstname = firstname.find('#LoyaltyNewCustomerForm\\.FirstName');
    const inputLastname = lastname.find('#LoyaltyNewCustomerForm\\.LastName');
    const inputCellPhone = cellphone.find('#phone');
    const inputEmail = email.find('#LoyaltyNewCustomerForm\\.Email');
    const inputPassword = password.find('#LoyaltyNewCustomerForm\\.Password');

    inputPassword.attr('maxlength', 6);
    inputCellPhone.attr('maxlength', 15);
    inputFirstname.focus();

    ELM.get('#ctl00_ctl00_Content_cphOutsidePageWrapper_LoyaltyNewCustomerForm_LoyaltyNewCustomerFormSubmit').attr('value','Slutför').attr('disabled','disabled');

    //om har värde???
    test.addInputEventListeners(document.getElementById('LoyaltyNewCustomerForm.FirstName'),'text','');
    test.addInputEventListeners(document.getElementById('LoyaltyNewCustomerForm.LastName'),'text','');
    test.addInputEventListeners(document.getElementById('phone'),'tel',document.getElementById('LoyaltyNewCustomerForm.CellPhone'));
    test.addInputEventListeners(document.getElementById('LoyaltyNewCustomerForm.Email'),'mail','');
    test.addInputEventListeners(document.getElementById('LoyaltyNewCustomerForm.Password'),'pwd','');

    const termsBtn = ELM.get('#LoyaltyNewCustomerForm\\.AgreeToTermsHtmlValue');
    termsBtn.change((e) => {
      test.checkSubmitState();
      document.querySelector('.confirm-policy > p').classList.remove('error-wrapper');
    });

    const pwchar = document.getElementsByClassName('pwchar');
    const pwspans = document.querySelectorAll('#pwchars span');

    test.addPINEventListeners(pwchar,pwspans);

    const button = document.querySelector('input.server-button');
    const wrapper = document.createElement('div');
    button.parentNode.insertBefore(wrapper, button);
    wrapper.appendChild(button);
    wrapper.classList.add('submit-wrapper');
    test.addButtonEventListener(wrapper);
  },
  addPINEventListeners(pwchar,pwspans) {
    const clickSpan = function(event) {
      const charid = this.id.substring(6);
      const el = document.getElementById('pwchar' + charid);
      el.focus();
      if(el.value === '') test.toFirstEmpty(pwchar);
    }
    const focusChar = function(event) {
      test.PINFeedback('ontrack');
    }
    const blurChar = function(event) {
      if (test.validatePIN(document.getElementById('LoyaltyNewCustomerForm.Password').value) !== 'done') {
        setTimeout(function () {
          if(!document.activeElement.id.includes('pwchar')) test.PINFeedback('error');
        }, 200);
      }
    }
    const keydownChar = function(event) {
      const key = event.keyCode || event.charCode;
      if(isFinite(key)) {
        //om bokstav i samma fält efter siffra
        const charid = parseInt(this.id.charAt(pwchar.length));
        for (let i = 0; i < charid; i++) {
          if (pwchar[i].value === '') {
            test.toFirstEmpty(pwchar);
            break;
          }
        }
        if (key === 8 && this.value === '')
          test.PINFocusPrev(this);
      }
    }
    const keyupChar = function(event) {
      const key = event.keyCode || event.charCode;
      const charid = parseInt(this.id.charAt(pwchar.length));
      let testEl;
      (key === 8 || key == 46) ? ( //backspace, delete
        test.PINFocusPrev(this),
        checkDelete(this)
      ) : key === 37 ? ( //left arrow
        test.PINFocusPrev(this)
      ) : key === 38 ? ( //up arrow
        testEl = document.getElementById('pwchar1'),
        testEl.focus(),
        testEl.selectionStart=0,
        testEl.selectionEnd=0
      ) : key === 39 ? ( //right arrow
        test.PINFocusNext(this,0)
      ) : key === 40 ? ( //down arrow
        testEl = document.getElementById('pwchar6'),
        testEl.focus(),
        testEl.selectionStart=1,
        test.toFirstEmpty(pwchar)
      ) : (
        checkPINinput(this)
      )
      let PIN = '';
      const pwElemConfirm = document.getElementById('LoyaltyNewCustomerForm.ConfirmPassword');
      const pwElem = document.getElementById('LoyaltyNewCustomerForm.Password');
      for (let i = 0; i < pwchar.length; i++) {
        if (pwchar[i].value !== '') {
          PIN += pwchar[i].value;
          pwElemConfirm.value=PIN;
          pwElem.value=PIN;
          i === 5 ? (
            test.validatePIN(pwElem.value) === 'done' ?  test.PINFeedback('done') : test.PINFeedback('error')
          ) : test.validatePIN(pwElem.value) === 'error' ? (
            test.PINFeedback('error')
          ) : (
            test.PINFeedback('ontrack')
          );
        } else {
          break;
        }
      }
      for (let i = 0; i < pwchar.length; i++) {
        pwchar[i].value !== '' ? pwchar[i].classList.add('ok') : pwchar[i].classList.remove('ok');
      }
      test.checkSubmitState();

      function checkDelete(el) {
        if (el.value === '' && el.id !== 'pwchar6') {
          for (let i = charid; i < pwchar.length; i++) {
            if (pwchar[i].value !== '') {
              pwchar[i-1].value = pwchar[i].value;
              pwchar[i].value = '';
            }
          }
        }
      }

      function checkPINinput(el) {
        if (/^[0-9]+$/.test(el.value)) {
          if (el.value.length === 2) {
            if (el.selectionStart === 2) test.PINFocusNext(el,1);
            const double = el.value;
            el.value = double.charAt(0);
            if (charid !== pwchar.length) {
              let savePIN = double.charAt(1);
              let tempPIN;
              for (let i = charid; i < (pwchar.length); i++) {
                if (savePIN !== '') {
                  tempPIN = savePIN;
                  savePIN = pwchar[i].value;
                  pwchar[i].value = tempPIN;
                } else {
                  break;
                }
              }
            }
          } else {
            test.PINFocusNext(el,0);
          }
        } else if (el.value.length === 2) {
          if (/^[0-9]+$/.test(el.value.charAt(0))) el.value = el.value.charAt(0);
          if (/^[0-9]+$/.test(el.value.charAt(1))) el.value = el.value.charAt(1);
        } else if (key !== 9) { //tab
          el.value = '';
        }
      }

    }

    for (let i = 0; i < pwchar.length; i++) {
      pwchar[i].addEventListener('keyup', keyupChar, false);
      pwchar[i].addEventListener('keydown', keydownChar, false);
      pwchar[i].addEventListener('focus', focusChar, false);
      pwchar[i].addEventListener('blur', blurChar, false);
    }

    for (let i = 0; i < pwspans.length; i++) {
      pwspans[i].addEventListener('click', clickSpan, false);
    }

    const toggleBtn = ELM.get('#pwtoggle');

    toggleBtn.click((e) => {
      e.preventDefault();
      let attrType, classAction;
      let toggleClass = window.getComputedStyle(pwchar[1]);
      toggleClass = toggleClass.webkitTextSecurity;

      toggleBtn.text() === 'Visa' ? (
        toggleBtn.text('Dölj'),
        attrType = 'tel',
        classAction = 'remove'
      ) : (
        toggleBtn.text('Visa'),
        attrType = 'password',
        classAction = 'add'
      )

      for (let i = 0; i < pwchar.length; i++) {
        toggleClass ? (
          classAction === 'remove' ? pwchar[i].classList.remove('password') : pwchar[i].classList.add('password')
        ) : (
          pwchar[i].setAttribute('type', attrType)
        )
      }

      test.toFirstEmpty(pwchar);
    });

  },

  addInputEventListeners(input,type,typedata) {
    input.addEventListener('keyup', (event) => {
      input.value.length ? (
        test.validateInput(input,type,typedata,'keyup')
      ) : (type !== 'ssn') ? (
        test.checkSubmitState()
      ) : (
        test.disableSSNSubmit(),
        test.validateInput(input,type,typedata,'keyup')
      )
    });
    input.addEventListener('blur', (event) => {
      test.validateInput(input,type,typedata,'blur');
    });
  },

  addButtonEventListener(button) {
    button.addEventListener('click', (event) => {
      if (document.getElementById('LoyaltyNewCustomerForm.FirstName')) {
        test.validateInput(document.getElementById('LoyaltyNewCustomerForm.FirstName'),'text','','blur');
        test.validateInput(document.getElementById('LoyaltyNewCustomerForm.LastName'),'text','','blur');
        if (test.validatePIN(document.getElementById('LoyaltyNewCustomerForm.Password').value) !== 'done') {
          if(!document.activeElement.id.includes('pwchar')) test.PINFeedback('error');
        }
        if (! document.getElementById('LoyaltyNewCustomerForm\.AgreeToTermsHtmlValue').checked) {
          document.querySelector('.confirm-policy > p').classList.add('error-wrapper');
        }
      }
      gaPush({ eventAction: "Fel i formulär", eventLabel: 'inactive', eventValue: undefined})
    });
  },

  manipulateDom() {
    const stepTwo = ELM.get('#CivicRegistrationNumberDisabled').exist();
    stepTwo ? (
      this.stepTwo(),
      this.generateSteps(2),
      triggerHotJar('createAccountOptimizeStepTwoVariant')
    ) : (
      this.stepOne(),
      this.generateSteps(1),
      triggerHotJar('createAccountOptimizeStepOneVariant')
    );
    const paywithcard = ELM.get('.payWithCard');
    if (paywithcard.exist()) paywithcard.hide();
    const required = ELM.get('.required-wrapper');
    if (required.exist()) required.hide();
    const ua = window.navigator.userAgent;
    const iOS = !!ua.match(/iP(ad|hone)/i);
    if (iOS)
      ELM.get('body').css('ios');
  }
};

$(document).ready(() => {
  //hantera URLar i optimize/targeting - end 6369766963666f726d och 6c6f79616c74796e6577637573746f6d6572666f726d - inte returnURL
  //is-skt = stamkundsterminal
  const skt = ELM.get('.is-skt');
  if (!skt.exist())
    ELM.get('html').css('cro-form'),
    Object.assign(test, CROUTIL()),
    test.manipulateDom()
});
