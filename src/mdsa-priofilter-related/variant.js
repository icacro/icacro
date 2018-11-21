// ==UserScript==
// @name         mdsa-priofilter
// @path         //./src/mdsa-priofilter/variant.js
// @namespace    http://tampermonkey.net/
// @version      0.1
// @match        https://www.ica.se/recept/*
// @grant        none
// ==/UserScript==

'use strict';

import { CROUTIL, ELM } from '../util/main';
import { gaPush } from '../util/utils';
import './style.css';
let related;

const test = {

  manipulateDom() {

    if (/^https:\/\/www.ica.se\/recept\/$/.test(window.location.href)) {
      document.getElementById('page').classList.add('recipe-start');
    }

    if (document.getElementById('PopularPages')) {
      related = document.getElementById('PopularPages');
    } else {
      related = document.getElementById('RelatedPages');
    }

    if (related) {

      const relatedFilters = document.createElement('div');
      document.getElementById('content').querySelector('#recipe-header').append(relatedFilters);

      relatedFilters.classList.add('related-filters','column-align-center','quicklink-list','pl');

      const relatedList = related.querySelectorAll('.accord-content .grid_fluid a');
      for (var i = 0; i < relatedList.length; i++) {
        const relatedUrl = relatedList[i].getAttribute('href');
        const relatedText = relatedList[i].querySelector('span').innerHTML;
        const relatedTag = document.createElement('a');
        relatedTag.innerHTML = relatedText;
        relatedTag.href = relatedUrl;
        relatedTag.classList.add('button','button--color-purple','button--purple-light');
        relatedFilters.append(relatedTag);
        relatedTag.addEventListener('click', trackClick);
      }

      function trackClick() {
        gaPush({ eventAction: 'MDSA, relaterad-länk variant', eventLabel: this.href });
      }

    }

  }

};

$(document).ready(() => {
  Object.assign(test, CROUTIL());
  test.manipulateDom();
});
