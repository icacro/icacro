// ==UserScript==
// @name         recipe-toggle-ingredients
// @path         //./src/mdsa-cleanup/variant.js
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

    if (ELM.get('.mdsa-main-grid .right-content').exist()) {
      ELM.get('.mdsa-main-grid .right-content').remove();
      ELM.get('.mdsa-main-grid > div').removeClass('xl_size15of20').css('xl_size20of20');
    }

    if (ELM.get('div.grid_fluid .filter-search').exist()) {
      const searchContainer = ELM.create('div search-container');
      searchContainer.append(ELM.get('.filter-search'));
      ELM.get('header.page-header').append(searchContainer);
    }

    const filterSegments = document.querySelectorAll('fieldset.filtersegment');

    test.checkForChanges(filterSegments);

    let filterObserver = new MutationObserver(function(mutations) {
      for (var i = 0; i < mutations.length; i++) {
        test.checkForChanges(filterSegments);
        break;
      }
    });

    filterObserver.observe(document.getElementById('recipes'), {
      attributes: false,
      characterData: false,
      childList: true,
      subtree: false
    });

    for (var i = 0; i < filterSegments.length; i++) {
      filterSegments[i].querySelector('legend').onclick = function(){
        if(this.parentNode.classList.contains('open')) {
          this.parentNode.classList.remove('open');
          this.parentNode.classList.remove('contracted');
        } else if (!this.parentNode.classList.contains('selected')) {
          this.parentNode.classList.add('open');
          this.parentNode.classList.add('contracted');
        }
      }
    }

    let testURL = window.location.href;
    if (testURL.indexOf('#:') > 0) {
      testURL = testURL.slice(0,testURL.indexOf('#:'));
    }

    if ((/^https:\/\/www.ica.se\/recept\/vardag\/$/.test(testURL))
      || (/^https:\/\/www.ica.se\/recept\/middag\/$/.test(testURL))
      || (/^https:\/\/www.ica.se\/recept\/kyckling\/gryta\/$/.test(testURL))
      || (/^https:\/\/www.ica.se\/recept\/vegetarisk\/$/.test(testURL))
      || (/^https:\/\/www.ica.se\/recept\/vegan\/$/.test(testURL))
      || (/^https:\/\/www.ica.se\/recept\/cheesecake\/$/.test(testURL))
      || (/^https:\/\/www.ica.se\/recept\/fisk\/soppa\/$/.test(testURL))
      || (/^https:\/\/www.ica.se\/recept\/soppa\/$/.test(testURL))
      || (/^https:\/\/www.ica.se\/recept\/smoothie\/$/.test(testURL))
      || (/^https:\/\/www.ica.se\/recept\/karljohan\/$/.test(testURL))
      || (/^https:\/\/www.ica.se\/recept\/vasterbottensost\/paj\/$/.test(testURL))
      || (/^https:\/\/www.ica.se\/recept\/kraftskiva\/$/.test(testURL))
      || (/^https:\/\/www.ica.se\/recept\/potatis\/sallad\/$/.test(testURL))
      || (/^https:\/\/www.ica.se\/recept\/zucchini\/$/.test(testURL))) {

        gaPush({ eventAction: 'Recept, 3 utvalda', eventLabel: 'Laddat ' + testURL.slice(testURL.indexOf('recept'),testURL.length) });

        const recipeHeader = ELM.get('#recipe-header');

          if (recipeHeader.exist()) {
            const toprecipesList = ELM.create('div toprecipes-list column size20of20 white-bg mdsa');
            const articleInner = '<div class="image-column"><figure class="sprite2-p" style=""><a href="" class="lazyloaded" data-noscript=""><img src="" alt="" class="lazyNoscriptActive"></a></figure></div><div class="info-column"><header><h2 class="title"><a href=""></a></h2></header><div class="content sm_hidden"><a class="block"><p></p></a></div><div id="" class="yellow-stars" itemprop="aggregateRating" itemscope="" itemtype="http://schema.org/AggregateRating"><section class="rate-recipe"><div class="content"><dl class="inline rate" data-avg-rating=""><dt>Betyg:</dt><dd class="rating" style="z-index: 0"><meter class="hidden" value="" min="1" max="5"></meter><div class="grade grade-5" title="5 av 5" data-rating="5"><span class="sprite2 icon icon-star"></span></div><div class="grade grade-4" title="4 av 5" data-rating="4"><span class="sprite2 icon icon-star"></span></div><div class="grade grade-3" title="3 av 5" data-rating="3"><span class="sprite2 icon icon-star"></span></div><div class="grade grade-2" title="2 av 5" data-rating="2"><span class="sprite2 icon icon-star"></span></div><div class="grade grade-1" title="1 av 5" data-rating="1"><span class="sprite2 icon icon-star"></span></div><input type="hidden" id="hdnRecipeId" value=""></dd><dd class="small votes"><span itemprop="reviewCount"></span> röst<span class="plural-postfix">er</span></dd></dl></div></section></div><footer><ul class="recipe-info"><li class="md_lte_hidden"><span title="" class="ingredients"></span></li></ul></footer><div class="save-recipe-button"><a href="#" data-name="" data-link="" data-recipeid="" class="sprite2-p icon-heart save-recipe js-track-recipe-save " title="Spara">Spara</a></div></div></article>';
            let recipe1,recipe2,recipe3;

            const headerSVG = '<?xml version="1.0" encoding="utf-8"?><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 173 20" style="enable-background:new 0 0 173 20;" xml:space="preserve"><style type="text/css">.st0{fill:#3F3F40;}</style><g><path class="st0" d="M8.5,13.6C8,14.7,7.3,15,6.6,15c-0.7,0-1.5-0.3-1.6-1.2L4.1,6.2c0,0-1.4,6.6-1.8,8c-0.2,0.8-0.6,1.8-1.5,1.6c-0.8-0.2-0.6-1.3-0.4-2.2l2-8.6c0.7-3.1,1.9-3,2.9-2.8c1,0.3,1.4,1.2,1.6,1.5C7.2,4.2,7.2,4.6,7.3,5c0.1,0.7,0.5,5.7,0.5,6.2c0.8-2.1,2.7-7,3.3-7.9c0.1-0.2,0.3-0.4,0.4-0.5c0.3-0.3,0.7-0.5,1.6-0.5c1.6,0.2,1.7,1.1,1.7,2c0,0.9-0.4,10-0.6,10.7c-0.2,0.8-1,1-1.6,0.9s-0.9-0.1-1.2-0.5c-0.3-0.4-0.3-0.8-0.3-1.2c0-1,0.6-9,0.6-9S8.9,12.5,8.5,13.6z"/><path class="st0" d="M23.3,8.1c0.6,0.7,1,2-0.2,2c-0.8,0-0.6-1.4-2.1-1.3c-1.1,0-1.9,1.3-2.3,2.8c-0.4,1.5-0.1,2.6,0.8,2.7c1,0.2,2-1.4,2.5-2.6c0.2-0.6,0.6-1.1,1.5-1.1c0.6,0,1.3,0.4,1.2,1.2c-0.1,1.1-0.2,2.9-0.3,3.4c-0.1,0.5-0.5,1-1,1c-1.1,0-1.4-1.1-1.3-2.1c-0.4,1.1-1.5,2-3,2c-2.4,0-3.5-2-3-4.6c0.5-2.6,2.2-4.4,4.5-4.4C21.3,7.1,22.6,7.3,23.3,8.1z M21.7,2.6c0.5,0,0.7,0.3,0.7,0.6s-0.2,0.6-0.6,0.6c-0.7,0.1-0.9,0.4-0.9,0.7c0,0.3,0.2,0.6,0.6,0.8c0.2,0.1,0.4,0.1,0.5,0.1c0.6,0,0.9-0.5,0.7-1c-0.2-0.4,0.1-0.7,0.4-0.7c0.4,0,0.5,0.4,0.6,0.7c0.1,0.4,0.1,0.8-0.2,1.2c-0.3,0.5-1,1-2,1c-0.5,0-1-0.2-1.4-0.5s-0.7-0.7-0.7-1.3c-0.1-0.6,0.2-1.1,0.6-1.5c0.4-0.4,1-0.6,1.7-0.7H21.7z"/><path class="st0" d="M26.6,7.5c0.3-0.3,1-0.4,1.5-0.3c0.5,0.1,0.9,0.3,1,0.6c0.2,0.4,0.1,1.1,0.1,1.5c0.3-0.6,1.1-1.2,1.5-1.5c0.9-0.6,2.1-0.7,2.9-0.3c1.1,0.6,1.3,1.3,1.1,3.2c-0.2,2.3-0.5,3.6-0.5,4.8c0,0.8-2.7,1.2-2.8-0.8c0-0.8,0.2-1.9,0.3-2.8c0.3-1.3,0.4-3,0-3.2c-0.4-0.2-1,0.3-1.7,1.2c-0.4,0.5-0.8,1.3-1.1,1.9c-0.2,0.5-0.3,0.6-0.4,1.3c-0.1,0.5-0.1,0.9-0.3,1.9c-0.1,0.4-0.1,0.6-0.4,0.8c-0.8,0.5-2.3,0.3-2.3-1.3c0.1-2.6,0.4-3.9,0.5-5.4C26.4,8,26.1,8,26.6,7.5z"/><path class="st0" d="M41.9,9.2c-0.2,0-0.4-0.1-0.6-0.2c-0.2-0.1-0.4-0.2-0.6-0.2c-0.7,0-1.4,0.5-1.9,1.4c-0.4,0.8-0.6,1.8-0.6,2.6c0,0.8,0.3,1.4,0.9,1.4c0.9,0,1.7-0.9,2.1-1.6c0.4-0.8,0.7-1.6,0.7-2.1c0-0.6,0.6-0.9,1.2-0.9c0.4,0,0.9,0.1,1.2,0.5c0.2,0.3,0.3,0.8,0.3,1.5c-0.1,1.3-0.4,3.3-0.7,4.6c-0.3,1.3-0.8,2.3-1.7,3.1c-1.1,0.9-2.8,0.8-3.7,0.1c-0.3-0.3-0.6-0.6-0.7-0.9c-0.2-0.5,0-0.9,0.5-0.9c0.2,0,0.4,0.1,0.5,0.2c0.2,0.3,0.6,0.6,1,0.6c1.2,0,1.6-1.2,1.8-2.5c0.1-0.6,0.1-1.3,0.2-2c-0.6,1.2-1.6,2-3,2c-0.7,0-1.3-0.2-1.9-0.8s-1-1.5-0.9-2.9c0.1-1.4,0.5-2.7,1.3-3.6C37.9,7.7,39,7,40.5,7c1.1,0,2.1,0.5,2.3,1.4C42.8,8.7,42.5,9.2,41.9,9.2z"/><path class="st0" d="M52.1,9.1c-1.1-1.7-2.8,0.5-3.5,2.3c-0.7,1.8-0.3,2.8,0.1,3c0.5,0.2,1.1,0.2,2.3-2.2c1.2-2.5,3.2-1.3,3.2-0.5c-0.1,1.2-0.1,1.5-0.2,2.8C54,15.9,53.5,16,53.1,16c-1.2-0.1-1.4-0.4-1.4-2.4c-1.7,3.7-5.2,2.9-6,0.8s0-4.5,1.7-6.1c2-2,5.3-1.6,6.1,0.5C53.9,9.9,52.9,10.2,52.1,9.1z"/><path class="st0" d="M65.6,8c0.3,0.6,0,1.4-0.7,1.4c-0.6,0-0.6-0.6-1.2-0.6c-0.7,0-1.7,1.6-2,2.8c-0.4,1.5-0.1,2.8,0.7,2.9c0.6,0.1,1.3-0.8,1.9-2.2c0.3-0.7,0.5-1,0.6-1.3c0.2-0.6,0.6-1.1,1.2-1.1c0.6,0,1.2,0.6,1.2,1.4c-0.1,1.1-0.2,3.5-0.3,4c-0.1,0.5-0.3,0.7-0.8,0.7c-1.1,0-1.5-0.7-1.5-1.8c-0.4,0.8-0.9,1.7-2.2,1.9c-2.1,0.3-3.9-1.4-3.6-4.1c0.3-2.6,2.1-4.8,4.8-4.8C64.4,7.1,65.2,7.3,65.6,8z"/><path class="st0" d="M69.4,7.5c0.3-0.3,1-0.4,1.5-0.3c0.5,0.1,0.9,0.3,1,0.6C72.1,8.2,72,8.9,72,9.3c0.3-0.6,1.1-1.2,1.5-1.5c0.9-0.6,2.1-0.7,2.9-0.3c1.1,0.6,1.3,1.3,1.1,3.2c-0.2,2.3-0.5,3.6-0.5,4.8c0,0.8-2.7,1.2-2.8-0.8c0-0.8,0.2-1.9,0.3-2.8c0.3-1.3,0.4-3,0-3.2c-0.4-0.2-1,0.3-1.7,1.2c-0.4,0.5-0.8,1.3-1.1,1.9c-0.2,0.5-0.3,0.6-0.4,1.3c-0.1,0.5-0.1,0.9-0.3,1.9c-0.1,0.4-0.1,0.6-0.4,0.8c-0.8,0.5-2.3,0.3-2.3-1.3c0.1-2.6,0.4-3.9,0.5-5.4C69.1,8,68.8,8,69.4,7.5z"/><path class="st0" d="M83.3,9.3c-1,0.6-2.1,1.9-1.9,3.7c0.2,1.3,1.2,1.9,2.2,1c1.3-1.2,1.5-3.3,1.9-5.3C85.7,7.4,85.8,5.9,86,5c0.1-0.7,0.1-1.2,0.1-1.6c0-0.4,0-0.7,0-0.9c0-0.4,0.1-0.5,0.5-0.7c0.2-0.1,0.4-0.1,0.6-0.1c0.4,0,0.9,0.1,1.2,0.6s0.5,1.3,0.3,2.6c-0.3,3.2-0.6,6-0.8,8.8c0,0.5,0,1-0.1,1.6c0,0.5-0.5,0.7-1,0.7c-1,0-1.5-0.7-1.7-2c-0.8,1.4-2.2,2.4-3.7,2.2c-1.9-0.3-2.8-1.9-2.9-3.7c0-2.3,1.4-4.1,3.2-4.8c1.2-0.5,2.6-0.3,2.9,0.5C85,9,84.1,8.9,83.3,9.3z"/><path class="st0" d="M92,15.3c-0.1,0.6-0.5,0.8-1.5,0.7c-0.9-0.1-1.2-0.9-1.1-2c0.1-0.7,0.2-1.7,0.4-2.6c0.2-1,0.3-1.7,0.4-2.7C90.3,8,90,7.5,90.5,7.3c0.8-0.4,2.2-0.1,2.4,0.9c0.3-0.3,0.5-0.6,0.9-0.8c0.4-0.2,0.9-0.3,1.4-0.3c0.6,0,0.8,0.1,1.2,0.3c0.3,0.2,0.3,0.7,0.2,1c-0.2,0.6-0.5,0.6-1.1,0.6c-0.6,0-1.2,0.3-1.9,1.1c-0.5,0.5-0.7,1.1-0.9,1.6c-0.3,0.8-0.4,1.4-0.6,3C92.1,14.8,92.1,15.1,92,15.3z"/><path class="st0" d="M102.7,9.1c-1.1-1.7-2.8,0.5-3.5,2.3c-0.7,1.8-0.3,2.8,0.1,3c0.5,0.2,1.1,0.2,2.3-2.2c1.2-2.5,3.2-1.3,3.2-0.5c-0.1,1.2-0.1,1.5-0.2,2.8c-0.1,1.4-0.5,1.5-0.9,1.4c-1.2-0.1-1.3-0.4-1.4-2.4c-1.7,3.7-5.2,2.9-6,0.8s0-4.5,1.7-6.1c2-2,5.3-1.6,6.1,0.5C104.4,9.9,103.4,10.2,102.7,9.1z"/><path class="st0" d="M114,10c-0.1,0.5-0.2,1.1-0.3,1.5c-0.1,1.1-0.1,2,0.1,2.4c0.2,0.3,0.3,0.4,0.6,0.4c0.1,0,0.2-0.1,0.3-0.2c0.2-0.2,0.5-0.3,0.7-0.3c0.5,0,0.7,0.5,0.3,1c-0.2,0.3-0.4,0.6-0.7,0.8c-0.4,0.3-0.8,0.4-1.4,0.4c-0.2,0-0.4,0-0.6-0.1c-1.2-0.2-1.7-1.2-1.9-2.3c-0.1-0.6-0.1-1.2-0.1-1.7c0-0.6,0.1-1.2,0.2-1.7c0.1-0.5,0.3-1.5,0.5-2.2c-0.3,0.1-0.5,0-0.8,0c-0.5,0-0.8-0.3-0.8-0.6c0-0.3,0.3-0.6,1-0.7c0.1,0,0.7,0,1,0c0.3-1.5,0.5-3,0.6-3.5c0.1-1.2-0.1-1.5,0.7-1.5c0.5,0,1.1,0.2,1.4,0.7c0.3,0.5,0.5,1.2,0.3,2.2c-0.1,0.3-0.1,0.6-0.1,0.8c-0.1,0.3-0.1,0.7-0.2,1.2c0.4,0,0.7,0,1.2,0c0.5,0,0.7,0.6,0.4,1c-0.3,0.3-1,0.4-1.9,0.4C114.2,8.6,114.1,9.3,114,10z"/><path class="st0" d="M118.4,7.3c0.3,0,0.7,0.2,0.9,0.4c0.3,0.3,0.5,0.5,0.5,0.8c0,0.3,0,0.6-0.1,1.1c0,0.3-0.1,0.6-0.1,1.2l-0.5,3.5c-0.1,1.1-0.1,1.5-0.5,1.8c-0.2,0.2-0.7,0.2-0.9,0.1c-0.5-0.1-0.8-0.3-0.8-1.3c-0.1-1.1,0-2.3,0.1-3.3c0.1-1.1,0.2-2,0.3-2.6C117.4,7.7,117.9,7.3,118.4,7.3z M119.1,3.3c1.2,0,1.4,0.8,1.3,1.6c-0.1,0.6-0.8,1-1.6,0.9c-0.9-0.1-1.1-0.7-1-1.5C117.9,3.9,118.3,3.2,119.1,3.3z"/><path class="st0" d="M131.2,7.7l-0.5,0.1c-0.2,1.2-0.5,2.6-0.6,3.7c-0.1,1.1-0.1,2,0.1,2.4c0.2,0.3,0.3,0.4,0.5,0.4c0.3,0,0.5-0.3,0.7-0.6c0.2-0.3,0.5-0.5,0.7-0.5c0.4,0,0.7,0.4,0.4,1c-0.2,0.4-0.4,0.8-0.8,1.2c-0.4,0.4-1,0.6-1.7,0.6c-0.2,0-0.4,0-0.6-0.1c-1.2-0.2-1.7-1.2-1.9-2.3c-0.2-1.2-0.1-2.5,0.1-3.5c0-0.1,0.1-0.4,0.2-0.8c0.1-0.5,0.2-1,0.3-1.5c-0.5,0-0.9,0-1.4,0c-0.5,0-0.9,0-1.3,0h-0.1l-0.1,0.4c0,0.1-0.1,0.2-0.1,0.3c-0.2,1.2-0.4,2.3-0.5,3.3c-0.1,1-0.1,1.7,0.1,2.1c0.1,0.2,0.2,0.3,0.4,0.3s0.3-0.1,0.4-0.3c0.2-0.3,0.4-0.5,0.6-0.5s0.4,0.1,0.4,0.4c0.1,0.6-0.4,1.3-1,1.6c-0.3,0.2-0.7,0.3-1.1,0.3h-0.2c-0.1,0-0.1,0-0.2,0c-1.2-0.2-1.7-1.1-1.9-2.2c-0.2-1.1-0.1-2.4,0.1-3.3c0.1-0.5,0.3-1.4,0.5-2.1c-0.3,0-0.5,0.1-0.6,0.1s-0.3,0-0.4,0h-0.1c-0.5,0-0.8-0.3-0.7-0.7c0.1-0.4,0.4-0.7,1.1-0.8c0.1,0,0.2,0,0.3,0c0.1,0,0.1,0,0.2,0h0.2c0.1,0,0.2,0,0.3,0l0.4-1.8c0.1-0.8,0.2-1.3,0.2-1.7c0-0.2,0-0.4,0-0.5c-0.1-0.2,0.1-0.6,0.3-0.6c0.2-0.1,0.3-0.1,0.5-0.1c0.5,0,1,0.2,1.3,0.7c0.3,0.5,0.5,1.2,0.3,2.2c0,0.1-0.1,0.3-0.1,0.6c-0.1,0.3-0.1,0.6-0.2,1c1-0.1,1.9-0.1,2.7-0.1l0.2-1.1c0.1-0.3,0.1-0.6,0.2-0.9l0.1-0.7c0-0.2,0.1-0.3,0.1-0.3c0.1-0.6,0-1-0.1-1.2c-0.1-0.2,0.1-0.4,0.3-0.5c0.1-0.1,0.3-0.1,0.5-0.1c0.5,0,1,0.2,1.4,0.7c0.3,0.5,0.5,1.2,0.3,2.2l-0.2,0.8c-0.1,0.3-0.1,0.6-0.2,1c0.7-0.1,1.2-0.1,1.7-0.2c0,0,0.1,0,0.1,0c0.3,0,0.4,0.2,0.5,0.4c0.1,0.2,0,0.5-0.2,0.7c-0.2,0.2-0.6,0.4-1.4,0.4C131.5,7.7,131.3,7.7,131.2,7.7z"/><path class="st0" d="M139.7,9.1c-1.1-1.7-2.8,0.5-3.5,2.3c-0.7,1.8-0.3,2.8,0.1,3c0.5,0.2,1.1,0.2,2.3-2.2c1.2-2.5,3.2-1.3,3.2-0.5c-0.1,1.2-0.1,1.5-0.2,2.8c-0.1,1.4-0.5,1.5-0.9,1.4c-1.2-0.1-1.3-0.4-1.4-2.4c-1.7,3.7-5.2,2.9-6,0.8c-0.8-2.1,0-4.5,1.7-6.1c2-2,5.3-1.6,6.1,0.5C141.5,9.9,140.4,10.2,139.7,9.1z"/><path class="st0" d="M145.4,15.3c-0.1,0.6-0.5,0.8-1.5,0.7c-0.9-0.1-1.2-0.9-1.1-2c0.1-0.7,0.2-1.7,0.4-2.6c0.2-1,0.3-1.7,0.4-2.7c0.1-0.7-0.3-1.2,0.2-1.4c0.8-0.4,2.2-0.1,2.4,0.9c0.3-0.3,0.5-0.6,0.9-0.8c0.4-0.2,0.9-0.3,1.4-0.3c0.6,0,0.8,0.1,1.2,0.3c0.3,0.2,0.3,0.7,0.2,1c-0.2,0.6-0.5,0.6-1.1,0.6c-0.6,0-1.2,0.3-1.9,1.1c-0.5,0.5-0.7,1.1-0.9,1.6c-0.3,0.8-0.4,1.4-0.6,3C145.4,14.8,145.4,15.1,145.4,15.3z"/><path class="st0" d="M160.4,7.2c0.9,0,1.8,0.5,2.2,1.4c0.7,1.5,0.5,3.2-0.2,4.6s-1.9,2.5-3.3,2.7c-0.2,0-0.4,0.1-0.6,0.1c-0.7,0-1.1-0.3-1.3-0.5c-0.2-0.3-0.2-0.5,0-0.6c1.2-0.5,2.1-1.3,2.6-2.2c0.5-0.8,0.7-1.8,0.7-2.5s-0.2-1.3-0.6-1.3c-0.1,0-0.2,0-0.2,0c-0.5,0-1.2,0.4-1.7,1c-0.6,0.7-1,1.6-1.3,2.6c-0.2,0.9-0.4,1.7-0.5,2.4l-0.3,2.1c-0.1,0.5-0.1,0.9-0.1,1.2c0,0.3,0,0.6,0,0.7c0,0.4-0.1,0.5-0.5,0.7c-0.1,0.1-0.3,0.1-0.5,0.1c-0.3,0-0.7-0.1-1-0.4c-0.3-0.3-0.5-0.8-0.6-1.6c0-1,0.2-2.5,0.5-4c0.1-0.7,0.3-1.4,0.4-2.1c0.3-1.4,0.5-2.3,0.4-2.8c0-0.2,0-0.4,0-0.5c0-0.2,0-0.3,0.4-0.5c0.2-0.1,0.5-0.2,0.8-0.2c0.4,0,0.8,0.1,1.1,0.4c0.3,0.3,0.5,0.7,0.4,1.4C158,7.9,159.2,7.2,160.4,7.2z"/><path class="st0" d="M171.2,8.1c0.6,0.7,1,2-0.2,2c-0.8,0-0.6-1.4-2.1-1.3c-1.1,0-1.9,1.3-2.3,2.8c-0.4,1.5-0.1,2.6,0.8,2.7c1,0.2,2-1.4,2.5-2.6c0.2-0.6,0.6-1.1,1.5-1.1c0.6,0,1.3,0.4,1.2,1.2c-0.1,1.1-0.2,2.9-0.3,3.4c-0.1,0.5-0.5,1-1,1c-1.1,0-1.4-1.1-1.3-2.1c-0.4,1.1-1.5,2-3,2c-2.4,0-3.5-2-3-4.6c0.5-2.6,2.2-4.4,4.5-4.4C169.2,7.1,170.6,7.3,171.2,8.1zM169.6,2.6c0.5,0,0.7,0.3,0.7,0.6s-0.2,0.6-0.6,0.6c-0.7,0.1-0.9,0.4-0.9,0.7c0,0.3,0.2,0.6,0.6,0.8c0.2,0.1,0.4,0.1,0.5,0.1c0.6,0,0.9-0.5,0.7-1c-0.2-0.4,0.1-0.7,0.4-0.7c0.4,0,0.5,0.4,0.6,0.7c0.1,0.4,0.1,0.8-0.2,1.2c-0.3,0.5-1,1-2,1c-0.5,0-1-0.2-1.4-0.5c-0.4-0.3-0.7-0.7-0.7-1.3c-0.1-0.6,0.2-1.1,0.6-1.5c0.4-0.4,1-0.6,1.7-0.7H169.6z"/></g></svg>';

            let toprecipesContent = '<h3>' + headerSVG + '</h3>';
            toprecipesContent += '<div class="toprecipes-list-wrapper">';
            toprecipesContent += '<article class="recipe" id="toprecipe-1">' + articleInner + '</article>';
            toprecipesContent += '<article class="recipe" id="toprecipe-2">' + articleInner + '</article>';
            toprecipesContent += '<article class="recipe" id="toprecipe-3">' + articleInner + '</article>';
            toprecipesContent += '</div>';

            toprecipesList.append(toprecipesContent);
            ELM.get('.recipes').appendFirst(toprecipesList);
            if (ELM.get('.grid_fluid.banner-area').exist()) {
              ELM.get('.grid_fluid.banner-area').remove();
            }


                        if (/^https:\/\/www.ica.se\/recept\/vardag\/$/.test(testURL)) {
                          // /recept/vardag/
                          // Enorm trafik - https://www.ica.se/recept/chili-con-carne-424/
                          // Alla älskar halloumi - https://www.ica.se/recept/lasagne-med-halloumi-spenat-och-pumpakarnor-718382/
                          // Mest poppis fiskrecept - https://www.ica.se/recept/torsk-i-ugn-med-dill-och-citronsas-719374/

                          test.modifyRecipe('toprecipe-1',
                            424,
                            'Chili con carne',
                            'https://www.ica.se/recept/chili-con-carne-424/',
                            '//www.ica.se/imagevaultfiles/id_182604/cf_259/chili_con_carne.jpg',
                            '4.2','95','15',
                            'gul lök\nnötfärs\nolja\nchili\npaprikapulver\nsvartpeppar\nsalt\nsoja\ntomat\nböna\njalapeñopeppar\nbrytbröd\nsalladskål\npersilja\nvinägrett'
                          );

                          test.modifyRecipe('toprecipe-2',
                            718382,
                            'Lasagne med halloumi, spenat och pumpakärnor',
                            'https://www.ica.se/recept/lasagne-med-halloumi-spenat-och-pumpakarnor-718382/',
                            '//www.ica.se/imagevaultfiles/id_106734/cf_259/lasagne_med_halloumi__spenat_och_pumpakarnor.jpg',
                            '4.7','382','16',
                            'lök\nvitlöksklyfta\nrapsolja\nlasagneplatta\ntomatpuré\ntomat\nhonung\ngrönsaksbuljongtärning\ntimjan\nvatten\nbladspenat\nhalloumiost\npumpakärna\nprästost\nsalt\nsvartpeppar\ntimjan'
                          );

                          test.modifyRecipe('toprecipe-3',
                            719374,
                            'Torsk i ugn med dill- och citronsås',
                            'https://www.ica.se/recept/torsk-i-ugn-med-dill-och-citronsas-719374/',
                            '//www.ica.se/imagevaultfiles/id_122727/cf_259/torsk_i_ugn_med_dill-_och_citronsas.jpg',
                            '4.5','95','9',
                            'potatis\ntorskfilé\nsalt och peppar\nsmetana\nfiskbuljongtärning\nvatten\ndill\ncitron\nbroccoli'
                          );

                        } else if (/^https:\/\/www.ica.se\/recept\/middag\/$/.test(testURL)) {
                          // /recept/middag/
                          // Tacopaj - https://www.ica.se/recept/tacopaj-713200/
                          // Höstig - https://www.ica.se/recept/risotto-med-skogschampinjoner-716952/
                          // Fisk - https://www.ica.se/recept/lysande-gul-fiskgryta-1677/

                          test.modifyRecipe('toprecipe-1',
                            713200,
                            'Tacopaj',
                            'https://www.ica.se/recept/tacopaj-713200/',
                            '//www.ica.se/imagevaultfiles/id_105941/cf_259/tacopaj.jpg',
                            '4.2','68','11',
                            'vetemjöl\nsmör eller margarin\nkvarg\nvatten\nnötfärs\nsmör eller margarin\ntacokrydda\nvatten\ncrème fraiche\nkörsbärstomat\nost'
                          );

                          test.modifyRecipe('toprecipe-2',
                            716952,
                            'Risotto med skogschampinjoner',
                            'https://www.ica.se/recept/risotto-med-skogschampinjoner-716952/',
                            '//www.ica.se/imagevaultfiles/id_89399/cf_259/risotto_med_skogschampinjoner.jpg',
                            '4.8','117','11',
                            'schalottenlök\nvitlöksklyfta\nsvampbuljong\nolivolja\narborioris\nvin\nkastanjechampinjon\nsmör\nparmesanost\nsalt\nruccola'
                          );

                          test.modifyRecipe('toprecipe-3',
                            1677,
                            'Lysande gul fiskgryta',
                            'https://www.ica.se/recept/lysande-gul-fiskgryta-1677/',
                            '//www.ica.se/imagevaultfiles/id_63144/cf_259/lysande_gul_fiskgryta.jpg',
                            '4.6','208','19',
                            'sej\nlaxfilé\npurjolök\ngul lök\nsmör\nvitlöksklyfta\nsalt\ntimjan\nbasilika\nvitt vin\nfiskbuljongtärning\nvispgrädde\ncrème fraiche\nvatten\nsaffran\nräka\nmussla\ntomatpuré\nbröd'
                          );

                        } else if (/^https:\/\/www.ica.se\/recept\/kyckling\/gryta\/$/.test(testURL)) {
                          // /recept/kyckling/gryta/ (det här är samma som sist)
                          // Oerhört poppis - https://www.ica.se/recept/flygande-jacob-717569/
                          // Gräddig och populär - https://www.ica.se/recept/kramig-kycklinggryta-med-soltorkad-tomat-723346/
                          // Med äpple till hösten - https://www.ica.se/recept/kycklinggryta-med-dragon-och-apple-723215/

                          test.modifyRecipe('toprecipe-1',
                            717569,
                            'Flygande Jacob',
                            'https://www.ica.se/recept/flygande-jacob-717569/',
                            '//www.ica.se/imagevaultfiles/id_93260/cf_259/flygande_jacob.jpg',
                            '4.4','46','10',
                            'kycklingfilé\nolja\nsalt\npeppar\nbacon\nbanan\nmatlagningsgrädde\nchilisås\nbasmatiris\njordnöt',
                            ''
                          );

                          test.modifyRecipe('toprecipe-2',
                            723346,
                            'Krämig kycklinggryta med soltorkad tomat',
                            'https://www.ica.se/recept/kramig-kycklinggryta-med-soltorkad-tomat-723346/',
                            '//www.ica.se/imagevaultfiles/id_175331/cf_259/kramig_kycklinggryta_med_soltorkad_tomat.jpg',
                            '4.4','53','9',
                            'ris\nkycklingfilé\nolja\nsalt\npeppar\ncrème fraiche\nkycklingbuljong\nsoltorkad tomat\nsockerärta',
                            ''
                          );

                          test.modifyRecipe('toprecipe-3',
                            723215,
                            'Kycklinggryta med dragon och äpple',
                            'https://www.ica.se/recept/kycklinggryta-med-dragon-och-apple-723215/',
                            '//www.ica.se/imagevaultfiles/id_175344/cf_259/kycklinggryta_med_dragon_och_apple.jpg',
                            '3.5','36','15',
                            'gul lök\nvitlöksklyfta\näpple\nkycklinglårfilé\nsmör\ndragon\nsalt\npeppar\nvatten\nkycklingfond\nvispgrädde\nmajsstärkelse\ncitronskal\nmathavre\ngrönsallad',
                            ''
                          );

                        } else if (/^https:\/\/www.ica.se\/recept\/vegetarisk\/$/.test(testURL)) {
                          // /recept/vegetarisk/
                          // Pumpa på hösten - https://www.ica.se/recept/pumpacurry-med-kikarter-och-kokosmjolk-724160/
                          // Nytt från Buffé - https://www.ica.se/recept/savoykalsdolmar-med-svamp-724196/
                          // Klassiker i vegotappning - https://www.ica.se/recept/vegopaella-med-rostad-paprika-zucchini-och-halloumi-724157/

                          test.modifyRecipe('toprecipe-1',
                            724160,
                            'Pumpacurry med kikärter och kokosmjölk',
                            'https://www.ica.se/recept/pumpacurry-med-kikarter-och-kokosmjolk-724160/',
                            '//www.ica.se/imagevaultfiles/id_184473/cf_259/pumpacurry_med_kikarter_och_kokosmjolk.jpg',
                            '3.5','2','18',
                            'gul lök\nbutternutpumpa\nmorot\nkikärta\nolja\nvitlöksklyfta\ncurry\nspiskummin\nkardemumma\ngrönsaksbuljong\nkokosmjölk\nmajsstärkelse\nsalt\nsvartpeppar\nlime\nsalladslök\nbasmatiris\nkoriander'
                          );

                          test.modifyRecipe('toprecipe-2',
                            724196,
                            'Savoykålsdolmar med svamp',
                            'https://www.ica.se/recept/savoykalsdolmar-med-svamp-724196/',
                            '//www.ica.se/imagevaultfiles/id_184586/cf_259/savoykalsdolmar_med_svamp.jpg',
                            '0','0','16',
                            'savoykål\nvitlöksklyfta\nsvamp\nvattenkastanj\ngröna linser\nrapsolja\ningefära\njapansk soja\nsalt\nsvartpeppar\nmisopasta\nvatten\nmatfett\nlingon\nsweet chilisås\nkoriander'
                          );

                          test.modifyRecipe('toprecipe-3',
                            724157,
                            'Vegopaella med rostad paprika, zucchini och halloumi',
                            'https://www.ica.se/recept/vegopaella-med-rostad-paprika-zucchini-och-halloumi-724157/',
                            '//www.ica.se/imagevaultfiles/id_184470/cf_259/vegopaella_med_rostad_paprika__zucchini_och_halloumi.jpg',
                            '4.3','4','11',
                            'grönsaksbuljong\ngul lök\nvitlöksklyfta\nolivolja\navorioris\nsaffran\npaprika\nzucchini\nhalloumiost\nkörsbärstomat\nolja'
                          );

                        } else if (/^https:\/\/www.ica.se\/recept\/vegan\/$/.test(testURL)) {
                          // /recept/vegan/
                          // Alla älskar denna - https://www.ica.se/recept/vegansk-tomat-och-purjolokspaj-723198/
                          // Höstigt från Buffé - https://www.ica.se/recept/savoykalsdolmar-med-svamp-724196/
                          // Efterrätt - https://www.ica.se/recept/veganska-vafflor-724217/

                          test.modifyRecipe('toprecipe-1',
                            723198,
                            'Vegansk tomat- och purjolökspaj',
                            'https://www.ica.se/recept/vegansk-tomat-och-purjolokspaj-723198/',
                            '//www.ica.se/imagevaultfiles/id_174744/cf_259/vegansk_tomat-_och_purjolokspaj.jpg',
                            '4.3','31','15',
                            'margarin\ndinkelmjöl\nvatten\nsalt\npurjolök\npaprika\nolivolja\nrosmarin\nsalt\nsvartpeppar\nvetemjöl\nhavregrädde\nsoltorkad tomat\nost\nkörsbärstomat'
                          );

                          test.modifyRecipe('toprecipe-2',
                            724196,
                            'Savoykålsdolmar med svamp',
                            'https://www.ica.se/recept/savoykalsdolmar-med-svamp-724196/',
                            '//www.ica.se/imagevaultfiles/id_184586/cf_259/savoykalsdolmar_med_svamp.jpg',
                            '0','0','16',
                            'savoykål\nvitlöksklyfta\nsvamp\nvattenkastanj\ngröna linser\nrapsolja\ningefära\njapansk soja\nsalt\nsvartpeppar\nmisopasta\nvatten\nmatfett\nlingon\nsweet chilisås\nkoriander'
                          );

                          test.modifyRecipe('toprecipe-3',
                            724217,
                            'Veganska våfflor',
                            'https://www.ica.se/recept/veganska-vafflor-724217/',
                            '//www.ica.se/imagevaultfiles/id_184453/cf_259/veganska_vafflor.jpg',
                            '0','0','13',
                            'vetemjöl\nhavregryn\nbakpulver\nströsocker\nvaniljsocker\nsalt\nyogoat\nmjölkdryck\nrapsolja\nblåbär\nkardemumma\nhallon\nmörk choklad'
                          );

                        } else if (/^https:\/\/www.ica.se\/recept\/cheesecake\/$/.test(testURL)) {
                          // /recept/cheesecake/
                          // Med Daim - https://www.ica.se/recept/daimcheesecake-722916/
                          // Citron och mynta - https://www.ica.se/recept/cheesecake-med-citron-och-mynta-721966/
                          // Fin variant på vanlig - https://www.ica.se/recept/fryst-cheesecakesandwich-med-blabar-722518/

                          test.modifyRecipe('toprecipe-1',
                            722916,
                            'Daimcheesecake',
                            'https://www.ica.se/recept/daimcheesecake-722916/',
                            '//www.ica.se/imagevaultfiles/id_172407/cf_259/daimcheesecake.jpg',
                            '4.4','18','12',
                            'smör\noreokaka\nvispgrädde\nvaniljsocker\näggvita\näggula\nströsocker\nfärskost\ndaimkula\noreokaka\nhallon\ndaimkula'
                          );

                          test.modifyRecipe('toprecipe-2',
                            721966,
                            'Cheesecake med citron och mynta',
                            'https://www.ica.se/recept/cheesecake-med-citron-och-mynta-721966/',
                            '//www.ica.se/imagevaultfiles/id_159833/cf_259/cheesecake_med_citron_och_mynta.jpg',
                            '4.4','25','13',
                            'kardemumma\ndigestivekex\nsmör\nsocker\nfärskost\ncrème fraiche\nströsocker\nägg\ncitronskal\nmynta\njordgubbe\nmynta\nflorsocker'
                          );

                          test.modifyRecipe('toprecipe-3',
                            722518,
                            'Fryst cheesecakesandwich med blåbär',
                            'https://www.ica.se/recept/fryst-cheesecakesandwich-med-blabar-722518/',
                            '//www.ica.se/imagevaultfiles/id_165614/cf_259/fryst_cheesecakesandwich_med_blabar.jpg',
                            '4.2','9','7',
                            'digestivekex\ncashewnöt\nsmör\nkondenserad mjölk\nfärskost\nblåbär\nvaniljpulver'
                          );

                        } else if (/^https:\/\/www.ica.se\/recept\/fisk\/soppa\/$/.test(testURL)) {
                          // /recept/fisk/soppa/
                          // Poppis - https://www.ica.se/recept/fiskarhustruns-fisksoppa-3760/
                          // Krämig - https://www.ica.se/recept/kramig-fiskgryta-722195/
                          // Klassiker - https://www.ica.se/recept/bouillabaisse-med-apelsinaioli-och-ortkrutonger-714535/

                          test.modifyRecipe('toprecipe-1',
                            3760,
                            'Fiskarhustruns fisksoppa',
                            'https://www.ica.se/recept/fiskarhustruns-fisksoppa-3760/',
                            '//www.ica.se/imagevaultfiles/id_73537/cf_259/fiskarhustruns_fisksoppa.jpg',
                            '4.5','112','10',
                            'fiskfilé\nlök\nsmör\ntomat\nfiskbuljong\nvitt vin\ntimjan\nräka\nvispgrädde\ndill'
                          );

                          test.modifyRecipe('toprecipe-2',
                            722195,
                            'Krämig fiskgryta',
                            'https://www.ica.se/recept/kramig-fiskgryta-722195/',
                            '//www.ica.se/imagevaultfiles/id_160675/cf_259/kramig_fiskgryta.jpg',
                            '4.3','66','14',
                            'potatis\nmorot\npurjolök\nolja\nmajsstärkelse\nvispgrädde\nvatten\nfiskbuljongtärning\nmjölk\npaprika\nlax\nsalt\ncayennepeppar\ngräslök'
                          );

                          test.modifyRecipe('toprecipe-3',
                            714535,
                            'Bouillabaisse med apelsinaioli och örtkrutonger',
                            'https://www.ica.se/recept/bouillabaisse-med-apelsinaioli-och-ortkrutonger-714535/',
                            '//www.ica.se/imagevaultfiles/id_46830/cf_259/bouillabaisse_med_apelsinaioli_och_ortkrutonger.jpg',
                            '4.7','27','20',
                            'laxtärning\ngul lök\nvitlöksklyfta\nfänkål\npotatis\nolja\nsaffran\ntomatpuré\nfiskbuljong\ntimjan\nformbröd\nkräftstjärt\nsalt och peppar\ndill\näggula\nvitlöksklyfta\nvitvinsvinäger\nrapsolja\nsalt och peppar\napelsinskal'
                          );

                        } else if (/^https:\/\/www.ica.se\/recept\/soppa\/$/.test(testURL)) {
                          // /recept/soppa/
                          // Ny från Buffé - https://www.ica.se/recept/minestronesoppa-pa-sasongens-skord-724190/
                          // Alltid poppis - https://www.ica.se/recept/morotssoppa-med-kokos-722533/
                          // Enkel och populär - https://www.ica.se/recept/busenkel-broccolisoppa-712859/

                          test.modifyRecipe('toprecipe-1',
                            724190,
                            'Minestronesoppa på säsongens skörd',
                            'https://www.ica.se/recept/minestronesoppa-pa-sasongens-skord-724190/',
                            '//www.ica.se/imagevaultfiles/id_184550/cf_259/minestronesoppa_pa_sasongens_skord.jpg',
                            '4.7','3','16',
                            'gul lök\nvitlöksklyfta\nbutternutpumpa\nsavoykål\nsidfläsk\nolivolja\nvatten\ngrönsaksbuljongtärning\ntomat\ntimjan\nlagerblad\npasta\nsalt\nsvartpeppar\nborlottibönor\nparmesanost'
                          );

                          test.modifyRecipe('toprecipe-2',
                            722533,
                            'Morotssoppa med kokos',
                            'https://www.ica.se/recept/morotssoppa-med-kokos-722533/',
                            '//www.ica.se/imagevaultfiles/id_166009/cf_259/morotssoppa_med_kokos.jpg',
                            '4.6','84','14',
                            'olivolja\ngul lök\nvitlöksklyfta\nmorot\nspiskummin\ningefära\nchiliflakes\nkokosmjölk\ngrönsaksfond\nvatten\nlimejuice\nsalt\nsvartpeppar\npumpafrö'
                          );

                          test.modifyRecipe('toprecipe-3',
                            712859,
                            'Busenkel broccolisoppa',
                            'https://www.ica.se/recept/busenkel-broccolisoppa-712859/',
                            '//www.ica.se/imagevaultfiles/id_79915/cf_259/busenkel_broccolisoppa.jpg',
                            '4.2','103','8',
                            'lök\npotatis\nbroccoli\ngrönsaksbuljong\nmatlagningsgrädde\nsalt och peppar\nbröd\nkräftstjärt'
                          );

                        } else if (/^https:\/\/www.ica.se\/recept\/smoothie\/$/.test(testURL)) {
                          // /recept/smoothie/
                          // Grön - https://www.ica.se/recept/vitaminsmoothie-723918/
                          // Bowl- https://www.ica.se/recept/nordisk-smoothie-bowl-719518/
                          // Snickers! Från senaste Buffé - https://www.ica.se/recept/snickerssmoothie-724025/

                          test.modifyRecipe('toprecipe-1',
                            723918,
                            'Vitaminsmoothie',
                            'https://www.ica.se/recept/vitaminsmoothie-723918/',
                            '//www.ica.se/imagevaultfiles/id_181240/cf_259/vitaminsmoothie.jpg',
                            '4.4','8','9',
                            'avokado\nkokosdryck\nbabyspenat\ningefära\ncitron\nmango\nkokosolja\nagavesirap\nkokos'
                          );

                          test.modifyRecipe('toprecipe-2',
                            719518,
                            'Nordisk smoothie bowl',
                            'https://www.ica.se/recept/nordisk-smoothie-bowl-719518/',
                            '//www.ica.se/imagevaultfiles/id_124628/cf_259/nordisk_smoothie_bowl.jpg',
                            'betyg','röster','ingredienser',
                            'ingredienslista'
                          );

                          test.modifyRecipe('toprecipe-3',
                            724025,
                            'Snickerssmoothie',
                            'https://www.ica.se/recept/snickerssmoothie-724025/',
                            '//www.ica.se/imagevaultfiles/id_182994/cf_259/snickerssmoothie.jpg',
                            '4.9','11','10',
                            'banan\nkakao\njordnötssmör\nvaniljpulver\nmandeldryck\ndadel\nmandeldryck\nvaniljpulver\njordnöt\nkakaonibs'
                          );

                        } else if (/^https:\/\/www.ica.se\/recept\/karljohan\/$/.test(testURL)) {
                          // /recept/karljohan/
                          // På pizza - https://www.ica.se/recept/pizza-bianco-med-skogssvamp-och-folke-722884/
                          // Med renskav - https://www.ica.se/recept/renskav-med-karljohan-senap-och-enbar-717903/
                          // I soppa - https://www.ica.se/recept/karljohansvampsoppa-med-balsamvinager-551641/

                          test.modifyRecipe('toprecipe-1',
                            722884,
                            'Pizza bianco med skogssvamp och Folke',
                            'https://www.ica.se/recept/pizza-bianco-med-skogssvamp-och-folke-722884/',
                            '//www.ica.se/imagevaultfiles/id_170368/cf_259/pizza_bianco_med_skogssvamp_och_folke_.jpg',
                            '4.6','8','10',
                            'karljohanssvamp\nkastanjechampinjon\nsmör\nsalt och peppar\nvitlöksklyfta\npizzabotten\ncrème fraiche\ntimjan\nost\nhasselnöt'
                          );

                          test.modifyRecipe('toprecipe-2',
                            717903,
                            'Renskav med karljohan, senap och enbär',
                            'https://www.ica.se/recept/renskav-med-karljohan-senap-och-enbar-717903/',
                            '//www.ica.se/imagevaultfiles/id_103916/cf_259/renskav_med_karljohan__senap_och_enbar.jpg',
                            '4.6','8','14',
                            'renskav\nkarljohanssvamp\nrödlök\nenbär\nmatolja\nköttbuljong\nfärskost\ndijonsenap\nhonung\nmajsstärkelse\nsmör\nsalt och svartpeppar\npotatismos\nlingon'
                          );

                          test.modifyRecipe('toprecipe-3',
                            551641,
                            'Karljohansvampsoppa med balsamvinäger',
                            'https://www.ica.se/recept/karljohansvampsoppa-med-balsamvinager-551641/',
                            '//www.ica.se/imagevaultfiles/id_16141/cf_259/karljohansvampsoppa_med_balsamvinager.jpg',
                            '2.9','40','9',
                            'karljohanssvamp\nschalottenlök\nolivolja\nsvampbuljong\nmjölk\nmatlagningsgrädde\nbalsamvinäger\nsalt\nört'
                          );

                        } else if (/^https:\/\/www.ica.se\/recept\/vasterbottensost\/paj\/$/.test(testURL)) {
                          // /recept/vasterbottensost/paj/
                          // Finaste pajen - https://www.ica.se/recept/vasterbottensostpaj-med-spenat-och-jordartskocka-721584/
                          // Glutenfri - https://www.ica.se/recept/glutenfri-vasterbottenpaj-723680/
                          // Enkel - https://www.ica.se/recept/enkel-vasterbottenpaj-med-smordeg-723666/

                          test.modifyRecipe('toprecipe-1',
                            721584,
                            'Västerbottensostpaj med spenat och jordärtskocka',
                            'https://www.ica.se/recept/vasterbottensostpaj-med-spenat-och-jordartskocka-721584/',
                            '//www.ica.se/imagevaultfiles/id_157919/cf_259/vasterbottensostpaj_med_spenat_och_jordartskocka.jpg',
                            '4.3','13','14',
                            'smör\nvetemjöl\nvatten\nlök\njordärtskocka\nolja\nsalt och svartpeppar\nVästerbottensost\nägg\nbabyspenat\nmatlagningsgrädde\nsalt\nsvartpeppar\nsallad'
                          );

                          test.modifyRecipe('toprecipe-2',
                            723680,
                            'Glutenfri västerbottenpaj',
                            'https://www.ica.se/recept/glutenfri-vasterbottenpaj-723680/',
                            '//www.ica.se/imagevaultfiles/id_180675/cf_259/glutenfri_vasterbottenpaj.jpg',
                            '3.5','4','11',
                            'mjölmix\nsmör\nkvarg\nvatten\nägg\nvispgrädde\nmjölk\nsalt\nsvartpeppar\nVästerbottensost\nsallad'
                          );

                          test.modifyRecipe('toprecipe-3',
                            723666,
                            'Enkel västerbottenpaj med smördeg',
                            'https://www.ica.se/recept/enkel-vasterbottenpaj-med-smordeg-723666/',
                            '//www.ica.se/imagevaultfiles/id_180740/cf_259/enkel_vasterbottenpaj_med_smordeg.jpg',
                            '4.8','9','8',
                            'smördeg\nägg\nvispgrädde\nmjölk\nsalt\nsvartpeppar\nVästerbottensost\nsallad'
                          );

                        } else if (/^https:\/\/www.ica.se\/recept\/kraftskiva\/$/.test(testURL)) {
                          // /recept/kraftskiva/
                          // Klassiker - https://www.ica.se/recept/vasterbottensostpaj-med-kantareller-och-lojrom-722432/
                          // Kräftbröd - https://www.ica.se/recept/kraftbrod-med-ost-och-dill-720878/
                          // Potatisaioli - https://www.ica.se/recept/potatisaioli-med-sesam-och-chili-720877/

                          test.modifyRecipe('toprecipe-1',
                            722432,
                            'Västerbottensostpaj med kantareller och löjrom',
                            'https://www.ica.se/recept/vasterbottensostpaj-med-kantareller-och-lojrom-722432/',
                            '//www.ica.se/imagevaultfiles/id_164592/cf_259/vasterbottensostpaj_med_kantareller_och_lojrom.jpg',
                            '5.0','4','16',
                            'smör\nfilodeg\nkantarell\nsmör\nvitlöksklyfta\nschalottenlök\nVästerbottensost\ntryffelolja\nägg\ngrädde\nmjölk\nsalt\nsvartpeppar\ndill\ngräddfil\nlöjrom'
                          );

                          test.modifyRecipe('toprecipe-2',
                            720878,
                            'Kräftbröd med ost och dill',
                            'https://www.ica.se/recept/kraftbrod-med-ost-och-dill-720878/',
                            '//www.ica.se/imagevaultfiles/id_142539/cf_259/kraftbrod_med_ost_och_dill.jpg',
                            '2.8','6','9',
                            'jäst\nvatten\nvetemjöl\ndinkelmjöl\nsalt\nost\ndill\noliv\nägg'
                          );

                          test.modifyRecipe('toprecipe-3',
                            720877,
                            'Potatisaioli med sesam och chili',
                            'https://www.ica.se/recept/potatisaioli-med-sesam-och-chili-720877/',
                            '//www.ica.se/imagevaultfiles/id_142598/cf_259/potatisaioli_med_sesam_och_chili.jpg',
                            '4.5','2','9',
                            'potatis\näggula\nvitlöksklyfta\nsambal oelek\ncitronjuice\nsesamolja\nrapsolja\nsalt\nsvartpeppar'
                          );

                        } else if (/^https:\/\/www.ica.se\/recept\/potatis\/sallad\/$/.test(testURL)) {
                          // /recept/potatis/sallad/
                          // Grundrecept - https://www.ica.se/recept/grundrecept-potatissallad-722110/
                          // Med äpple - https://www.ica.se/recept/potatissallad-med-pepparrot-och-apple-722108/
                          // Varm rostad - https://www.ica.se/recept/rostad-fransk-potatissallad-med-dragon-720634/

                          test.modifyRecipe('toprecipe-1',
                            722110,
                            'Grundrecept potatissallad',
                            'https://www.ica.se/recept/grundrecept-potatissallad-722110/',
                            '//www.ica.se/imagevaultfiles/id_160295/cf_259/grundrecept_potatissallad.jpg',
                            '4.3','6','8',
                            'färskpotatis\nsalladslök\nsaltgurka\ngräddfil\nmajonnäs\ndijonsenap\nkapris\nsalt och svartpeppar'
                          );

                          test.modifyRecipe('toprecipe-2',
                            722108,
                            'Potatissallad med pepparrot och äpple',
                            'https://www.ica.se/recept/potatissallad-med-pepparrot-och-apple-722108/',
                            '//www.ica.se/imagevaultfiles/id_160299/cf_259/potatissallad_med_pepparrot_och_apple.jpg',
                            '4.8','12','12',
                            'potatis\nsalladslök\ngräslök\nrädisa\npepparrot\nsaltgurka\näpple\ngräddfil\nmajonnäs\ndijonsenap\nkapris\nsalt och svartpeppar'
                          );

                          test.modifyRecipe('toprecipe-3',
                            720634,
                            'Rostad fransk potatissallad med dragon',
                            'https://www.ica.se/recept/rostad-fransk-potatissallad-med-dragon-720634/',
                            '//www.ica.se/imagevaultfiles/id_139436/cf_259/rostad_fransk_potatissallad_med_dragon.jpg',
                            '4.7','31','13',
                            'färskpotatis\nolivolja\nflingsalt\npeppar\nkapris\nschalottenlök\nbladpersilja\ndragon\nrödvinsvinäger\ndijonsenap\nrapsolja\nsalt\npeppar'
                          );

                        } else if (/^https:\/\/www.ica.se\/recept\/zucchini\/$/.test(testURL)) {
                          // /recept/zucchini/
                          // Zucchiniplättar - https://www.ica.se/recept/zucchiniplattar-med-fetaost-och-dill-720960/
                          // Paella - https://www.ica.se/recept/vegopaella-med-rostad-paprika-zucchini-och-halloumi-724157/
                          // I en kaka - https://www.ica.se/recept/morots-och-zucchinikaka-723834/

                          test.modifyRecipe('toprecipe-1',
                            720960,
                            'Zucchiniplättar med fetaost och dill',
                            'https://www.ica.se/recept/zucchiniplattar-med-fetaost-och-dill-720960/',
                            '//www.ica.se/imagevaultfiles/id_142923/cf_259/zucchiniplattar_med_fetaost_och_dill.jpg',
                            '4.3','184','11',
                            'zucchini\nsalladslök\nfetaost\nvetemjöl\nägg\ndill\nsalt\nsvartpeppar\nolja\nmatlagningsyoghurt\nvitlök'
                          );

                          test.modifyRecipe('toprecipe-2',
                            724157,
                            'Vegopaella med rostad paprika, zucchini och halloumi',
                            'https://www.ica.se/recept/vegopaella-med-rostad-paprika-zucchini-och-halloumi-724157/',
                            '//www.ica.se/imagevaultfiles/id_184470/cf_259/vegopaella_med_rostad_paprika__zucchini_och_halloumi.jpg',
                            '4.3','4','11',
                            'grönsaksbuljong\ngul lök\nvitlöksklyfta\nolivolja\navorioris\nsaffran\npaprika\nzucchini\nhalloumiost\nkörsbärstomat\nolja'
                          );

                          test.modifyRecipe('toprecipe-3',
                            723834,
                            'Morots- och zucchinikaka',
                            'https://www.ica.se/recept/morots-och-zucchinikaka-723834/',
                            '//www.ica.se/imagevaultfiles/id_181458/cf_259/morots-_och_zucchinikaka_.jpg',
                            '5.0','1','14',
                            'zucchini\nmorot\nolivolja\nlimeskal\nrörsocker\nägg\nvetemjöl\nbakpulver\nkanel\nflingsalt\nfärskost\nflorsocker\nlimeskal\nlimejuice'
                          );

                        }

            window.onpopstate = function(event) {
              if (/^https:\/\/www.ica.se\/recept\/.*:search=.*$/.test(testURL)) {
                toprecipesList.css('cro-search');
              } else {
                toprecipesList.removeClass('cro-search');
              }
            };

          }

        }

      },

      modifyRecipe(recipe,recipeId,recipeName,recipeUrl,recipeImg,recipeAvg,recipeVotes,recipeIngredients,recipeIngredientsList,recipeDesc) {
        const recipeEl = ELM.get('#'+recipe);
        const saveBtn = recipeEl.find('.save-recipe-button a');
        recipeEl.find('header a').text(recipeName).attr('href',recipeUrl);
        recipeEl.find('figure a').attr('href',recipeUrl);
        recipeEl.find('figure img').attr('src',recipeImg).attr('alt',recipeName);
        recipeEl.find('.content a.block').attr('href',recipeUrl);
        //recipeEl.find('.content p').text(recipeDesc);
        recipeEl.find('.content p').remove();
        recipeEl.find('.yellow-stars').attr('id','recipeRating' + recipeId);
        recipeEl.find('.rate-recipe .rate').attr('data-avg-rating',recipeAvg);
        recipeEl.find('.rate-recipe meter').attr('value',recipeAvg).text(recipeAvg + '/5');
        recipeEl.find('footer .ingredients').attr('title',recipeIngredientsList).text(recipeIngredients + ' ingredienser');
        recipeEl.find('dd.votes span').text(recipeVotes);
        recipeEl.find('#hdnRecipeId').attr('value',recipeId);

        ELM.get('.toprecipes-list').css('loaded');

        recipeEl.click((e) => {
          gaPush({ eventAction: 'Recept, 3 utvalda', eventLabel: recipeUrl });
        });

  },

  checkForChanges(filterSegments) {
    if (filterSegments.length) {
      const isLoaded = setInterval(checkLoaded, 200);
      function checkLoaded() {
        if (document.getElementById('RecipeFilterMenu').classList.contains('loaded')) {
          clearInterval(isLoaded);
          test.addChanges(filterSegments);
        }
      }
    }
  },

  addChanges(filterSegments) {

    for (var i = 0; i < filterSegments.length; i++) {
      if (!filterSegments[i].classList.contains('selected')) {
        filterSegments[i].classList.add('contracted');
      }
    }

    const recipe = document.querySelectorAll('.recipe:not(.adjusted)');

    if (recipe.length) {
      let time, saveSvg;
      const clock = '<svg width="32px" height="32px"><use xlink:href="/Assets/icons/symbols.svg#clock"></use></svg>';
      for (var i = 0; i < recipe.length; i++) {
        const currentRecipe = recipe[i];
        currentRecipe.classList.add('adjusted');
        const recipeFooter = currentRecipe.querySelector('footer');
        const recipeImgDiv = currentRecipe.querySelector('div:first-child');
        const recipeTxtDiv = currentRecipe.querySelector('div:last-child');
        recipeTxtDiv.classList.add('size15of20');
        recipeTxtDiv.classList.remove('lg_size15of20');
        recipeTxtDiv.classList.remove('size12of20');
        recipeImgDiv.classList.add('size5of20');
        recipeImgDiv.classList.remove('lg_size5of20');
        recipeImgDiv.classList.remove('size8of20');
        time = document.createElement('div');

        test.addCookingTime(currentRecipe,time,clock,recipeTxtDiv);

        if(window.innerWidth > 969) {

          const recipeNo = i;
          const imgWrapper = recipe[recipeNo].querySelector('div:first-child a');
          if (imgWrapper.querySelectorAll('img').length === 1) {
            test.hiresImage(imgWrapper);
          }

          let imageObserver = new MutationObserver(function(mutations) {
            for (var i = 0; i < mutations.length; i++) {
              if (imgWrapper.querySelectorAll('img').length === 1) {
                test.hiresImage(imgWrapper);
                break;
              } else {
                imageObserver.disconnect();
              }
            }
          });

          imageObserver.observe(imgWrapper, {
            attributes: false,
            characterData: false,
            childList: true,
            subtree: false
          });

        }

      }
    }

  },

  addCookingTime(recipe,time,clock,recipeTxtDiv) {
    const cookingtimeValue = /(\d+)/.exec(recipe.getAttribute('data-cooking-time'));
    const cookingtime = cookingtimeValue ? parseInt(cookingtimeValue[1], 10) : 0;
    if (cookingtime > 1) {
      time.innerHTML=clock + cookingtime + ' min';
      time.classList.add('time');
      recipeTxtDiv.insertBefore(time, recipe.querySelector('.save-recipe-button'));
    }
  },

  hiresImage(imgWrapper) {
    const imgContent = imgWrapper.querySelector('img').cloneNode(false);
    const imgPath = imgContent.getAttribute('src').replace('cf_5291','cf_259');
    imgContent.setAttribute('src',imgPath);
    imgWrapper.appendChild(imgContent);
  }

};

$(document).ready(() => {
  Object.assign(test, CROUTIL());
  test.manipulateDom();
});
