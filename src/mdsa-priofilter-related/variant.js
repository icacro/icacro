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

      gaPush({ eventAction: 'MDSA-relaterad, sida med relateratlänkar', eventLabel: document.location.href });

      document.querySelector('body').classList.add('cro-related');

      if (!document.querySelector('.banner-area')) {
        const bannerArea = document.createElement('div');
        const bannerAreaInner = document.createElement('div');
        bannerArea.classList.add('grid_fluid','banner-area');
        bannerAreaInner.classList.add('column','size20of20','white-bg');
        bannerArea.prepend(bannerAreaInner);
        document.querySelector('.main-content').prepend(bannerArea);
      }

      const toggleArrow = document.querySelector('a.toggle-arrow');

      if (toggleArrow) {
        let toggleCount = '';
        toggleArrow.setAttribute('data-activetext','Dölj filter');
        toggleArrow.addEventListener('click', function() {
          setTimeout(function () {
            let eventAction;
            if (toggleArrow.classList.contains('open')) {
              eventAction = 'MDSA-relaterad, öppna filter';
            } else {
              eventAction = 'MDSA-relaterad, stäng filter';
            }
            gaPush({ eventAction: eventAction, eventLabel: document.location.href });
          }, 50);
        });

        const activeFilterEl = document.querySelector('.mob-filter-container .active-filter-display');
        if (activeFilterEl) {

          function printNumber() {
            if (activeFilterEl.getAttribute('data-activefilters')) {
              toggleArrow.append(' (' + activeFilterEl.getAttribute('data-activefilters') + ')');
            }
          }

          printNumber();

          let activeFilterObserver = new MutationObserver(function(mutations) {
            for (var i = 0; i < mutations.length; i++) {
              printNumber();
            }
          });

          activeFilterObserver.observe(recipes, {
            attributes: true,
            characterData: false,
            childList: false,
            subtree: false
          });
        }

      }

      const relatedFilters = document.createElement('div');
      document.getElementById('content').querySelector('#recipe-header').append(relatedFilters);

      relatedFilters.classList.add('related-filters','column-align-center','quicklink-list','pl');
      const relatedHeader = document.createElement('div');
      relatedHeader.classList.add('related-header');
      relatedHeader.innerHTML = 'SE ÄVEN';
      relatedFilters.append(relatedHeader);

      const relatedList = related.querySelectorAll('.accord-content .grid_fluid a');
      for (var i = 0; i < relatedList.length; i++) {
        const relatedUrl = relatedList[i].getAttribute('href');
        const relatedText = relatedList[i].querySelector('span').innerHTML;
        const relatedTag = document.createElement('a');
        relatedTag.innerHTML = relatedText;
        relatedTag.href = relatedUrl;
        relatedTag.classList.add('button','button--color-purple','button--purple-light');
        relatedFilters.append(relatedTag);
        relatedTag.addEventListener('click', function() {
          gaPush({ eventAction: 'MDSA-relaterad, klick på länk', eventLabel: this.href });
        });
      }

    }

  }

};

$(document).ready(() => {
  Object.assign(test, CROUTIL());
  test.manipulateDom();
});
