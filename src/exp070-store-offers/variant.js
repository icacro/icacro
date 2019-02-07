// ==UserScript==
// @name         Butikserbjudanden
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
import './style.css';

const test = {

  manipulateDom() {

    const offerLink = document.createElement('a');
    offerLink.classList.add('circle-link','js-track-nav-user-item');
    offerLink.href = '/erbjudanden/butikserbjudanden/';
    var dataTracking = document.createAttribute('data-tracking');
    offerLink.value = '{"name":"Erbjudanden"}';
    offerLink.setAttributeNode(dataTracking);
    offerLink.innerHTML = '<div class="circle-icon circle-icon--purple circle-offers"><svg><use xlink:href="/Assets/icons/symbols.svg#price-tag"></use></svg></div><span class="circle-link__label">Erbjudanden</span>';

    document.getElementById('dropdown-avatar').querySelector('.circle-links').prepend(offerLink);

    offerLink.addEventListener("click", function() {
      gaPush({ eventAction: 'Användarmeny', eventLabel: 'Erbjudande aktiv' });
    });
  }

};

$(document).ready(() => {
  Object.assign(test, CROUTIL());
  test.manipulateDom();
});
