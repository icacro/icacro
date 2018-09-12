// ==UserScript==
// @name         recipe-toggle-ingredients
// @path         //./src/shopping-list-link/variant.js
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

    let modalObserver = new MutationObserver(function(mutations) {
      for (var i = 0; i < mutations.length; i++) {
        if (mutations[i].target.classList.contains('pl-modal__window')) {
          if(mutations[i].target.querySelector('h4').innerHTML === 'Recept lades till i din inköpslista') {

            const modal = ELM.create('div pl-modal modal-copy').attr('id','cro-overlay');
            const modalInner = ELM.create('div pl-modal__window');
            const closeBtn = ELM.create('a button--icon pl-modal__close-button button--link').css('button').html('<svg xmlns="http://www.w3.org/2000/svg" viewBox="3.092778444290161 4.548774719238281 17.0854434967041 17.08416748046875"><path d="M15.224 13.091l4.582 4.606q.315.291.364.691t-.194.667q-1.042 1.333-2.376 2.376-.267.242-.667.194t-.715-.339l-4.582-4.606-4.606 4.606q-.291.291-.691.339t-.691-.194q-1.309-1.042-2.352-2.352-.242-.291-.194-.691t.339-.691l4.606-4.606-4.582-4.582q-.315-.315-.364-.715t.194-.667q1.018-1.309 2.352-2.376.291-.242.691-.194t.691.364l4.606 4.388 4.582-4.388q.315-.315.715-.364t.667.194q1.333 1.042 2.376 2.376.242.267.194.667t-.364.715z"></path></svg>');
            const toListBtn = ELM.create('a shopping-list-link').css('button').attr('href','/inkopslista/').html('Till inköpslistan');
            const header = ELM.create('h4').html('Recept lades till i din inköpslista</h4>');
            modalInner.append(closeBtn).append(header).append(toListBtn);
            modal.append(modalInner);
            ELM.get('.modal-container.pl .pl-modal').remove();
            ELM.get('.modal-container.pl').append(modal);

            toListBtn.click((e) => {
              gaPush({ eventAction: 'Till inköpslista fr tillagt recept' });
            });

            closeBtn.click((e) => {
              modal.remove();
            });

            modal.click((e) => {
              if (e.target.id === 'cro-overlay') {
                modal.remove();
              }
            });

            break;
          }
        }
      }
    });

    modalObserver.observe(document.querySelector('.modal-container.pl'), {
      attributes: true,
      characterData: false,
      childList: true,
      subtree: true
    });

  }

};

$(document).ready(() => {
  Object.assign(test, CROUTIL());
  test.manipulateDom();
});
