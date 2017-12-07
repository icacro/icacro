// ==UserScript==
// @name         Checkboxes-to-list
// @path         //./src/checkboxes-to-list/variant.js
// @namespace    http://tampermonkey.net/
// @version      0.1
// @match        https://www.ica.se/*
// @grant        none
// ==/UserScript==

'use strict';

import { ICACRO, $ELM } from '../util/main';

import './style.css';

// if (hj) hj('trigger','variant8');// eslint-disable-line

function init() {
  function isWindowModalOpen(callback) {
    const elm = document.querySelector('.pl-modal__window');
    if (elm) return callback($ELM.create(elm));
    return setTimeout(() => {
      isWindowModalOpen(callback);
    }, 100);
  }
  const test = {
    click(e) {
      e.preventDefault();
      const element = $ELM.create(e.currentTarget);
      const id = element.data('id');
      const secureid = element.data('secureid');
      const items = $ELM.get('.recipe-content').children('.ingredients__list__item');
      const checkedItems = items
        .filter(item => item.element.childNodes[0].checked)
        .map(item => item.text());
      console.log(id, secureid, checkedItems);
    },
    modal(element) {
      const lists = element.children('.shoppinglists__item');
      const ul = $ELM.get('.shoppinglists');
      lists.forEach((list) => {
        const div = $ELM.create('.shoppinglists__item');
        const btn = list.copy('.button--icon');
        const content = list.copy('.shoppinglists__content');
        const id = list.data('id');
        const secureid = list.data('secureid');
        list.remove();
        div.data('id', id);
        div.data('secureid', secureid);
        div.appendAll(btn, content);
        div.click(this.click);
        ul.append(div);
      });
      const btnGroup = $ELM.get('.button-group');
      const newBtnAdd = btnGroup.copy('.js-add-to-new-shoppinglist');
      $ELM.get('.js-add-to-new-shoppinglist').remove();
      btnGroup.appendFirst(newBtnAdd);
    },
    appendCheckboxes() {
      const items = $ELM.get('.recipe-content').children('.ingredients__list__item');
      items.forEach((item) => {
        const ckeckbox = $ELM.create('input', {
          type: 'checkbox',

          checked: true,
        });
        item.appendFirst(ckeckbox);
      });
    },
    async manipulateDom() {
      this.appendCheckboxes();
      $ELM.get('.js-open-shoppinglist-modal').click(() => {
        isWindowModalOpen((element) => {
          this.modal(element);
        });
      });
    },
  };
  Object.assign(test, ICACRO());
  test.manipulateDom();
}

init();
