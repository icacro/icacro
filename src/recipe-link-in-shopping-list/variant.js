// ==UserScript==
// @name         recipe-toggle-ingredients
// @path         //./src/recipe-link-in-shopping-list/variant.js
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

    // klick på lägg till i inköpslista, spara länk till recpet i cookie
    var btn = document.querySelector(".button.js-open-shoppinglist-modal");
    btn.addEventListener("click", function(e) {
      //alert("test");
      console.log(e);

      setTimeout(function() {
        document.querySelector(".shoppinglists__item.js-add-to-existing-shoppinglist").addEventListener("click", function(e) {
          console.log(e);
        });
      }, 3000);



    });


    /*<a href="#" class="shoppinglists__item js-add-to-existing-shoppinglist" data-id="6222508" data-secureid="d35961ee-5daa-4bb4-9967-0a680c1322c2">
                <div class="button button--icon">
                    <svg>
                        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/Assets/icons/sprite.svg#plus"></use>
                    </svg>
                </div>
                <div class="shoppinglists__content">
                    <p class="shoppinglists__item__name">
                        Att handla 2 november
                    </p>
                    <small class="shoppinglists__item__date">2018-11-02</small>
                </div>
            </a>*/

  },
  create_cookie(value) {
    var cookie = [test.cookieName, '=', JSON.stringify(value), '; domain=.', window.location.host.toString(), '; path=/;'].join('');
    document.cookie = cookie;
  },
  read_cookie() {
    var result = document.cookie.match(new RegExp(test.cookieName + '=([^;]+)'));
    result && (result = JSON.parse(result[1]));
    return result;
  },
  cookieName: "recipes-in-shopping-list",
  save(){
    var recipes = test.read_cookie();
    if(recipes != undefined) {

    }
  }
};

$(document).ready(() => {
  Object.assign(test, CROUTIL());
  test.manipulateDom();
});
