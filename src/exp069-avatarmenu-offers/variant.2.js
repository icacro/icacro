// ==UserScript==
// @name         Navigeringsikoner
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.ica.se/*
// @grant        none
// ==/UserScript==

'use strict';

import { CROUTIL } from '../util/main';
import { gaPush } from '../util/utils';
import { isLoggedIn } from '../util/utils';
import './style.css';

const test = {

  manipulateDom() {

    const myOffers = document.createElement('a');
    myOffers.classList.add('circle-link','js-track-nav-user-item');
    myOffers.href = '/erbjudanden/butikserbjudanden/';
    var dataTracking = document.createAttribute('data-tracking');
    dataTracking.value = '{"name":"Erbjudanden"}';
    myOffers.setAttributeNode(dataTracking);
    if(isLoggedIn()) {
      myOffers.innerHTML = '<div class="circle-icon circle-icon--purple circle-offers"><svg><use xlink:href="/Assets/icons/symbols.svg#price-tag"></use></svg></div><span class="circle-link__label">Erbjudanden</span>';
    }
    else {
      myOffers.innerHTML = '<div class="circle-icon circle-icon--grey circle-offers"><svg><use xlink:href="/Assets/icons/symbols.svg#price-tag"></use></svg></div><span class="circle-link__label">Erbjudanden</span>';
    }
    document.getElementById('dropdown-avatar').querySelector('.circle-links').prepend(myOffers);

  }

};

$(document).ready(() => {
  Object.assign(test, CROUTIL());
  test.manipulateDom();
});
