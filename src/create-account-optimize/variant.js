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
    if(classname === 'password') {
      let pwspan, pwinput;
      const pwtoggle = ELM.create('a').attr('href','#').attr('id','pwtoggle').text('Dölj');
      const pwchars = ELM.create('div').attr('id','pwchars');
      function createPWField(i) {
        pwspan = ELM.create('span').attr('id','pwspan' + i);
        pwinput = ELM.create('input pwchar').attr('id','pwchar' + i).attr('type','tel').attr('maxlength','1').attr('data-char',i).attr('pattern','[0-9]*');
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
    let valStatus;
    if (input.value.length) {
      input.parentNode.classList.add('has-input');
      if(type === 'text') {
        if (evt === 'blur') {
          valStatus = 'done';
        } else {
          valStatus = 'ontrack';
        }
      }
    } else {
      input.parentNode.classList.remove('has-input');
    }
    if(type === 'ssn') {
      valStatus = test.validateSSN(input,typedata, evt);
    } else if(type === 'tel') {
      valStatus = test.validatePhone(input,evt);
    } else if(type === 'mail') {
      if (evt === 'blur') {
        if (test.validateEmail(input.value) === true || input.value === '') {
          valStatus = 'done';
        }
      } else if (input.value.length) {
        valStatus = 'ontrack';
      } else if (input.value === '') {
        valStatus = 'done';
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
    if(type !== 'ssn') {
      test.checkSubmitState();
    }
  },
  validateEmail(email) {
    return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
  },
  validatePIN(input,evt) {
    function uniqueChar(pw) {
      const unique = pw.split('').filter(function(item, i, ar){ return ar.indexOf(item) === i; }).join('').length;
      return unique;
    }
    if (/^[0-9]+$/.test(input.value)) {
      const pin = input.value;
      const ssn = document.getElementById('ssn-confirmed').innerText.replace('-', '');
      if (pin.length === 6) {
        if ((pin !== '012345' && pin !== '123456' && pin !== '234567' && pin !== '345678' &&
        pin !== '456789' && pin !== '567890' && pin !== '987654' && pin !== '876543' &&
        pin !== '765432' && pin !== '654321' && pin !== '543210') &&
        (uniqueChar(input.value) > 2) &&
        (!ssn.includes(input.value))) {
          return 'done';
        }
      } else if (pin.length === 5 && uniqueChar(input.value) === 1) {
         return 'error';
      }
    }
  },
  validatePhone(input,evt) {
    const telEl = document.getElementById('LoyaltyNewCustomerForm.CellPhone');
    let tel = input.value.replace('-', '');
    if (tel === '' || /^[0-9+-]+$/.test(input.value)) {
      if (tel === '' || (/^(7|07|00467|\+467|467)\d{8}$/.test(tel))) {
        if(tel.substring(0,1) === '+') {
          tel.replace('+','00')
        } else if (tel.substring(0,1) === '4') {
          tel = '00' + tel;
        } else if (tel.substring(0,1) === '7') {
          tel = '0' + tel;
        }
        telEl.value=tel;
        return 'done';
      } else if (evt === 'keyup' && (tel === '' || (/^[0|7|\+|4]{1}$/.test(tel)) || (/^(00|\+4|46){2}$/.test(tel)) || (/^(004|\+46){3}$/.test(tel)) || (/^(0046){4}$/.test(tel)) || (/^(07|00467|\+467|467)\d{0,8}$/.test(tel)))) {
        telEl.value='';
        return 'ontrack';
      }
    }
  },
  validateSSN(input,mirror,evt) {
    const submit = ELM.get('input[type="submit"]');
    if (input.value === '') {
      test.disableSSNSubmit(submit);
    } else if (/^[0-9-]+$/.test(input.value)) {
      let ssnValue=input.value;
      if(parseInt(ssnValue.substring(0, 2)) > 20) {
        ssnValue='19' + ssnValue;
      }
      ssnValue = ssnValue.replace('-', '');
      ssnValue = ssnValue.replace('+', '');
      if (!SSNValidator(ssnValue) && evt === 'keyup') {
        mirror.setAttribute('value','');
        test.disableSSNSubmit(submit);
        return 'ontrack';
      } else if (SSNValidator(ssnValue)) {
        mirror.setAttribute('value',ssnValue);
        submit.removeAttr('disabled');
        submit.parent().parent().removeClass('inactive');
        return 'done';
      }
    }
  },
  disableSSNSubmit(submit) {
    submit.attr('disabled');
    submit.parent().parent().css('inactive');
  },
  checkSubmitState() {
    const submit = ELM.get('#ctl00_ctl00_Content_cphOutsidePageWrapper_LoyaltyNewCustomerForm_LoyaltyNewCustomerFormSubmit');
    const email = document.getElementById('LoyaltyNewCustomerForm\.Email');
    const phone = document.getElementById('phone');
    const firstname = document.getElementById('LoyaltyNewCustomerForm\.FirstName');
    const lastname = document.getElementById('LoyaltyNewCustomerForm\.LastName');
    const terms = document.getElementById('LoyaltyNewCustomerForm\.AgreeToTermsHtmlValue');
    const pw = document.getElementById('LoyaltyNewCustomerForm.Password');
    if(firstname.value !== '' &&
      lastname.value !== '' &&
      terms.checked &&
      !(email.classList.contains('field-error')) && !(email.parentNode.classList.contains('field-ok')) &&
      !(phone.classList.contains('field-error')) && !(phone.parentNode.classList.contains('field-ok')) &&
      test.validatePIN(pw) === 'done') {
      submit.removeAttr('disabled');
      submit.parent().removeClass('inactive');
    } else {
      submit.attr('disabled');
      submit.parent().css('inactive');
    }
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
    const pwCharsCL = document.getElementById('pwchars').classList;
    const pwCL = document.getElementById('LoyaltyNewCustomerForm.Password').classList;
    const pwNextCL = document.getElementById('LoyaltyNewCustomerForm.Password').nextSibling.classList;
    if (type==='error') {
      pwCharsCL.remove('field-validated');
      pwCharsCL.add('field-error');
      pwCL.add('field-error');
      pwNextCL.remove('showinfo');
    } else if (type==='done') {
      pwCharsCL.add('field-validated');
      pwCharsCL.remove('field-error');
      pwCL.remove('field-error');
      pwNextCL.remove('showinfo');
    } else {
      pwCharsCL.remove('field-validated');
      pwCharsCL.remove('field-error');
      pwCL.remove('field-error');
      pwNextCL.add('showinfo');
    }
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

    const ssnEl = document.getElementById('ssn');
    const ssnMirrorEl = document.getElementById('CivicForm\.CivicRegistrationNumber');
    test.disableSSNSubmit(ELM.get('input[type="submit"]'));
    if (ssnEl.value === '') {
      ssnEl.focus();
    } else {
      test.validateInput(ssnEl,'ssn',ssnMirrorEl,'keyup');
    }
    test.addInputEventListeners(ssnEl,'ssn',ssnMirrorEl);
  },
  stepTwo() {
    removeElements(['.verify-email-field']);

    const hiddenSSN = ELM.get('#CivicRegistrationNumberDisabled');
    const ssn = hiddenSSN.value();
    const newSSN = `${ssn.substr(0, 8)}-${ssn.substr(8)}`;
    const ssnConfirmed = ELM.create('span').attr('id','ssn-confirmed').text(newSSN);
    const check = ELM.create('div').css('check');
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="1.3568336963653564 3.796941041946411 21.142330169677734 18.591215133666992" id="check" width="100%" height="100%"><path d="M22.182 5.794q0.291 0.242 0.315 0.642t-0.218 0.739q-9.188 13.115-9.939 14.158-0.776 1.042-2 1.055t-2.024-1.055l-6.739-9.479q-0.242-0.339-0.218-0.752t0.315-0.655q1.236-1.067 2.764-1.915 0.315-0.17 0.703-0.049t0.63 0.461l4.558 6.4 7.782-11.055q0.242-0.339 0.618-0.449t0.715 0.061q1.6 0.873 2.739 1.891z"></path></svg>';
    const form = ELM.get('.form');
    const confirm = ELM.copy('.confirm-policy');

    check.html(svg);
    form.parent().css('inactive');
    const ssnCopy = ELM.create('li ssn-confirmed light').append(ssnConfirmed).append(check);

    form.html(' ');

    const firstname = this.createRow('firstname', 'Förnamn', 'LoyaltyNewCustomerForm.FirstName', '');
    const lastname = this.createRow('lastname', 'Efternamn', 'LoyaltyNewCustomerForm.LastName', '');
    const email = this.createRow('email', 'E-post', 'LoyaltyNewCustomerForm.Email', 'E-postadressen är felaktig');
    const cellphone = this.createRow('cellphone', 'Mobilnummer', 'phone', 'Ange ett svenskt mobilnummer', 'tel');
    const password = this.createRow('password', '6-siffrig PIN-kod', 'LoyaltyNewCustomerForm.Password', 'Minst 3 olika, ej stegar (123456) eller ditt personnummer.', 'hidden');
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
    });

    const pwchar = document.getElementsByClassName('pwchar');
    const pwspans = document.querySelectorAll('#pwchars span');

    test.addPINEventListeners(pwchar,pwspans);
  },
  addPINEventListeners(pwchar,pwspans) {
    const clickSpan = function() {
      const charid = this.id.substring(6);
      const el = document.getElementById('pwchar' + charid);
      el.focus();
      if(el.value === '') {
        test.toFirstEmpty(pwchar);
      }
    }
    const focusChar = function() {
      test.PINFeedback('ontrack');
      if (this.value !== '') {
        this.select();
      }
    }
    const blurChar = function() {
      if (test.validatePIN(document.getElementById('LoyaltyNewCustomerForm.Password')) !== 'done') {
        setTimeout(function () {
          if(!document.activeElement.id.includes('pwchar')) {
            test.PINFeedback('error');
          }
        }, 200);
      }
    }
    const keyupChar = function() {
      const key = event.keyCode || event.charCode;
      if (key === 8 || key == 46) { //backspace, delete
        this.classList.remove('ok');
        if (this.value === '' && this.id !== 'pwchar6') {
          const charid = this.id.substring(6);
          for (let i = charid; i < pwchar.length; i++) {
            if (pwchar[i].value !== '') {
              pwchar[i-1].value = pwchar[i].value;
              pwchar[i-1].classList.add('ok');
              pwchar[i].value = '';
              pwchar[i].classList.remove('ok');
            }
          }
        }
        if (this.id !== 'pwchar1') {
          this.parentNode.previousSibling.querySelector('input').focus();
        }
      } else if (key === 37) { //left arrow
        this.parentNode.previousSibling.querySelector('input').focus();
      } else if (key === 39) { //right arrow
        if (this.id !== 'pwchar6' && this.value !== '') {
          this.parentNode.nextSibling.querySelector('input').focus();
        }
      } else if (key === 40) { //up arrow
        test.toFirstEmpty(pwchar);
      } else {
        if (/^[0-9]+$/.test(this.value)) {
          this.classList.add('ok');
          if(this.id !== 'pwchar6') {
            this.parentNode.nextSibling.querySelector('input').focus();
          }
        } else if (key !== 9) { //tab
          this.classList.remove('ok');
          this.value = '';
        }
      }

      let PIN = '';
      const pwElem = document.getElementById('LoyaltyNewCustomerForm.Password');
      for (let i = 0; i < pwchar.length; i++) {
        if (pwchar[i].value !== '') {
          PIN += pwchar[i].value;
          pwElem.value=PIN;
          if (i === 5) {
            if (test.validatePIN(pwElem) === 'done') {
              test.PINFeedback('done');
            } else {
              test.PINFeedback('error');
            }
          } else if (test.validatePIN(pwElem) === 'error'){
            test.PINFeedback('error');
          } else {
            test.PINFeedback('ontrack');
          }
        } else {
          break;
        }
      }
    }

    for (let i = 0; i < pwchar.length; i++) {
      pwchar[i].addEventListener('keyup', keyupChar, false);
      pwchar[i].addEventListener('focus', focusChar, false);
      pwchar[i].addEventListener('blur', blurChar, false);
    }
    for (let i = 0; i < pwspans.length; i++) {
      pwspans[i].addEventListener('click', clickSpan, false);
    }

    const toggleBtn = ELM.get('#pwtoggle');
    toggleBtn.click((e) => {
      e.preventDefault();
      let toggleClass = window.getComputedStyle(pwchar[1]);
      toggleClass = toggleClass.webkitTextSecurity;
      if (this.textContent === 'Visa') {
        this.textContent='Dölj';
        for (let i = 0; i < pwchar.length; i++) {
          if (toggleClass) {
            pwchar[i].classList.remove('password');
          } else {
            pwchar[i].setAttribute('type', 'tel');
          }
        }
      } else {
        this.textContent='Visa';
        for (let i = 0; i < pwchar.length; i++) {
          if (toggleClass) {
            pwchar[i].classList.add('password');
          } else {
            pwchar[i].setAttribute('type', 'password');
          }
        }
      }
      test.toFirstEmpty(pwchar);
    });

  },
  addInputEventListeners(input,type,typedata) {
    input.addEventListener('keyup', (event) => {
      if (input.value.length) {
        test.validateInput(input,type,typedata,'keyup');
      } else {
        test.checkSubmitState();
      }
    });
    input.addEventListener('blur', (event) => {
      test.validateInput(input,type,typedata,'blur');
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
    const ua = window.navigator.userAgent;
    const iOS = !!ua.match(/iP(ad|hone)/i);
    if (iOS) {
      ELM.get('body').css('ios');
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
