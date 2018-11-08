// ==UserScript==
// @name         recipe-toggle-ingredients
// @path         //./src/recipe-save-button/variant.js
// @namespace    http://tampermonkey.net/
// @version      0.1
// @match        https://www.ica.se/recept/*
// @grant        none
// ==/UserScript==

'use strict';

import { CROUTIL, ELM } from '../util/main';
import { gaPush } from '../util/utils';
import './style.css';

const test = {

  manipulateDom() {

    var btnOld = document.querySelector("a.button.button--heart");
    var btn = document.createElement("div");
    btn.appendChild(btnOld);
    btn.classList.add('new-save-field');
    btn.classList.add('save-recipe-button');

    btnOld.classList.remove('button');
    btnOld.classList.remove('button--heart');
    btnOld.classList.remove('button--auto-width')
    btnOld.classList.add('sprite2-p');
    btnOld.classList.add('icon-heart');
    btnOld.removeChild(btnOld.querySelector("svg"));

    document.querySelector('header div.col-12').insertAdjacentElement("afterbegin", btn);

    /*if (document.querySelector('.recipe-action-buttons.col-lg-4')) {
      document.querySelector('.recipe-action-buttons').classList.remove('col-lg-4');
    }

    const copyUrl = document.createElement('div');
    copyUrl.id = 'copy-url';
    copyUrl.innerHTML = window.location.href.split('?')[0] + '?utm_source=all_share';
    document.querySelector('.recipe-action-buttons').appendChild(copyUrl); */

    /*<div class="save-recipe-button">
<a href="https://www.ica.se/logga-in/" data-tracking="{&quot;name&quot;: &quot;Vannameiräkor Indienne&nbsp;&quot;, &quot;URL&quot;:&quot;https://www.ica.se/recept/vannameirakor-indienne-724610/&quot;, &quot;saved&quot;: false }" data-recipeid="724610" data-loginurlquery="https://www.ica.se/logga-in/?returnurl=https%3a%2f%2fwww.ica.se%2frecept%2f" data-islocal="False" class="sprite2-p icon-heart js-track-recipe-save js-login-modal-iframe js-login-modal-initiated">Spara </a>
    </div>

    <a href="https://www.ica.se/logga-in/" data-loginurlquery="https://www.ica.se/logga-in/?returnurl=https%3a%2f%2fwww.ica.se%2frecept%2fflatbread-med-havrecreme-och-dukkah-724388%2f" class="button button--heart button--auto-width js-login-return-function js-login-modal-iframe js-login-modal-initiated" data-login-function="save">
<svg>
<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/Assets/icons/sprite.svg#heart"></use>
</svg>
<span class="recipe-save-text">Spara</span>
</a>*/

  },

};

$(document).ready(() => {
  Object.assign(test, CROUTIL());
  test.manipulateDom();
});
