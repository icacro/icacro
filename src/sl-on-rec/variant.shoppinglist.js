// ==UserScript==
// @name         Sl-on-rec
// @path         //./src/sl-on-rec/variant.js
// @namespace    http://tampermonkey.net/
// @version      0.1
// @match        https://www.ica.se/*
// @grant        none
// ==/UserScript==

import { CROUTIL, ELM } from '../util/main';
import { waitForContent, removeElements, isLoggedIn } from '../util/utils';
import './style.css';

(function ($) {
  'use strict';

  hj('trigger','variant8');// eslint-disable-line

  function init() {
    const test = {
      activateSave(element, isActive) {
        if (isActive) {
          element.find(`.circle-icon`).removeClass('heart--active');
          element.find(`.recipe-item__text`).removeClass('recipe-item__text--active');
        } else {
          element.find(`.circle-icon`).css('heart--active');
          element.find(`.recipe-item__text`).css('recipe-item__text--active');
        }
      },
      onAddShoppingList(e) {
        e.preventDefault();
        const date = new Date();
        const today = `Att handla, ${date.getDate()} ${date.toLocaleString('sv-SV', { month: 'short' })} ${date.getFullYear()}`;
        const current = ELM.get(e.currentTarget);
        const recipeId = current.data('recipeid');
        const isActive = current.find('.heart--active').exist();
        ICA.ajax.post('/Templates/Recipes/Handlers/ShoppingListHandler.ashx', {
          ShoppingListId: 0,
          recipeIds: [recipeId],
          numberOfServings: 4,
          shoppingListName: today,
        }).then(() => {
          this.activateSave(current, isActive);
        });
      },
      onClick(e) {
        e.preventDefault();
        const current = ELM.get(e.currentTarget);
        const recipeId = current.data('recipeid');
        const isActive = current.find('.heart--active').exist();
        const method = isActive ? 'Remove' : 'Add';
        const { name, URL } = JSON.parse(current.parent().find('.recipe-item').data('tracking'));
        dataLayer.push({
          event: 'recipe-save',
          name,
          URL,
        });
        if (isLoggedIn()) {
          ICA.ajax.get('/Templates/Recipes/Handlers/FavoriteRecipesHandler.ashx', {
            recipeId,
            method,
          });
          this.activateSave(current, isActive);
        } else {
          window.location.href = 'https://www.ica.se/logga-in/?returnurl=https%3a%2f%2fwww.ica.se%2frecept%2f';
        }
      },
      appendListSave(recipeid, isSaved) {
        const container = ELM.create('.pl .recipe-item');
        const classname = isSaved ? '.heart .heart--active' : '.heart';
        const iconContainer = ELM.create(`.circle-icon ${classname}`);
        const svg = ELM.svg('heart', 'symbols.svg');
        const classnametxt = isSaved ? '.recipe-item__text--active' : '';
        const txt = ELM.create(`.recipe-item__text ${classnametxt}`);
        const str = isSaved ? 'Sparat' : 'Spara';
        container.data('recipeid', recipeid);
        container.click(this.onClick.bind(this));

        txt.data({
          tracking: 'tracking',
          recipeid: 'recipeid',
          loginurl: 'loginurl',
          islocal: 'islocal',
        });
        txt.text(str);
        iconContainer.append(svg);
        container.appendAll(txt, iconContainer);
        return container;
      },
      appendListButton(recipeid, href, title) {
        const container = ELM.create('.pl .recipe-item');
        const iconContainer = ELM.create('.circle-icon');
        const svg = ELM.svg('purchase-list');
        const txt = ELM.create('.recipe-item__text');
        container.data('recipeid', recipeid);
        container.data('tracking', `{ "name": "${title}", "URL": "${href}" }`);
        container.css('js-add-to-new-shoppinglist', `banner-button-${parseInt(recipeid, 10)}`);
        container.click(this.onAddShoppingList.bind(this));
        txt.text('Lägg till i inköpslistan');
        iconContainer.append(svg);
        container.appendAll(txt, iconContainer);
        return container;
      },
      async manipulateDom() {
        const container = ELM.get('#recipes');
        const recipes = await waitForContent(container, '.recipe');
        recipes.forEach((recipe) => {
          const wrapper = ELM.create('.recipe-wrapper');
          const a = recipe.find('.title a');
          const href = a.attr('href');
          const title = a.text();
          const footer = recipe.find('footer');
          const recipeid = recipe.find('.js-track-recipe-save').data('recipeid');
          const isSaved = recipe.find('.icon-heart-filled').exist();
          wrapper.append(this.appendListButton(recipeid, href, title));
          wrapper.append(this.appendListSave(recipeid, isSaved));
          footer.insertAfter(wrapper);
        });
        removeElements('.save-recipe-button');
      },
    };
    Object.assign(test, CROUTIL());
    test.manipulateDom();
  }

  $(document).ready(init);

  })(jQuery);
