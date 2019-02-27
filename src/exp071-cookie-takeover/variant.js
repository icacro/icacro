// ==UserScript==
// @name         CookieTakeover
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
    if(document.cookie.match(new RegExp("acceptCookiesVariant" + '=([^;]+)'))){
      return;
    }

    //cb-enabled: accepted
    //document.cookie = ['cb-enabled', '=', 'accepted', '; domain=.', '.ica.se', '; path=/', '; expires=', ''].join('');
    const oldMsg = document.querySelector(".cb-enable.sprite2");
    if(oldMsg != null){
      oldMsg.click();
    }

    const txt= "<h2>Får vi bjuda på kakor?</h2><p>ICA använder kakor för att tillhandahålla tjänster i våra digitala kanaler, kommunicera och lämna erbjudanden och för att följa upp och utvärdera användningen av våra digitala kanaler. Kakor används också för att hantera, skydda och utveckla våra system och tjänster. Genom att använda vår webbplats accepterar du att kakor används. Du kan styra användningen av kakor i inställningarna i din webbläsare.</p>";

    const takeover = document.createElement("div");
    takeover.classList.add("cookie-overlay");

    const content = document.createElement("div");
    content.classList.add("cookie-overlay-content");
    content.innerHTML = txt;

    const btnAccept = document.createElement("a");
    btnAccept.classList.add("button");
    btnAccept.innerHTML = "Ok, Jag förstår";
    btnAccept.addEventListener("click", function(e) {
      //gaPush({ eventAction: 'Accepterade cookies', eventLabel: 'cookie takeover' });
      console.log("gaPush({ eventAction: 'Accepterade cookies', eventLabel: 'cookie takeover' });");
      takeover.style.height = "0";
      test.accept();
    });

    const btnReadMore = document.createElement("a");
    btnReadMore.classList.add("button");
    btnReadMore.classList.add("button--link");
    btnReadMore.innerHTML = "Hantera cookies";
    btnReadMore.href = "https://www.ica.se/policies/cookies/?utm_source=cookiemessage";
    btnReadMore.addEventListener("click", function(e) {
      //gaPush({ eventAction: 'Klick på hantera cookies', eventLabel: 'cookie takeover' });
      console.log("gaPush({ eventAction: 'Klick på hantera cookies', eventLabel: 'cookie takeover' });");
      test.accept();
    });

    content.insertAdjacentElement("beforeend", btnAccept);
    content.insertAdjacentElement("beforeend", btnReadMore);

    takeover.insertAdjacentElement("afterbegin", content);

    const hdr = document.getElementsByTagName('header')[0];
    hdr.insertAdjacentElement("afterbegin", takeover);
    window.setTimeout(function() {
      takeover.style.height = "100vh";
    }, 1000);

  },
  accept() {
    document.cookie = ['acceptCookiesVariant', '=', true, '; domain=.', window.location.host.toString(), '; path=/', '; expires=Sun, 1 Mar 2020 23:59:59 GMT', ''].join('');
  }
};

$(document).ready(() => {
  Object.assign(test, CROUTIL());
  test.manipulateDom();
});
