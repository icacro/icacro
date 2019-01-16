// ==UserScript==
// @name         loginCoachmark
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
    const avatar = document.getElementById('js-toggle-avatar');
    if(avatar == null || avatar == undefined) {
      return;
    }

    const coachmark = document.createElement("div");
    coachmark.classList.add("coachmark-wrapper");
    coachmark.classList.add("hidden-shout");
    coachmark.classList.add("pl");
    coachmark.classList.add("login-shout");

    const mark = document.createElement("div");
    mark.classList.add("coachmark-tooltip");
    mark.classList.add("coachmark-tooltip--top-middle");
    mark.innerHTML = "<span class='coachmark-tooltip__arrow' style='left: 50%; top: 0px; position: absolute; transform: translateX(0px);'></span><span>Logga in, vettja!</span>";
    coachmark.insertAdjacentElement("afterbegin", mark);

    const closer = document.createElement("span");
    closer.classList.add("coachmark-tooltip");
    closer.classList.add("close");
    closer.classList.add("hidden-shout");
    closer.innerHTML = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="13" height="22" viewBox="0 0 23 32" fill="#fff"><path d="M15.224 13.091l4.582 4.606q0.315 0.291 0.364 0.691t-0.194 0.667q-1.042 1.333-2.376 2.376-0.267 0.242-0.667 0.194t-0.715-0.339l-4.582-4.606-4.606 4.606q-0.291 0.291-0.691 0.339t-0.691-0.194q-1.309-1.042-2.352-2.352-0.242-0.291-0.194-0.691t0.339-0.691l4.606-4.606-4.582-4.582q-0.315-0.315-0.364-0.715t0.194-0.667q1.018-1.309 2.352-2.376 0.291-0.242 0.691-0.194t0.691 0.364l4.606 4.388 4.582-4.388q0.315-0.315 0.715-0.364t0.667 0.194q1.333 1.042 2.376 2.376 0.242 0.267 0.194 0.667t-0.364 0.715z"></path></svg>';
    coachmark.insertAdjacentElement("beforeend", closer);

    avatar.parentNode.insertBefore(coachmark, avatar.nextSibling);

    window.setTimeout(test.showLoginShout, 3000);

  },
  showLoginShout() {
    const coachmark = document.querySelector(".coachmark-wrapper.login-shout");
    coachmark.classList.remove("hidden-shout");

    const closer = document.querySelector(".coachmark-tooltip.close");
    closer.addEventListener("click", function(e) {
        coachmark.classList.add("hidden-shout");
    });

    const mark = document.querySelector(".coachmark-tooltip--top-middle.coachmark-tooltip");
    mark.addEventListener("click", function(e) {
      e.preventDefault();
      coachmark.classList.add("hidden-shout");
      //document.querySelector('#js-toggle-avatar').click();
      document.querySelector('#js-toggle-avatar .js-track-nav-user-login').click();
    });

    /*mark.addEventListener("mouseover", function(e) {
      closer.classList.remove("hidden-shout");
    });

    coachmark.addEventListener("mouseout", function(e) {
      e.preventDefault();
      console.log(e);
      closer.classList.add("hidden-shout");
    });*/

  },
  closeCoachmark(e) {
    console.log(e);
    document.querySelector('#js-toggle-avatar .js-track-nav-user-login').click();
  }

};

$(document).ready(() => {
  Object.assign(test, CROUTIL());
  test.manipulateDom();
});
