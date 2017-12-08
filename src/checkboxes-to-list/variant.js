// ==UserScript==
// @name         Checkboxes-to-list
// @path         //./src/checkboxes-to-list/variant.js
// @namespace    http://tampermonkey.net/
// @version      0.1
// @match        https://www.ica.se/*
// @grant        none
// ==/UserScript==

'use strict';

import { CROUTIL, ELM } from '../util/main';
import { ajax } from '../util/utils';

import './style.css';

// if (hj) hj('trigger','variant8');// eslint-disable-line

function init() {
  function isWindowModalOpen(callback) {
    const elm = document.querySelector('.pl-modal__window');
    if (elm) return callback(ELM.create(elm));
    return setTimeout(() => {
      isWindowModalOpen(callback);
    }, 100);
  }
  const test = {
    checkbox() {
      const [container, step, circle, label] = ELM.create(['cooking-step cooking-step-list', '.cooking-step__check', 'label .checkbox .checkbox--circle', 'span .checkbox__label']);
      const cb = ELM.create('input .checkbox__input', {
        type: 'checkbox',
        checked: true,
      });
      circle.appendAll(cb, label);
      step.append(circle);
      container.append(step);
      return container;
    },
    sendList(checkedItems) {
      return Promise.all(checkedItems.map((formData) => {
        return this.ajax('https://www.ica.se/Templates/ShoppingListTemplate/Handlers/ShoppingListHandler.ashx', {
          method: 'POST',
          body: formData,
        });
      }));
    },
    click(e) {
      const element = ELM.create(e);
      const id = element.data('id');
      const secureid = element.data('secureid');
      const items = ELM.get('.recipe-content').children('.ingredients__list__item');
      const listElement = ELM.get('.add-shoppinglist__input');
      const listName = listElement.element && (listElement.value() || listElement.placeholder());
      const checkedItems = items
        .filter(item => item.find('.checkbox__input').element.checked)
        .map((item) => {
          const formData = new FormData();
          formData.append('CommandName', 'AddRow');
          formData.append('productName', item.text());
          formData.append('shoppingListId', id);
          formData.append('shoppingListSecureId', secureid);
          formData.append('shoppingListName', listName);
          return formData;
        });

      this.sendList(checkedItems);
      this.closeListModal();
    },
    closeListModal() {
      ELM.get('.modal-container').html(' ');
    },
    modal(element) {
      const lists = element.children('.shoppinglists__item');
      const ul = ELM.get('.shoppinglists');
      lists.forEach((list) => {
        const div = ELM.create('.shoppinglists__item');
        const btn = list.copy('.button--icon');
        const content = list.copy('.shoppinglists__content');
        const id = list.data('id');
        const secureid = list.data('secureid');
        list.remove();
        div.data('id', id);
        div.data('secureid', secureid);
        div.appendAll(btn, content);
        div.click(this.click.bind(this, div.element));
        ul.append(div);
      });
      const btnGroup = ELM.get('.button-group');
      const newBtnAdd = btnGroup.copy('.js-add-to-new-shoppinglist');
      if (newBtnAdd) {
        ELM.get('.js-add-to-new-shoppinglist').remove();
        btnGroup.click(this.click.bind(this, newBtnAdd.element))
        btnGroup.appendFirst(newBtnAdd);
      }
    },
    appendCheckboxes() {
      const items = ELM.get('.recipe-content').children('.ingredients__list__item');
      items.forEach((item) => {
        item.appendFirst(this.checkbox());
      });
    },
    async manipulateDom() {
      this.appendCheckboxes();
      ELM.get('.js-open-shoppinglist-modal').click(() => {
        isWindowModalOpen((element) => {
          this.modal(element);
        });
      });
    },
  };
  Object.assign(test, CROUTIL({
    ajax,
  }));
  test.manipulateDom();
}

init();
