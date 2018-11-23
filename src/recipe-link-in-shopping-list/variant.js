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
    // när inköpslista välja

    var target = document.querySelector(".modal-container.pl");
    var config = { attributes: false, childList: true, subtree: false };

    if(target == null) {
      return;
    }

    var observer = new MutationObserver(function(mutationsList, observer) {
      for(var mutation of mutationsList) {
        if (mutation.type == 'childList') {
            mutation.target.querySelectorAll(".shoppinglists__item").forEach(function(item) {
              var listId = item.attributes["data-id"].value;
              item.addEventListener("click", function(e) {
                test.save(listId);
              });
            });

            //var newList = mutation.target.querySelector(".js-activate-add-new-shoppinglist");
            var newList = mutation.target.querySelector(".button.js-add-to-new-shoppinglist");
            if(newList != null) {
              newList.addEventListener("click", function(e) {
                setTimeout(test.save, 3000);
              });
            }

            //button js-add-to-new-shoppinglist

        }
      }
    });

    observer.observe(target, config);

    //observer.disconnect();

    // klick på lägg till i inköpslista, spara länk till recepet i cookie
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
  read_cookie(name) {
    var result = document.cookie.match(new RegExp(name + '=([^;]+)'));
    result && (result = JSON.parse(result[1]));
    return result;
  },
  save(listId) {
    if(listId == undefined) {
      listId = test.read_cookie("shoppingListLoggedInUserCookie");
    }
    var recipes = test.read_cookie(test.cookieName);
    const title = document.querySelector("meta[name='title']").getAttribute("content");
    const id = document.querySelector("meta[name='Id']").getAttribute("content")
    var current = { id: id, name: title, url: window.location.href, list: listId };
    if(recipes == null) {
      recipes = [];
    }

    if(!recipes.find(function(r) {
      return r.id == id && r.list == listId;
    })) {
      recipes.push(current);
    }

    test.create_cookie(recipes);
  },
  getLinkList() {
    const recipes = test.read_cookie(test.cookieName);
    if(!recipes) {
      return;
    }
    var links = document.createElement("span");
    links.insertAdjacentHTML("beforeend", "Recept: ");
    recipes.forEach(function(element) {
      links.insertAdjacentHTML("beforeend", "<a href='" + element.url + "'>" + element.name + "</a>");
    });
    return links;
  }
};

$(document).ready(() => {
  Object.assign(test, CROUTIL());
  test.manipulateDom();
});
