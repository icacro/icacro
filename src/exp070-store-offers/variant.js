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
    const link = document.getElementById("navigation-store-link").href;
    if(link == null || link.length < 10){ //ingen butik vald
      return;
    }
    var pos = link.slice(0, link.length - 1).lastIndexOf("/") + 1;
    var storeOffersLink = link.slice(0, pos) + "erbjudanden";

    const nodes = document.querySelectorAll(".navigation__link.js-track-nav-menu-item");
    console.log(nodes);
    var offersLink = null;
    nodes.forEach(function(node) {
      if(offersLink == null && node.innerText == "Erbjudanden"){
        offersLink = node;
      }
    });
    console.log(offersLink);
    console.log(storeOffersLink);

    offersLink.href = storeOffersLink;

    const pageType = document.head.querySelector("[name=PageType][content]").content;
    if(pageType != "OffersInStorePageType"){ // inte sida med butikserbjudanden
      return;
    }

    //layoutfix butikserbjudanden 

    const buttons = document.querySelectorAll(".add-item-to-shoppinglist");
    buttons.forEach(function(button) {
      button.addEventListener("click", function(e){
        alert("test");
        console.log("gaPush({ eventAction: 'Butikserbjudanden', eventLabel: 'Lägg till i inköpslista' });");
        //gaPush({ eventAction: 'Butikserbjudanden', eventLabel: 'Lägg till i inköpslista' });
      });
    });

    /*const offerLink = document.createElement('a');
    offerLink.classList.add('circle-link','js-track-nav-user-item');
    offerLink.href = '/erbjudanden/butikserbjudanden/';
    var dataTracking = document.createAttribute('data-tracking');
    offerLink.value = '{"name":"Erbjudanden"}';
    offerLink.setAttributeNode(dataTracking);
    offerLink.innerHTML = '<div class="circle-icon circle-icon--purple circle-offers"><svg><use xlink:href="/Assets/icons/symbols.svg#price-tag"></use></svg></div><span class="circle-link__label">Erbjudanden</span>';

    document.getElementById('dropdown-avatar').querySelector('.circle-links').prepend(offerLink);

    offerLink.addEventListener("click", function() {
      gaPush({ eventAction: 'Användarmeny', eventLabel: 'Erbjudande aktiv' });
    });*/
  }

};

$(document).ready(() => {
  Object.assign(test, CROUTIL());
  test.manipulateDom();
});
