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

    var shoppingList = document.querySelector(".ingredient-search");
    if(shoppingList != null) {
      console.log(shoppingList);
      shoppingList.appendChild(test.getLinkList());
      return;
    }
    // visa på aktuell inköpslista
    // när inköplskista välja

    var target = document.querySelector(".modal-container.pl");
    var config = { attributes: false, childList: true, subtree: false };

    var observer = new MutationObserver(function(mutationsList, observer) {
      for(var mutation of mutationsList) {
        if (mutation.type == 'childList') {
            console.log(mutation);
            mutation.target.querySelectorAll(".shoppinglists__item").forEach(function(item) {
              console.log(item);
              item.addEventListener("click", function(e) {
                console.log(e.target);
                test.save();
              });
            });
        }
      }
    });

    observer.observe(target, config);

    //observer.disconnect();

    // klick på lägg till i inköpslista, spara länk till recpet i cookie
    /*var btn = document.querySelector(".button.js-open-shoppinglist-modal");
    if (btn == null) {
      return;
    }
    btn.addEventListener("click", function(e) {
      //alert("test");
      //test.save();

      setTimeout(function() {
        document.querySelector(".shoppinglists__item").addEventListener("click", function(e) {
          console.log(e.target.parentNode.value);
          console.log(e);
        });
      }, 3000);

//document.querySelectorAll(".modal-container.pl")

}); */


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
  cookieName: "recipes-in-shopping-list",
  create_cookie(value) {
    var cookie = [test.cookieName, '=', JSON.stringify(value), '; domain=.', window.location.host.toString(), '; path=/;'].join('');
    document.cookie = cookie;
  },
  read_cookie() {
    var result = document.cookie.match(new RegExp(test.cookieName + '=([^;]+)'));
    result && (result = JSON.parse(result[1]));
    return result;
  },
  save() {
    var recipes = test.read_cookie();
    const title = document.querySelector("meta[name='title']").getAttribute("content");
    const id = document.querySelector("meta[name='Id']").getAttribute("content")
    var current = { id: id, name: title, url: window.location.href };
    if(recipes == null) {
      recipes = [];
    }

    if(!recipes.find(function(r) {
      return r.id == id;
    })) {
      recipes.push(current);
    }

    test.create_cookie(recipes);
  },
  getLinkList() {
    const recipes = test.read_cookie();
    if(!recipes) {
      return;
    }
    var links = document.createElement("ul");
    recipes.forEach(function(element) {
      links.insertAdjacentHTML("beforeend", "<li><a href='" + element.url + "'>" + element.name + "</a></li>");
      console.log(element);
    });
    return links;
  }
};

$(document).ready(() => {
  Object.assign(test, CROUTIL());
  test.manipulateDom();
});
