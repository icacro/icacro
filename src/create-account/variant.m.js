// ==UserScript==
// @name         Create-account
// @path         //./src/create-account/variant.js
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
  showFields() {
    const formWrapper = ELM.get('.form-wrapper');
    const attrs = {
      type: 'text',
    };
    const labelFirstname = ELM.create('label').text('Förnamn');
    const labelLastname = ELM.create('label').text('Efternamn');
    const labelEmail = ELM.create('label').text('E-post');
    const labelPhone = ELM.create('label').text('Mobilnummer');
    const firstname = ELM.create('input input__field firstname', attrs);
    const lastname = ELM.create('input input__field lastname', attrs);
    const email = ELM.create('input input__field email', attrs);
    const phone = ELM.create('input input__field phone', attrs);
    formWrapper.appendAll([
      labelFirstname,
      firstname,
      labelLastname,
      lastname,
      labelEmail,
      email,
      labelPhone,
      phone,
    ]);
  },
  sendSSN(e) {
    e.preventDefault();
    this.showFields();
  },
  manipulateDom() {
    const formWrapper = ELM.get('.form-wrapper');
    const ssnContainer = ELM.create('div ssn-container');
    const labelSSN = ELM.create('label').text('Personnummer');
    const ssnInput = ELM.create('input ssn', {
      autofocus: 'autofocus',
      tabindex: 0,
      maxlength: 12,
      pattern: '[0-9]',
    });
    const ssnBtn = ELM.create('button ssn');
    formWrapper.html(' ');
    ssnContainer.appendAll([ssnInput, ssnBtn]);
    formWrapper.appendAll([labelSSN, ssnContainer]);
    ssnBtn.click(this.sendSSN.bind(this));
  },
};

$(document).ready(() => {
  Object.assign(test, CROUTIL());
  test.manipulateDom();
  triggerHotJar('createAccountVariant');
});
