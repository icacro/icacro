// ==UserScript==
// @name         CookieTopbar
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
  cookieName: "acceptCookiesFromTopBarVariant",
  manipulateDom() {
    if(document.cookie.match(new RegExp(test.cookieName + '=([^;]+)'))){
      return;
    }

    //cb-enabled: accepted
    //document.cookie = ['cb-enabled', '=', 'accepted', '; domain=.', '.ica.se', '; path=/', '; expires=', ''].join('');
    const oldMsg = document.querySelector(".cb-enable.sprite2");
    if(oldMsg != null){
      oldMsg.click();
    }

    // <div>Får vi bjuda på kakor?</div>
    const txt= "<p>ICA använder kakor för att tillhandahålla tjänster i våra digitala kanaler, kommunicera och lämna erbjudanden och för att följa upp och utvärdera användningen av våra digitala kanaler. Kakor används också för att hantera, skydda och utveckla våra system och tjänster. Genom att använda vår webbplats accepterar du att kakor används. Du kan styra användningen av kakor i inställningarna i din webbläsare.</p>";

    // variant 1: försvinner vid klick varsomhelst
    // variant 2: försvinner vid klick på ok eller hantera cookies
    // event när meddelandet stängs

    const message = document.createElement("div");
    message.classList.add("cookie-message");
    message.innerHTML = txt;

    const btnAccept = document.createElement("a");
    btnAccept.classList.add("button");
    btnAccept.innerHTML = "Ok, jag förstår";
    btnAccept.addEventListener("click", function(e) {
      gaPush({ eventAction: 'Accepterade cookies', eventLabel: 'cookie topbar' });
      //console.log("gaPush({ eventAction: 'Accepterade cookies', eventLabel: 'cookie topbar' });");
      test.close(message);
    });

    const btnReadMore = document.createElement("a");
    btnReadMore.classList.add("button");
    btnReadMore.classList.add("button--link");
    btnReadMore.innerHTML = "Hantera cookies";
    btnReadMore.href = "https://www.ica.se/policies/cookies/";
    btnReadMore.addEventListener("click", function(e) {
      gaPush({ eventAction: 'Klick på hantera cookies', eventLabel: 'cookie topbar' });
      //console.log("gaPush({ eventAction: 'Klick på hantera cookies', eventLabel: 'cookie topbar' });");
      test.close(message);
    });

    message.insertAdjacentElement("beforeend", btnAccept);
    message.insertAdjacentElement("beforeend", btnReadMore);

    const hdr = document.getElementsByTagName('header')[0];
    hdr.insertAdjacentElement("afterbegin", message);

    window.setTimeout(function() {
      message.classList.add("show-full-message");
      document.body.addEventListener("click", function(e) {
        gaPush({ eventAction: 'Klick på sidan', eventLabel: 'cookie topbar' });
        //console.log("gaPush({ eventAction: 'Klick på sidan', eventLabel: 'cookie topbar' });");
        test.close(message);
      }, { once: true });
    }, 500);

  },
  close(msg) {
    document.cookie = [test.cookieName, '=', true, '; domain=.', window.location.host.toString(), '; path=/', '; expires=Sun, 31 Mar 2019 23:59:59 GMT', ''].join('');
    msg.classList.remove("show-full-message");
  }
};

$(document).ready(() => {
  Object.assign(test, CROUTIL());
  test.manipulateDom();
});
