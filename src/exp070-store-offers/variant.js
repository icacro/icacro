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
    //console.log(nodes);
    var offersLink = null;
    nodes.forEach(function(node) {
      if(offersLink == null && node.innerText == "Erbjudanden"){
        offersLink = node;
      }
    });
    console.log(offersLink);
    console.log(storeOffersLink);

    if(offersLink != null) {
      offersLink.href = storeOffersLink;
    }

    const pageType = document.head.querySelector("[name=PageType][content]").content;
    if(pageType != "OffersInStorePageType"){ // inte sida med butikserbjudanden
      return;
    }

    //layout butikserbjudanden

    const topbar = document.querySelector(".top-bar");

    const menu = document.createElement("div");
    menu.classList.add("top-bar__sub-menu");

    const menuItems = document.createElement("ul");
    menuItems.classList.add("top-bar-sub-menu");

    menuItems.append(test.createMenuItem("Nöjeserbjudanden", "/erbjudanden/nojeserbjudanden/", false));
    //menuItems.append(test.createMenuItem("Butikserbjudanden", "/erbjudanden/butikserbjudanden/", true));
    menuItems.append(test.createMenuItem("Reklamfilmer", "/erbjudanden/icas-reklamfilmer/", false));
    menuItems.append(test.createMenuItem("Ändra butik", "/butiker/", false));

    menu.append(menuItems);
    topbar.append(menu);

    const buttons = document.querySelectorAll(".add-item-to-shoppinglist");
    buttons.forEach(function(button) {
      button.addEventListener("click", function(e){
        console.log("gaPush({ eventAction: 'Butikserbjudanden', eventLabel: 'Lägg till i inköpslista' });");
        //gaPush({ eventAction: 'Butikserbjudanden', eventLabel: 'Lägg till i inköpslista' });
      });
    });
  },
  createMenuItem(text, url, isActive) {
    const li = document.createElement("li");
    li.classList.add("top-bar-sub-menu__item");
    if(isActive) {
      li.classList.add("top-bar-sub-menu__item--active");
    }
    li.classList.add("store-offers-experiment");
    li.innerHTML = "<a href='" + url + "'>" +text + "</a>";
    return li;
  }
};

$(document).ready(() => {
  Object.assign(test, CROUTIL());
  test.manipulateDom();
});
