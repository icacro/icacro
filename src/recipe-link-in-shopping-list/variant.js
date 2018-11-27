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

    var shoppingList = document.querySelector("#shoppinglist-app");
    if(shoppingList != null) {
      test.displayLinks(shoppingList);
      return;
    }

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

            var newList = mutation.target.querySelector(".button.js-add-to-new-shoppinglist");
            if(newList != null) {
              newList.addEventListener("click", function(e) {
                setTimeout(test.save, 3000);
              });
            }
        }
      }
    });

    observer.observe(target, config);
  },
  displayLinks(shoppingList) {

    var currentList = shoppingList.querySelector(".ingredient-search");
    if(currentList != null) {
      currentList.insertAdjacentElement("beforeend", test.getLinkList());
    }

    var observer = new MutationObserver(function(mutationsList, observer) {
      for(var mutation of mutationsList) {
        if (mutation.type == 'childList' && mutation.addedNodes.length > 0) {
          var list = mutation.target.querySelector(".ingredient-search");
          if(list != null) {
            var node = test.getLinkList();
            if(node) {
              shoppingList.querySelector(".ingredient-search").insertAdjacentElement("beforeend", node);
            }
          }
        }
      }
    });

    observer.observe(shoppingList, { attributes: true, childList: true, subtree: true });
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
    var listId = window.location.hash.match(/\d+/g);
    if(listId == null) {
      return;
    }
    var links = document.createElement("div");
    links.classList.add("shopping-list-recipes");
    links.insertAdjacentHTML("beforeend", "Recept: ");
    recipes.forEach(function(element) {
      if(element.list == listId[0]) {
        links.insertAdjacentHTML("beforeend", "<a class='recipe-link' href='" + element.url + "'>" + element.name + "</a>");
      }
    });
    return links;
  }
};

$(document).ready(() => {
  Object.assign(test, CROUTIL());
  test.manipulateDom();
});
