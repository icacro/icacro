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

    const offerLink = isLoggedIn() ? document.createElement('a') : document.createElement('div');

    offerLink.classList.add('circle-link','js-track-nav-user-item');
    offerLink.href = '/erbjudanden/butikserbjudanden/';
    var dataTracking = document.createAttribute('data-tracking');
    dataTracking.value = '{"name":"Erbjudanden"}';
    offerLink.setAttributeNode(dataTracking);
    if(isLoggedIn()) {
      offerLink.innerHTML = '<div class="circle-icon circle-icon--purple circle-offers"><svg><use xlink:href="/Assets/icons/symbols.svg#price-tag"></use></svg></div><span class="circle-link__label">Erbjudanden</span>';
    }
    else {
      offerLink.innerHTML = '<div class="circle-icon circle-icon--grey circle-offers"><svg><use xlink:href="/Assets/icons/symbols.svg#price-tag"></use></svg></div><span class="circle-link__label">Erbjudanden</span>';
      test.createCoachmark();
      offerLink.addEventListener("mouseover", function(e){

      });
    }
    document.getElementById('dropdown-avatar').querySelector('.circle-links').prepend(offerLink);

  },
  createCoachmark() {
    const msg = "Logga in för att se erbjudanden";
    const wrapper = document.createElement("div");
    wrapper.classList.add("coachmark-wrapper");
    wrapper.classList.add("pl");

    const mark = document.createElement("div");
    mark.classList.add("coachmark-tooltip");
    mark.classList.add("coachmark-tooltip--bottom-middle");
    mark.innerHTML = "<span class='coachmark-tooltip__arrow' style='left: 50%; top: 35px; position: absolute; transform: translateX(0px);'></span><span>" + msg + "</span>";
    wrapper.insertAdjacentElement("afterbegin", mark);

    document.getElementById("dropdown-avatar").insertAdjacentElement("beforeend", wrapper);
  },
  showCoachmark() {

  }

  /*<div class="pl coachmark-wrapper" style="z-index: 99; left: 802px; top: 1631.33px; position: absolute;">
  <div class="coachmark-tooltip coachmark-tooltip--top-middle">
    <span class="coachmark-tooltip__arrow" style="transform: translateX(0px); position: absolute; top: 0px; left: 50%;"></span>
    Så enkelt!
</div>
</div>*/

};

$(document).ready(() => {
  Object.assign(test, CROUTIL());
  test.manipulateDom();
});
