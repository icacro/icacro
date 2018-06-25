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
import { ajax, gaPush } from '../util/utils';
import './style.css';

const test = {

  manipulateDom() {

    const recipeHeader = ELM.get('#recipe-header');

    //OBS! Gör sidkollen i optimize i stället!!!
    // if ((/^https:\/\/www.ica.se\/recept\/vardag\/$/.test(window.location)) ||
    // (/^https:\/\/www.ica.se\/recept\/potatis\/sallad\/$/.test(window.location)) ||
    // (/^https:\/\/www.ica.se\/recept\/billiga-veckan\/$/.test(window.location)) ||
    // (/^https:\/\/www.ica.se\/recept\/lax\/i-ugn\/$/.test(window.location)) ||
    // (/^https:\/\/www.ica.se\/recept\/rabarber\/paj\/$/.test(window.location)) ||
    // (/^https:\/\/www.ica.se\/recept\/rabarber\/$/.test(window.location)) ||
    // (/^https:\/\/www.ica.se\/recept\/middag\/$/.test(window.location)) ||
    // (/^https:\/\/www.ica.se\/recept\/grill\/$/.test(window.location))) {

      if (recipeHeader.exist()) {
        const toprecipesList = ELM.create('div toprecipes-list column size20of20 white-bg mdsa');
        const articleInner = '<div class="image-column"><figure class="sprite2-p" style=""><a href="" class="lazyloaded" data-noscript=""><img src="" alt="" class="lazyNoscriptActive"></a></figure></div><div class="info-column"><header><h2 class="title"><a href=""></a></h2></header><div class="content sm_hidden"><a class="block"><p></p></a></div><div id="" class="yellow-stars" itemprop="aggregateRating" itemscope="" itemtype="http://schema.org/AggregateRating"><section class="rate-recipe"><div class="content"><dl class="inline rate" data-avg-rating=""><dt>Betyg:</dt><dd class="rating" style="z-index: 0"><meter class="hidden" value="" min="1" max="5"></meter><div class="grade grade-5" title="5 av 5" data-rating="5"><span class="sprite2 icon icon-star"></span></div><div class="grade grade-4" title="4 av 5" data-rating="4"><span class="sprite2 icon icon-star"></span></div><div class="grade grade-3" title="3 av 5" data-rating="3"><span class="sprite2 icon icon-star"></span></div><div class="grade grade-2" title="2 av 5" data-rating="2"><span class="sprite2 icon icon-star"></span></div><div class="grade grade-1" title="1 av 5" data-rating="1"><span class="sprite2 icon icon-star"></span></div><input type="hidden" id="hdnRecipeId" value=""></dd><dd class="small votes"><span itemprop="reviewCount"></span> röst<span class="plural-postfix">er</span></dd></dl></div></section></div><footer><ul class="recipe-info"><li class="md_lte_hidden"><span title="" class="ingredients"></span></li></ul></footer><div class="save-recipe-button"><a href="#" data-name="" data-link="" data-recipeid="" class="sprite2-p icon-heart save-recipe js-track-recipe-save " title="Spara">Spara</a></div></div></article>';
        let recipe1,recipe2,recipe3;

        const headerSVG = '<?xml version="1.0" encoding="utf-8"?><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 140 20" style="enable-background:new 0 0 140 20;" xml:space="preserve"><style type="text/css">.st0{fill:#3F3F40;}</style><g><path class="st0" d="M6.4,4c0.1,0.2,0.2,0.4,0.2,0.8c0,0.8-0.1,1.8-0.2,2.6S6.3,8.3,6.2,9.1C6.1,9.8,5.9,10.8,5.7,12c-0.2,1.2-0.4,2.3-0.6,3c-0.2,0.8-0.3,1-0.6,1.2c-0.2,0.1-0.3,0.2-0.5,0.2c-0.6,0-1.1-0.1-1.5-0.6c-0.5-0.5-0.4-1.3-0.4-1.8c0-0.1,0.1-0.3,0.1-0.8c0.1-0.4,0.1-1,0.3-1.7l0.3-2.1c0.3-1.5,0.5-2.9,0.7-4c0.1-0.5,0.1-0.8,0.2-1c0-0.1,0-0.1,0-0.2H3.3c-0.2,0-0.5,0-0.9,0H1.9C1.3,4.2,1,4,0.9,3.9S0.7,3.5,0.7,3.4c0-0.3,0.2-0.6,0.8-0.8c0.1,0,0.3-0.1,0.6-0.1c0.6-0.1,1.4-0.1,2.4-0.2c0.5,0,1,0,1.4-0.1c1-0.1,1.9-0.1,2.5-0.1h0.5c0.3,0,0.6,0,0.8,0.1c0.2,0.1,0.4,0.3,0.5,0.7c0.1,0.5-0.1,0.7-0.3,0.9S9.2,4,8.8,4H6.4z"/><path class="st0" d="M11.1,7.3c0.3,0,0.7,0.2,0.9,0.4c0.3,0.3,0.5,0.5,0.5,0.8c0,0.3,0,0.6-0.1,1.1c0,0.3-0.1,0.6-0.1,1.2l-0.5,3.5c-0.1,1.1-0.1,1.5-0.5,1.8c-0.2,0.2-0.7,0.2-0.9,0.1c-0.5-0.1-0.8-0.3-0.8-1.3c-0.1-1.1,0-2.2,0.1-3.3c0.1-1.1,0.2-2,0.3-2.6C10.1,7.7,10.6,7.3,11.1,7.3z M11.8,3.3c1.2,0,1.4,0.8,1.3,1.6c-0.1,0.6-0.8,1-1.6,0.9c-0.9-0.1-1.1-0.7-1-1.5C10.5,4,11,3.3,11.8,3.3z"/><path class="st0" d="M14.8,7.6c1.3-0.6,2.4,0.3,2.4,1.5C18,7.8,20,6.6,21.8,7.5c2.8,1.4,2.1,6.8-0.9,8.3c-1.5,0.8-3,0.1-3.6-0.7c-0.5-0.7,0.1-1.4,0.7-0.8c1.4,1.2,3.5-2.4,2.4-4.7c-0.8-1.5-3.1-0.1-3.5,1.9c-0.4,2.1-0.6,3-0.9,4.7c-0.5,3.2-0.3,3.9-1.3,3.6c-1.6-0.3-1.7-2-1.4-4.3c0.3-1.7,0.9-4.6,1-6.1C14.5,8,14.1,7.9,14.8,7.6z"/><path class="st0" d="M29,6.9c1.2,0,1.8,0.7,1.9,1.3c0.1,0.6-0.2,1-0.9,1.1c-1.3,0.1-2.2,0.4-2.5,0.9c-0.5,0.7,0.4,1.3,1.6,2c0.9,0.5,1.4,1.4,1.4,2.1c0,0.7-0.4,1.4-1.2,1.8c-0.6,0.2-1.1,0.4-1.6,0.4c-1,0-2-0.4-2.6-0.9c-0.4-0.3-0.5-0.6-0.4-0.9c0.1-0.3,0.3-0.5,0.6-0.5c0.2,0,0.4,0.1,0.6,0.3c0.4,0.3,1.2,0.6,1.7,0.6c0.5,0,0.8-0.2,0.6-0.7c-0.1-0.4-0.6-0.7-1.2-1s-1.4-0.8-2-1.6c-0.6-0.9-0.5-2.1,0-2.9c0.5-0.8,1.8-1.5,3.3-1.7C28.5,6.9,28.8,6.9,29,6.9z"/><path class="st0" d="M36.5,12.7L37,8.9c-1.1-0.1-1.5-0.2-1.4-0.8c0.1-0.5,0.7-0.6,1.6-0.6c0.5-3.4,0.5-4,1.2-4.7c0.7-0.8,1.4-1,2.2-1c1.4,0,2.1,1.2,1.9,1.8c-0.1,0.4-0.8,0.7-1.2,0c-0.2-0.4-0.9-0.4-1.1,0.6c-0.1,0.4-0.2,1.5-0.5,3.3l0.8,0.1c0.7,0.1,1,0.3,0.9,0.7c-0.1,0.3-0.2,0.6-0.7,0.6c-0.3,0.1-0.8,0-1.3,0c-0.3,2.3-0.5,2.8-0.6,4.8c-0.2,2.4-0.3,3-1.5,2.7C36.2,15.9,36.2,15.4,36.5,12.7z"/><path class="st0" d="M43.1,15.9h-0.1c-0.1,0-0.1,0-0.2,0c-0.6-0.1-1.1-0.6-1-1.8l0.2-2.6c0.1-1,0.1-2,0.3-3c0.1-0.6,0.3-1,0.7-1c0,0,0.1,0,0.1,0c0.7,0,1.2,0.4,1.4,1c0.3-0.4,0.7-0.6,1.2-0.9c0.2-0.1,0.5-0.2,0.8-0.2c0.1,0,0.1,0,0.3,0c0.7,0,1.3,0.4,1.4,0.7c0.2,0.5,0.2,0.7,0,0.9c-0.2,0.2-0.5,0.3-0.9,0.3C46.6,9.3,46,9.6,45.5,10c-0.5,0.4-0.8,1-1,1.7c-0.2,1.1-0.2,2-0.3,2.9C44.2,15.6,43.7,15.9,43.1,15.9z"/><path class="st0" d="M55.1,8.2c0.6,0.7,1,2-0.2,2c-0.8,0-0.6-1.4-2.1-1.3c-1.1,0-1.9,1.3-2.3,2.8c-0.4,1.5-0.1,2.6,0.8,2.7c1,0.2,2-1.4,2.5-2.6c0.2-0.6,0.6-1.1,1.5-1.1c0.6,0,1.3,0.4,1.2,1.2c-0.1,1.1-0.2,2.9-0.3,3.4c-0.1,0.5-0.5,1-1,1c-1.1,0-1.4-1.1-1.3-2.1c-0.4,1.1-1.5,2-3,2c-2.4,0-3.5-2-3-4.6C48.2,9,50,7.1,52.3,7.1C53.1,7.1,54.4,7.4,55.1,8.2z M53.5,2.7c0.5,0,0.7,0.3,0.7,0.6S54,3.9,53.6,3.9c-0.7,0.1-0.9,0.4-0.9,0.7c0,0.3,0.2,0.6,0.6,0.8c0.2,0.1,0.4,0.1,0.5,0.1c0.6,0,0.9-0.5,0.7-1c-0.2-0.4,0.1-0.7,0.4-0.7c0.4,0,0.5,0.4,0.6,0.7c0.1,0.4,0.1,0.8-0.2,1.2c-0.3,0.5-1,1-2,1c-0.5,0-1-0.2-1.4-0.5s-0.7-0.7-0.7-1.3c-0.1-0.6,0.2-1.1,0.6-1.5c0.4-0.4,1-0.6,1.7-0.7H53.5z"/><path class="st0" d="M58.5,7.5c0.3-0.3,1-0.4,1.5-0.3c0.5,0.1,0.9,0.3,1,0.6c0.2,0.4,0.1,1.1,0.1,1.5c0.3-0.6,1.1-1.2,1.5-1.5c0.9-0.6,2.1-0.7,2.9-0.3c1.1,0.6,1.3,1.3,1.1,3.2c-0.2,2.3-0.5,3.6-0.5,4.8c0,0.8-2.7,1.2-2.8-0.8c0-0.8,0.2-1.9,0.3-2.8c0.3-1.3,0.4-3,0-3.2c-0.4-0.2-1,0.3-1.7,1.2c-0.4,0.5-0.8,1.3-1.1,1.9c-0.2,0.5-0.3,0.6-0.4,1.3c-0.1,0.5-0.1,0.9-0.3,1.9c-0.1,0.4-0.1,0.6-0.4,0.8c-0.8,0.5-2.3,0.3-2.3-1.3c0.1-2.6,0.4-3.9,0.5-5.4C58.2,8,57.9,8.1,58.5,7.5z"/><path class="st0" d="M74.1,12.3c-0.1,0.6-0.2,1.2-0.3,2c-0.1,0.4-0.1,0.6-0.1,1c-0.1,0.7-0.9,0.8-1.6,0.6c-0.4-0.1-0.7-0.3-1-0.7c-0.2-0.4-0.3-0.8-0.2-1.3c0.1-1.3,0.1-1.6,0.2-2.4c0.4-3.9,0.6-5.3,1.2-8.7c0.1-0.4-0.1-0.5,0.8-0.8c0.6-0.2,1.7,0,2,0.3c0.6,0.7,0.6,1.1,0,4C74.9,7.8,74.4,10.9,74.1,12.3z"/><path class="st0" d="M85.4,3.2c0.6,1,0.4,1.9-0.7,1.8c-0.9-0.1-2.6,0.5-3.6,1.4c-0.8,0.8-1.4,1.8-1.8,3c-0.4,1.2-0.4,2.3-0.1,3.3c0.1,0.5,0.4,0.8,0.7,1c0.4,0.3,0.7,0.3,1.1,0.3c0.7,0,1.4-0.4,1.8-0.8c0.5-0.5,0.8-0.9,1.1-0.9c0.1,0,0.2,0,0.3,0.1c0.5,0.3,0.6,0.8-0.1,1.7c-0.2,0.3-0.6,0.7-1.1,1c-0.5,0.3-1.1,0.6-1.7,0.6c-1.9,0.1-3.4-0.6-4.4-2.3c-0.6-1-0.9-2-0.9-3.2c0-2.3,1.1-4.8,2.7-6.4C80.6,2,84.3,1.5,85.4,3.2z"/><path class="st0" d="M87.1,14.9c-0.2,0.5-0.7,1.1-1.3,1c-0.6-0.1-0.8-0.6-0.6-1.4c0.1-0.4,0.9-2.9,1.9-5.7C88,6.1,89,3.4,89.2,3.1c0.4-0.8,1.6-0.8,1.9-0.8c0.8-0.1,1.5,0.1,2,0.6c0.4,0.4,0.7,0.9,0.8,1.5c0.2,0.7,1.2,9,1.4,10.1c0.2,1.5-1.7,1.6-2.5,1.5c-0.8-0.1-1.1-0.7-1.3-1.9c-0.2-0.9-0.2-1.8-0.2-1.8s-0.8,0.1-1.4,0.3c-0.7,0.1-1.1-0.2-1.2-0.5c-0.1-0.4,0.1-1,1.2-1.3l1.2-0.3l-0.5-5.3c0,0-2.1,6-2.3,6.8C87.9,12.5,87.4,14.3,87.1,14.9z"/><path class="st0" d="M105.6,6.2c0.8-0.8,1.2-1.2,2-2c0.4-0.3,0.5-0.5,0.8-0.8c0.2-0.3,0.5-0.5,1-0.2c0.8,0.5,0.5,1.2,0.1,1.7l-0.4,0.4c-0.3,0.4-1,1.1-2.8,2.7c-0.7,0.6-1,1-1.2,1.2c0.4,1.1,0.8,1.9,1.1,2.7c0.6,1.6,0.9,2.3,1.2,2.9c0.2,0.4,0.3,0.8-0.1,1c-0.4,0.2-1.3,0-1.8-1.4c-0.6-1.4-0.9-2.1-1.1-2.4c-0.3-0.6-0.6-1.2-0.9-1.9c-0.1,0.5-0.2,1.6-0.2,2c-0.1,0.4-0.1,1.2-0.3,2.8c-0.1,1.3-0.3,1.5-1.1,1.6c-1.6,0.3-1.9-1-1.9-2.2c0-3.9,1-8.9,1.4-10.2c0.2-0.7,0.3-1.1,0.5-1.7s2-0.6,2.4,0.2c0.4,0.8,0.1,1.6-0.1,2.5c-0.1,0.4-0.2,0.8-0.4,2.3C104,7.6,104.8,7,105.6,6.2z"/><path class="st0" d="M115.8,9c0.6,1.3,0.6,3,0.2,4.2c-0.3,0.9-0.7,1.7-1.5,2.3c-1.7,1.4-4.6,1-5.6-1.2c-0.8-1.7-0.7-3.4,0.1-4.8c1-1.9,2.9-2.6,4.2-2.4C114.2,7.2,115.2,7.7,115.8,9z M110.3,4.7c0.1-0.8,0.8-1.2,1.4-1.2c0.9,0,1.3,0.6,1.1,1.4c-0.2,0.8-0.8,1.1-1.2,1.1C110.9,6.1,110.2,5.7,110.3,4.7z M110.9,10.9c-0.7,2.2,0.3,3.7,1,3.8c0.5,0.1,1.1-0.3,1.5-0.9c0.4-0.5,0.6-1.1,0.7-2c0.2-1.2-0.1-3.1-1.1-3.3C111.8,8.4,111.6,10.9,110.9,10.9z M113.8,4.7c0.2-0.6,0.6-1,1.2-1c0.6,0,1.2,0.5,1.2,1.1c-0.1,0.8-0.5,1.4-1.4,1.4C114,6.2,113.5,5.6,113.8,4.7z"/><path class="st0" d="M118.7,3.2c0.1-0.3,0.1-0.5,0.1-0.7c0.1-0.1,0.2-0.3,0.5-0.3c0.3,0,0.8,0.2,1.2,0.6c0.3,0.3,0.4,0.7,0.4,1.3c0,0.6-0.1,1.4-0.4,2.6c-0.2,0.9-0.3,1.7-0.4,2.2c-0.1,0.3-0.1,0.6-0.1,0.9c0.5-0.3,0.9-0.7,1.2-0.9c0.7-0.5,1.2-1,1.7-1.3c0.5-0.4,1.1-0.9,1.5-0.9c0.4,0,0.6,0.3,0.7,0.5c0.1,0.3,0.1,0.6-0.1,0.9c-0.2,0.3-0.7,0.7-1.4,1.2c-0.6,0.4-1.1,0.8-1.4,1.2l-0.5,0.5c0.3,0.4,0.6,1,1.1,1.7c0.2,0.3,0.5,0.8,0.9,1.2c0.3,0.5,0.6,0.8,0.6,1.1c0.1,0.5-0.3,0.7-0.6,0.8c-0.1,0-0.3,0.1-0.4,0.1c-0.6,0-1.2-0.3-1.7-1c-0.2-0.3-0.5-0.7-0.7-1c-0.2-0.3-0.4-0.6-0.6-0.9c-0.2-0.3-0.4-0.6-0.6-1c-0.1,0.3-0.1,0.7-0.1,1c-0.1,0.3-0.1,0.6-0.1,1c-0.1,0.6-0.1,1.4-0.6,1.7c-0.3,0.2-0.5,0.2-0.7,0.2c-0.5,0-1-0.4-1.1-0.7c-0.1-0.2-0.1-0.4-0.1-0.8c0-0.7,0.2-2.2,0.5-4c0.3-1.8,0.6-3.6,0.8-5c0.1-0.7,0.2-1.2,0.3-1.5C118.7,3.6,118.7,3.4,118.7,3.2z"/><path class="st0" d="M130.5,11c0.3-0.3,0.4-0.6,0.3-0.9c0-0.4-0.3-0.8-0.8-0.8c-0.2,0-0.5,0.1-0.9,0.3c-0.9,0.5-1.5,1.5-1.6,2.5c-0.2,1.5,0.5,2.7,1.9,2.7c1.2,0,1.8-1.1,2.4-1.1c0.5,0,0.8,0.5,0.3,1.1c-1.2,1.6-3.8,2-5.6,0.7c-0.8-0.6-1.4-1.5-1.6-2.6c-0.2-1.1-0.2-2.5,0.9-3.9c1.1-1.5,2.4-1.9,3.8-2c0.8,0,1.7,0.2,2.1,0.5c0.5,0.4,0.9,0.9,1,1.4c0.4,1.2-0.1,2.6-1.3,3.4c-0.6,0.4-1.3,0.7-2,0.7c-0.7,0-1.3-0.3-1.2-0.8c0-0.2,0.2-0.3,0.6-0.4C129.8,11.7,130.2,11.3,130.5,11z"/><path class="st0" d="M137.2,9.6c-0.1,0.7-0.3,1.3-0.4,1.9c-0.1,0.6-0.2,1.2-0.2,1.6c0,0.5,0,1.1,0.3,1.2c0.5,0.3,0.7-0.2,1.2-0.2c0.3,0,0.5,0.2,0.6,0.5c0,0.4-0.6,1-1,1.2c-0.4,0.2-0.7,0.2-1.1,0.3c-0.5,0-1,0-1.5-0.3c-0.5-0.3-0.9-0.9-1.1-1.5c-0.3-0.9-0.2-1.7,0-2.9c0.1-0.3,0.2-0.7,0.3-1.1c0.1-0.3,0.2-0.8,0.3-1.2c0.1-0.4,0.1-0.7,0.2-1.1c-0.2,0-0.4,0-0.7,0c-0.4,0-0.8-0.2-0.9-0.8c-0.1-0.5,0.5-0.5,1.1-0.6c0.1,0,0.5,0,0.8,0c0.2-1.3,0.4-2.2,0.5-2.7c0.1-1.2,0.2-1.8,1-1.8c1.2,0,1.7,0.7,1.5,2.3c-0.1,0.6-0.3,1.2-0.3,2.1c0.4,0,0.7,0,1.2,0c0.5,0,0.6,0.6,0.6,1c0,0.4-0.5,0.5-1.5,0.5c-0.1,0-0.6,0.1-0.6,0.1C137.4,8.6,137.3,9,137.2,9.6z"/></g></svg>';
        //const headerSVG = '<?xml version="1.0" encoding="utf-8"?><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 173 20" style="enable-background:new 0 0 173 20;" xml:space="preserve"><style type="text/css">.st0{fill:#3F3F40;}</style><g><path class="st0" d="M8.5,13.6C8,14.7,7.3,15,6.6,15c-0.7,0-1.5-0.3-1.6-1.2L4.1,6.2c0,0-1.4,6.6-1.8,8c-0.2,0.8-0.6,1.8-1.5,1.6c-0.8-0.2-0.6-1.3-0.4-2.2l2-8.6c0.7-3.1,1.9-3,2.9-2.8c1,0.3,1.4,1.2,1.6,1.5C7.2,4.2,7.2,4.6,7.3,5c0.1,0.7,0.5,5.7,0.5,6.2c0.8-2.1,2.7-7,3.3-7.9c0.1-0.2,0.3-0.4,0.4-0.5c0.3-0.3,0.7-0.5,1.6-0.5c1.6,0.2,1.7,1.1,1.7,2c0,0.9-0.4,10-0.6,10.7c-0.2,0.8-1,1-1.6,0.9s-0.9-0.1-1.2-0.5c-0.3-0.4-0.3-0.8-0.3-1.2c0-1,0.6-9,0.6-9S8.9,12.5,8.5,13.6z"/><path class="st0" d="M23.3,8.1c0.6,0.7,1,2-0.2,2c-0.8,0-0.6-1.4-2.1-1.3c-1.1,0-1.9,1.3-2.3,2.8c-0.4,1.5-0.1,2.6,0.8,2.7c1,0.2,2-1.4,2.5-2.6c0.2-0.6,0.6-1.1,1.5-1.1c0.6,0,1.3,0.4,1.2,1.2c-0.1,1.1-0.2,2.9-0.3,3.4c-0.1,0.5-0.5,1-1,1c-1.1,0-1.4-1.1-1.3-2.1c-0.4,1.1-1.5,2-3,2c-2.4,0-3.5-2-3-4.6c0.5-2.6,2.2-4.4,4.5-4.4C21.3,7.1,22.6,7.3,23.3,8.1z M21.7,2.6c0.5,0,0.7,0.3,0.7,0.6s-0.2,0.6-0.6,0.6c-0.7,0.1-0.9,0.4-0.9,0.7c0,0.3,0.2,0.6,0.6,0.8c0.2,0.1,0.4,0.1,0.5,0.1c0.6,0,0.9-0.5,0.7-1c-0.2-0.4,0.1-0.7,0.4-0.7c0.4,0,0.5,0.4,0.6,0.7c0.1,0.4,0.1,0.8-0.2,1.2c-0.3,0.5-1,1-2,1c-0.5,0-1-0.2-1.4-0.5s-0.7-0.7-0.7-1.3c-0.1-0.6,0.2-1.1,0.6-1.5c0.4-0.4,1-0.6,1.7-0.7H21.7z"/><path class="st0" d="M26.6,7.5c0.3-0.3,1-0.4,1.5-0.3c0.5,0.1,0.9,0.3,1,0.6c0.2,0.4,0.1,1.1,0.1,1.5c0.3-0.6,1.1-1.2,1.5-1.5c0.9-0.6,2.1-0.7,2.9-0.3c1.1,0.6,1.3,1.3,1.1,3.2c-0.2,2.3-0.5,3.6-0.5,4.8c0,0.8-2.7,1.2-2.8-0.8c0-0.8,0.2-1.9,0.3-2.8c0.3-1.3,0.4-3,0-3.2c-0.4-0.2-1,0.3-1.7,1.2c-0.4,0.5-0.8,1.3-1.1,1.9c-0.2,0.5-0.3,0.6-0.4,1.3c-0.1,0.5-0.1,0.9-0.3,1.9c-0.1,0.4-0.1,0.6-0.4,0.8c-0.8,0.5-2.3,0.3-2.3-1.3c0.1-2.6,0.4-3.9,0.5-5.4C26.4,8,26.1,8,26.6,7.5z"/><path class="st0" d="M41.9,9.2c-0.2,0-0.4-0.1-0.6-0.2c-0.2-0.1-0.4-0.2-0.6-0.2c-0.7,0-1.4,0.5-1.9,1.4c-0.4,0.8-0.6,1.8-0.6,2.6c0,0.8,0.3,1.4,0.9,1.4c0.9,0,1.7-0.9,2.1-1.6c0.4-0.8,0.7-1.6,0.7-2.1c0-0.6,0.6-0.9,1.2-0.9c0.4,0,0.9,0.1,1.2,0.5c0.2,0.3,0.3,0.8,0.3,1.5c-0.1,1.3-0.4,3.3-0.7,4.6c-0.3,1.3-0.8,2.3-1.7,3.1c-1.1,0.9-2.8,0.8-3.7,0.1c-0.3-0.3-0.6-0.6-0.7-0.9c-0.2-0.5,0-0.9,0.5-0.9c0.2,0,0.4,0.1,0.5,0.2c0.2,0.3,0.6,0.6,1,0.6c1.2,0,1.6-1.2,1.8-2.5c0.1-0.6,0.1-1.3,0.2-2c-0.6,1.2-1.6,2-3,2c-0.7,0-1.3-0.2-1.9-0.8s-1-1.5-0.9-2.9c0.1-1.4,0.5-2.7,1.3-3.6C37.9,7.7,39,7,40.5,7c1.1,0,2.1,0.5,2.3,1.4C42.8,8.7,42.5,9.2,41.9,9.2z"/><path class="st0" d="M52.1,9.1c-1.1-1.7-2.8,0.5-3.5,2.3c-0.7,1.8-0.3,2.8,0.1,3c0.5,0.2,1.1,0.2,2.3-2.2c1.2-2.5,3.2-1.3,3.2-0.5c-0.1,1.2-0.1,1.5-0.2,2.8C54,15.9,53.5,16,53.1,16c-1.2-0.1-1.4-0.4-1.4-2.4c-1.7,3.7-5.2,2.9-6,0.8s0-4.5,1.7-6.1c2-2,5.3-1.6,6.1,0.5C53.9,9.9,52.9,10.2,52.1,9.1z"/><path class="st0" d="M65.6,8c0.3,0.6,0,1.4-0.7,1.4c-0.6,0-0.6-0.6-1.2-0.6c-0.7,0-1.7,1.6-2,2.8c-0.4,1.5-0.1,2.8,0.7,2.9c0.6,0.1,1.3-0.8,1.9-2.2c0.3-0.7,0.5-1,0.6-1.3c0.2-0.6,0.6-1.1,1.2-1.1c0.6,0,1.2,0.6,1.2,1.4c-0.1,1.1-0.2,3.5-0.3,4c-0.1,0.5-0.3,0.7-0.8,0.7c-1.1,0-1.5-0.7-1.5-1.8c-0.4,0.8-0.9,1.7-2.2,1.9c-2.1,0.3-3.9-1.4-3.6-4.1c0.3-2.6,2.1-4.8,4.8-4.8C64.4,7.1,65.2,7.3,65.6,8z"/><path class="st0" d="M69.4,7.5c0.3-0.3,1-0.4,1.5-0.3c0.5,0.1,0.9,0.3,1,0.6C72.1,8.2,72,8.9,72,9.3c0.3-0.6,1.1-1.2,1.5-1.5c0.9-0.6,2.1-0.7,2.9-0.3c1.1,0.6,1.3,1.3,1.1,3.2c-0.2,2.3-0.5,3.6-0.5,4.8c0,0.8-2.7,1.2-2.8-0.8c0-0.8,0.2-1.9,0.3-2.8c0.3-1.3,0.4-3,0-3.2c-0.4-0.2-1,0.3-1.7,1.2c-0.4,0.5-0.8,1.3-1.1,1.9c-0.2,0.5-0.3,0.6-0.4,1.3c-0.1,0.5-0.1,0.9-0.3,1.9c-0.1,0.4-0.1,0.6-0.4,0.8c-0.8,0.5-2.3,0.3-2.3-1.3c0.1-2.6,0.4-3.9,0.5-5.4C69.1,8,68.8,8,69.4,7.5z"/><path class="st0" d="M83.3,9.3c-1,0.6-2.1,1.9-1.9,3.7c0.2,1.3,1.2,1.9,2.2,1c1.3-1.2,1.5-3.3,1.9-5.3C85.7,7.4,85.8,5.9,86,5c0.1-0.7,0.1-1.2,0.1-1.6c0-0.4,0-0.7,0-0.9c0-0.4,0.1-0.5,0.5-0.7c0.2-0.1,0.4-0.1,0.6-0.1c0.4,0,0.9,0.1,1.2,0.6s0.5,1.3,0.3,2.6c-0.3,3.2-0.6,6-0.8,8.8c0,0.5,0,1-0.1,1.6c0,0.5-0.5,0.7-1,0.7c-1,0-1.5-0.7-1.7-2c-0.8,1.4-2.2,2.4-3.7,2.2c-1.9-0.3-2.8-1.9-2.9-3.7c0-2.3,1.4-4.1,3.2-4.8c1.2-0.5,2.6-0.3,2.9,0.5C85,9,84.1,8.9,83.3,9.3z"/><path class="st0" d="M92,15.3c-0.1,0.6-0.5,0.8-1.5,0.7c-0.9-0.1-1.2-0.9-1.1-2c0.1-0.7,0.2-1.7,0.4-2.6c0.2-1,0.3-1.7,0.4-2.7C90.3,8,90,7.5,90.5,7.3c0.8-0.4,2.2-0.1,2.4,0.9c0.3-0.3,0.5-0.6,0.9-0.8c0.4-0.2,0.9-0.3,1.4-0.3c0.6,0,0.8,0.1,1.2,0.3c0.3,0.2,0.3,0.7,0.2,1c-0.2,0.6-0.5,0.6-1.1,0.6c-0.6,0-1.2,0.3-1.9,1.1c-0.5,0.5-0.7,1.1-0.9,1.6c-0.3,0.8-0.4,1.4-0.6,3C92.1,14.8,92.1,15.1,92,15.3z"/><path class="st0" d="M102.7,9.1c-1.1-1.7-2.8,0.5-3.5,2.3c-0.7,1.8-0.3,2.8,0.1,3c0.5,0.2,1.1,0.2,2.3-2.2c1.2-2.5,3.2-1.3,3.2-0.5c-0.1,1.2-0.1,1.5-0.2,2.8c-0.1,1.4-0.5,1.5-0.9,1.4c-1.2-0.1-1.3-0.4-1.4-2.4c-1.7,3.7-5.2,2.9-6,0.8s0-4.5,1.7-6.1c2-2,5.3-1.6,6.1,0.5C104.4,9.9,103.4,10.2,102.7,9.1z"/><path class="st0" d="M114,10c-0.1,0.5-0.2,1.1-0.3,1.5c-0.1,1.1-0.1,2,0.1,2.4c0.2,0.3,0.3,0.4,0.6,0.4c0.1,0,0.2-0.1,0.3-0.2c0.2-0.2,0.5-0.3,0.7-0.3c0.5,0,0.7,0.5,0.3,1c-0.2,0.3-0.4,0.6-0.7,0.8c-0.4,0.3-0.8,0.4-1.4,0.4c-0.2,0-0.4,0-0.6-0.1c-1.2-0.2-1.7-1.2-1.9-2.3c-0.1-0.6-0.1-1.2-0.1-1.7c0-0.6,0.1-1.2,0.2-1.7c0.1-0.5,0.3-1.5,0.5-2.2c-0.3,0.1-0.5,0-0.8,0c-0.5,0-0.8-0.3-0.8-0.6c0-0.3,0.3-0.6,1-0.7c0.1,0,0.7,0,1,0c0.3-1.5,0.5-3,0.6-3.5c0.1-1.2-0.1-1.5,0.7-1.5c0.5,0,1.1,0.2,1.4,0.7c0.3,0.5,0.5,1.2,0.3,2.2c-0.1,0.3-0.1,0.6-0.1,0.8c-0.1,0.3-0.1,0.7-0.2,1.2c0.4,0,0.7,0,1.2,0c0.5,0,0.7,0.6,0.4,1c-0.3,0.3-1,0.4-1.9,0.4C114.2,8.6,114.1,9.3,114,10z"/><path class="st0" d="M118.4,7.3c0.3,0,0.7,0.2,0.9,0.4c0.3,0.3,0.5,0.5,0.5,0.8c0,0.3,0,0.6-0.1,1.1c0,0.3-0.1,0.6-0.1,1.2l-0.5,3.5c-0.1,1.1-0.1,1.5-0.5,1.8c-0.2,0.2-0.7,0.2-0.9,0.1c-0.5-0.1-0.8-0.3-0.8-1.3c-0.1-1.1,0-2.3,0.1-3.3c0.1-1.1,0.2-2,0.3-2.6C117.4,7.7,117.9,7.3,118.4,7.3z M119.1,3.3c1.2,0,1.4,0.8,1.3,1.6c-0.1,0.6-0.8,1-1.6,0.9c-0.9-0.1-1.1-0.7-1-1.5C117.9,3.9,118.3,3.2,119.1,3.3z"/><path class="st0" d="M131.2,7.7l-0.5,0.1c-0.2,1.2-0.5,2.6-0.6,3.7c-0.1,1.1-0.1,2,0.1,2.4c0.2,0.3,0.3,0.4,0.5,0.4c0.3,0,0.5-0.3,0.7-0.6c0.2-0.3,0.5-0.5,0.7-0.5c0.4,0,0.7,0.4,0.4,1c-0.2,0.4-0.4,0.8-0.8,1.2c-0.4,0.4-1,0.6-1.7,0.6c-0.2,0-0.4,0-0.6-0.1c-1.2-0.2-1.7-1.2-1.9-2.3c-0.2-1.2-0.1-2.5,0.1-3.5c0-0.1,0.1-0.4,0.2-0.8c0.1-0.5,0.2-1,0.3-1.5c-0.5,0-0.9,0-1.4,0c-0.5,0-0.9,0-1.3,0h-0.1l-0.1,0.4c0,0.1-0.1,0.2-0.1,0.3c-0.2,1.2-0.4,2.3-0.5,3.3c-0.1,1-0.1,1.7,0.1,2.1c0.1,0.2,0.2,0.3,0.4,0.3s0.3-0.1,0.4-0.3c0.2-0.3,0.4-0.5,0.6-0.5s0.4,0.1,0.4,0.4c0.1,0.6-0.4,1.3-1,1.6c-0.3,0.2-0.7,0.3-1.1,0.3h-0.2c-0.1,0-0.1,0-0.2,0c-1.2-0.2-1.7-1.1-1.9-2.2c-0.2-1.1-0.1-2.4,0.1-3.3c0.1-0.5,0.3-1.4,0.5-2.1c-0.3,0-0.5,0.1-0.6,0.1s-0.3,0-0.4,0h-0.1c-0.5,0-0.8-0.3-0.7-0.7c0.1-0.4,0.4-0.7,1.1-0.8c0.1,0,0.2,0,0.3,0c0.1,0,0.1,0,0.2,0h0.2c0.1,0,0.2,0,0.3,0l0.4-1.8c0.1-0.8,0.2-1.3,0.2-1.7c0-0.2,0-0.4,0-0.5c-0.1-0.2,0.1-0.6,0.3-0.6c0.2-0.1,0.3-0.1,0.5-0.1c0.5,0,1,0.2,1.3,0.7c0.3,0.5,0.5,1.2,0.3,2.2c0,0.1-0.1,0.3-0.1,0.6c-0.1,0.3-0.1,0.6-0.2,1c1-0.1,1.9-0.1,2.7-0.1l0.2-1.1c0.1-0.3,0.1-0.6,0.2-0.9l0.1-0.7c0-0.2,0.1-0.3,0.1-0.3c0.1-0.6,0-1-0.1-1.2c-0.1-0.2,0.1-0.4,0.3-0.5c0.1-0.1,0.3-0.1,0.5-0.1c0.5,0,1,0.2,1.4,0.7c0.3,0.5,0.5,1.2,0.3,2.2l-0.2,0.8c-0.1,0.3-0.1,0.6-0.2,1c0.7-0.1,1.2-0.1,1.7-0.2c0,0,0.1,0,0.1,0c0.3,0,0.4,0.2,0.5,0.4c0.1,0.2,0,0.5-0.2,0.7c-0.2,0.2-0.6,0.4-1.4,0.4C131.5,7.7,131.3,7.7,131.2,7.7z"/><path class="st0" d="M139.7,9.1c-1.1-1.7-2.8,0.5-3.5,2.3c-0.7,1.8-0.3,2.8,0.1,3c0.5,0.2,1.1,0.2,2.3-2.2c1.2-2.5,3.2-1.3,3.2-0.5c-0.1,1.2-0.1,1.5-0.2,2.8c-0.1,1.4-0.5,1.5-0.9,1.4c-1.2-0.1-1.3-0.4-1.4-2.4c-1.7,3.7-5.2,2.9-6,0.8c-0.8-2.1,0-4.5,1.7-6.1c2-2,5.3-1.6,6.1,0.5C141.5,9.9,140.4,10.2,139.7,9.1z"/><path class="st0" d="M145.4,15.3c-0.1,0.6-0.5,0.8-1.5,0.7c-0.9-0.1-1.2-0.9-1.1-2c0.1-0.7,0.2-1.7,0.4-2.6c0.2-1,0.3-1.7,0.4-2.7c0.1-0.7-0.3-1.2,0.2-1.4c0.8-0.4,2.2-0.1,2.4,0.9c0.3-0.3,0.5-0.6,0.9-0.8c0.4-0.2,0.9-0.3,1.4-0.3c0.6,0,0.8,0.1,1.2,0.3c0.3,0.2,0.3,0.7,0.2,1c-0.2,0.6-0.5,0.6-1.1,0.6c-0.6,0-1.2,0.3-1.9,1.1c-0.5,0.5-0.7,1.1-0.9,1.6c-0.3,0.8-0.4,1.4-0.6,3C145.4,14.8,145.4,15.1,145.4,15.3z"/><path class="st0" d="M160.4,7.2c0.9,0,1.8,0.5,2.2,1.4c0.7,1.5,0.5,3.2-0.2,4.6s-1.9,2.5-3.3,2.7c-0.2,0-0.4,0.1-0.6,0.1c-0.7,0-1.1-0.3-1.3-0.5c-0.2-0.3-0.2-0.5,0-0.6c1.2-0.5,2.1-1.3,2.6-2.2c0.5-0.8,0.7-1.8,0.7-2.5s-0.2-1.3-0.6-1.3c-0.1,0-0.2,0-0.2,0c-0.5,0-1.2,0.4-1.7,1c-0.6,0.7-1,1.6-1.3,2.6c-0.2,0.9-0.4,1.7-0.5,2.4l-0.3,2.1c-0.1,0.5-0.1,0.9-0.1,1.2c0,0.3,0,0.6,0,0.7c0,0.4-0.1,0.5-0.5,0.7c-0.1,0.1-0.3,0.1-0.5,0.1c-0.3,0-0.7-0.1-1-0.4c-0.3-0.3-0.5-0.8-0.6-1.6c0-1,0.2-2.5,0.5-4c0.1-0.7,0.3-1.4,0.4-2.1c0.3-1.4,0.5-2.3,0.4-2.8c0-0.2,0-0.4,0-0.5c0-0.2,0-0.3,0.4-0.5c0.2-0.1,0.5-0.2,0.8-0.2c0.4,0,0.8,0.1,1.1,0.4c0.3,0.3,0.5,0.7,0.4,1.4C158,7.9,159.2,7.2,160.4,7.2z"/><path class="st0" d="M171.2,8.1c0.6,0.7,1,2-0.2,2c-0.8,0-0.6-1.4-2.1-1.3c-1.1,0-1.9,1.3-2.3,2.8c-0.4,1.5-0.1,2.6,0.8,2.7c1,0.2,2-1.4,2.5-2.6c0.2-0.6,0.6-1.1,1.5-1.1c0.6,0,1.3,0.4,1.2,1.2c-0.1,1.1-0.2,2.9-0.3,3.4c-0.1,0.5-0.5,1-1,1c-1.1,0-1.4-1.1-1.3-2.1c-0.4,1.1-1.5,2-3,2c-2.4,0-3.5-2-3-4.6c0.5-2.6,2.2-4.4,4.5-4.4C169.2,7.1,170.6,7.3,171.2,8.1zM169.6,2.6c0.5,0,0.7,0.3,0.7,0.6s-0.2,0.6-0.6,0.6c-0.7,0.1-0.9,0.4-0.9,0.7c0,0.3,0.2,0.6,0.6,0.8c0.2,0.1,0.4,0.1,0.5,0.1c0.6,0,0.9-0.5,0.7-1c-0.2-0.4,0.1-0.7,0.4-0.7c0.4,0,0.5,0.4,0.6,0.7c0.1,0.4,0.1,0.8-0.2,1.2c-0.3,0.5-1,1-2,1c-0.5,0-1-0.2-1.4-0.5c-0.4-0.3-0.7-0.7-0.7-1.3c-0.1-0.6,0.2-1.1,0.6-1.5c0.4-0.4,1-0.6,1.7-0.7H169.6z"/></g></svg>';

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

        let testURL = window.location.href;
        testURL = testURL.slice(0,testURL.indexOf('#:'));

        if (/^https:\/\/www.ica.se\/recept\/vardag\/$/.test(testURL)) {
          // Chili con carne - https://www.ica.se/recept/chili-con-carne-424/
          // Krämig carbonara - https://www.ica.se/recept/kramig-carbonara-722780/
          // Busenkel broccolisoppa - https://www.ica.se/recept/busenkel-broccolisoppa-712859/

          test.modifyRecipe('toprecipe-1',
            424,
            'Chili con carne',
            'https://www.ica.se/recept/chili-con-carne-424/',
            '//www.ica.se/imagevaultfiles/id_182604/cf_259/chili_con_carne.jpg',
            '4.2',
            '95',
            '15',
            'gul lök\nnötfärs\nolja\nchili\npaprikapulver\nsvartpeppar\nsalt\nsoja\ntomat\nböna\njalapeñopeppar\nbrytbröd\nsalladskål\npersilja\nvinägrett',
            'Chili con carne är en mustig och het gryta med köttfärs, chili, vita bönor, paprika och tomater. Detta klassiska mexikanska recept är både lättlagat och uppskattat av dina middagsgäster.'
          );

          test.modifyRecipe('toprecipe-2',
            722780,
            'Krämig carbonara',
            'https://www.ica.se/recept/kramig-carbonara-722780/',
            '//www.ica.se/imagevaultfiles/id_168478/cf_259/kramig_carbonara.jpg',
            '3.9',
            '82',
            '9',
            'spaghetti\nbacon\nägg\nvispgrädde\nparmesanost\nsalt\nsvartpeppar\nruccola\näggula',
            'En klassisk, krämig carbonara med parmesanost, ruccola och den finaste svartpepparn – Tellicherry! Lika god en fredagkväll tillsammans med ett gott glas vin som till lyxlunch på helgen.'
          );

          test.modifyRecipe('toprecipe-3',
            712859,
            'Busenkel broccolisoppa',
            'https://www.ica.se/recept/busenkel-broccolisoppa-712859/',
            '//www.ica.se/imagevaultfiles/id_79915/cf_259/busenkel_broccolisoppa.jpg',
            '4.2',
            '99',
            '8',
            'lök\npotatis\nbroccoli\ngrönsaksbuljong\nmatlagningsgrädde\nsalt och peppar\nbröd\nkräftstjärt',
            'En riktigt smarrig soppa av broccoli som dessutom är lätt som en plätt att laga till! Servera den varma broccolisoppan tillsammans med en brödbit och njut!'
          );

        } else if (/^https:\/\/www.ica.se\/recept\/potatis\/sallad\/$/.test(testURL)) {
          // Enkel - https://www.ica.se/recept/enkel-potatissallad-723665/
          // Fransk - https://www.ica.se/recept/fransk-potatissallad-165198/
          // Med pepparrot och äpple - https://www.ica.se/recept/potatissallad-med-pepparrot-och-apple-722108/

          test.modifyRecipe('toprecipe-1',
            723665,
            'Enkel potatissallad',
            'https://www.ica.se/recept/enkel-potatissallad-723665/',
            '//www.ica.se/imagevaultfiles/id_180652/cf_259/enkel_potatissallad.jpg',
            '3.7',
            '3',
            '8',
            'potatis\nsalladslök\nbostongurka\ngräddfil\nmajonnäs\ndijonsenap\nsalt\nsvartpeppar',
            'Sommarens bästa potatissallad? Perfekt för midsommar eller middagen med det där lilla extra. Klassiska ingredienser men nu med adderad dijonsenap vilket ger ett extra sting!'
          );

          test.modifyRecipe('toprecipe-2',
            165198,
            'Fransk potatissallad',
            'https://www.ica.se/recept/fransk-potatissallad-165198/',
            '//www.ica.se/imagevaultfiles/id_44923/cf_259/fransk_potatissallad.jpg',
            '4.6',
            '38',
            '11',
            'potatis\nschalottenlök\ndill\nkapris\nvinäger\nsenap\nsalt\nsvartpeppar\nsocker\nolivolja\nvatten',
            'Denna fantastiskt goda, franska potatissallad passar utmärkt med det mesta. Sin karaktäristiska, mumsiga smak får potatissalladen när den blandas ihop med den lena senaps- och vinägersåsen. Strö över lite kapris och servera ihop med mört kött.'
          );

          test.modifyRecipe('toprecipe-3',
            722108,
            'Potatissallad med pepparrot och äpple',
            'https://www.ica.se/recept/potatissallad-med-pepparrot-och-apple-722108/',
            '//www.ica.se/imagevaultfiles/id_160299/cf_259/potatissallad_med_pepparrot_och_apple.jpg',
            '5.0',
            '6',
            '12',
            'potatis\nsalladslök\ngräslök\nrädisa\npepparrot\nsaltgurka\näpple\ngräddfil\nmajonnäs\ndijonsenap\nkapris\nsalt och svartpeppar',
            'Äpple, pepparrot, gräslök och skivade rädisor ger din krämiga potatissallad en fräsch krispighet. Perfekt på buffébordet eller att ta med på picknick. Måste testas!'
          );

        } else if (/^https:\/\/www.ica.se\/recept\/billiga-veckan\/$/.test(testURL)) {
          // Pasta - https://www.ica.se/recept/pasta-med-tomatsas-och-linser-723155/
          // Chili - https://www.ica.se/recept/chili-con-carne-med-ris-723146/
          // Kyckling - https://www.ica.se/recept/kyckling-teriyaki-med-ris-och-minimajs-723152/

          test.modifyRecipe('toprecipe-1',
            723155,
            'Pasta med tomatsås och linser',
            'https://www.ica.se/recept/pasta-med-tomatsas-och-linser-723155/',
            '//www.ica.se/imagevaultfiles/id_176291/cf_259/pasta_med_tomatsas_och_linser.jpg',
            '4.6',
            '16',
            '9',
            'morot\krossad tomat\krossad tomat\röd lins\spaghetti\olivolja\vatten\salt\peppar',
            'Pasta är en riktig vardagshjälte när tiden är knapp och familjen är hungrig. Men för att höja näringsvärdet på måltiden är röda linser och morötter två smarta ingredienser att ha i såsen. Detta recept är superenkelt och såsen kan mixas om det passar barnen bättre. Toppa med riven ost.'
          );

          test.modifyRecipe('toprecipe-2',
            723146,
            'Chili con carne med ris',
            'https://www.ica.se/recept/chili-con-carne-med-ris-723146/',
            '//www.ica.se/imagevaultfiles/id_176253/cf_259/chili_con_carne_med_ris.jpg',
            '3.7',
            '18',
            '12',
            'ris\nlök\nkidneyböna\nnötfärs\npastasås\npaprika\nolja\ntomatpuré\npaprikapulver\nvatten\nsalt\npeppar',
            'Med färdig pastasås, en burk kidneybönor och köttfärs har du grunden till en riktigt snabb och enkel chili con carne. Tillsammans med paprika och ris blir måltiden komplett och passar hela familjen. Perfekt att frysa in i matlådor om det blir mat över.'
          );

          test.modifyRecipe('toprecipe-3',
            723152,
            'Kyckling teriyaki med ris och minimajs',
            'https://www.ica.se/recept/kyckling-teriyaki-med-ris-och-minimajs-723152/',
            '//www.ica.se/imagevaultfiles/id_176288/cf_259/kyckling_teriyaki_med_ris_och_minimajs.jpg',
            '4.0',
            '19',
            '7',
            'ris\nkycklingfilé\nminimajs\nteriyakisås\nbabyspenat\nolja\nvatten',
            'Teriyaki kyckling gör du enkelt själv med färdig teriyakisås och kycklingfilé. Slänger du dessutom ner lite söt minimajs i pannan blir barnen extra glada. Servera kycklingen med ris och babyspenat och kanske lite rostade sesamfrön, om du har tid.'
          );

        } else if (/^https:\/\/www.ica.se\/recept\/lax\/i-ugn\/$/.test(testURL)) {
          // Limelax i ugn - https://www.ica.se/recept/limelax-i-ugn-med-chilicreme-722771/
          // Lax i ugn med romsås - https://www.ica.se/recept/ugnsstekt-lax-med-romsas-723067/
          // Saltinbakad med citronsås - https://www.ica.se/recept/saltbakad-lax-med-citronsas-laktosfri-676720/

          test.modifyRecipe('toprecipe-1',
            722771,
            'Limelax i ugn med chilicrème',
            'https://www.ica.se/recept/limelax-i-ugn-med-chilicreme-722771/',
            '//www.ica.se/imagevaultfiles/id_169738/cf_259/limelax_i_ugn_med_chilicrème_.jpg',
            '4.4',
            '19',
            '19',
            'laxfilé\nolivolja\nlimeskal\nsalt\nsvartpeppar\ncrème fraiche\nlimejuice\nsrirachasås\nsalt\npeppar\nbroccoli\nvitlöksklyfta\nmajskorn\nsmör\nsalt\npeppar\nkoriander\ngurka\ntortillabröd',
            'Lax i ugn ger fin fredagsfeeling med goda tillbehör som smörstekt majs, broccoli och chilicréme. Bjud limelaxen och tillbehören plockigt och låt var och en fylla sitt bröd efter egen smak.'
          );

          test.modifyRecipe('toprecipe-2',
            722771,
            'Ugnsstekt lax med romsås',
            'https://www.ica.se/recept/limelax-i-ugn-med-chilicreme-722771/',
            '//www.ica.se/imagevaultfiles/id_172037/cf_259/ugnsstekt_lax_med_romsas.jpg',
            '4.5',
            '26',
            '7',
            'potatis\nlaxfilé\nsalt\npeppar\ngräddfil\ncaviarmix\nbroccoli',
            'Ugnsstekt lax som tillagas tills den blir underbart mör passar utmärkt ihop med en krämig romsås. Ät fisken tillsammans med nykokt potatis och krispig broccoli och du har en vardagsmiddag som passar hela familjen.'
          );

          test.modifyRecipe('toprecipe-3',
            676720,
            'Saltbakad lax med citronsås - laktosfri',
            'https://www.ica.se/recept/saltbakad-lax-med-citronsas-laktosfri-676720/',
            '//www.ica.se/imagevaultfiles/id_19462/cf_259/saltbakad_lax_med_citronsas_-_laktosfri.jpg',
            '4.6',
            '18',
            '11',
            'lax\nsalt\nlätt crème fraiche\nmatlagningsgrädde\nfiskbuljongtärning\ncitron\nsalt\ngräslök\npotatis\nsockerärta\ncitronklyfta',
            'Denna himmelska, saltbakade lax med smakfull, laktosfri citronsås kommer bli mycket uppskattad på middagsbordet. Koka ihop din härliga sås under tiden laxen tillagas och servera den sedan ihop med pressad potatis, citron och krispiga sockerärter.'
          );

        } else if (/^https:\/\/www.ica.se\/recept\/rabarber\/paj\/$/.test(testURL)) {
          // Knäckig rabarberpaj - https://www.ica.se/recept/knackig-rabarberpaj-715053/
          // Nyttigare rabarberpaj - https://www.ica.se/recept/nyttigare-rabarberpaj-721996/
          // Rabarberkladdkaka - https://www.ica.se/recept/rabarberkladdkaka-med-vit-choklad-och-kardemumma-721994/

          test.modifyRecipe('toprecipe-1',
            715053,
            'Knäckig rabarberpaj',
            'https://www.ica.se/recept/knackig-rabarberpaj-715053/',
            '//www.ica.se/imagevaultfiles/id_63250/cf_259/knackig_rabarberpaj.jpg',
            '4.4',
            '205',
            '11',
            'rabarber\nhavregryn\nsocker\nvetemjöl\nbakpulver\nvaniljsocker\nsmör\nvispgrädde\nsirap\nsmör\nvaniljglass',
            'Syrlig rabarber under knäckigt havretäcke med kolasmak. Läckrare rabarberpaj får man leta efter. Servera gärna med vaniljglass.'
          );

          test.modifyRecipe('toprecipe-2',
            721996,
            'Nyttigare rabarberpaj',
            'https://www.ica.se/recept/nyttigare-rabarberpaj-721996/',
            '//www.ica.se/imagevaultfiles/id_161155/cf_259/nyttigare_rabarberpaj.jpg',
            '4.5',
            '8',
            '10',
            'rabarber\njordgubbe\nkardemummakärna\nkokossocker\npotatismjöl\nhavregryn\nhonung\nvaniljsocker\nsmör\nvatten',
            'Klassisk smulpaj med syrliga rabarber och söta jordgubbar. Pajen är sötad med honung och kokossocker. Vi har valt havregryn som tillför nyttiga fibrer istället för vetemjöl och den innehåller mindre smör. Smakar som en sommardag!'
          );

          test.modifyRecipe('toprecipe-3',
            721994,
            'Rabarberkladdkaka med vit choklad och kardemumma',
            'https://www.ica.se/recept/rabarberkladdkaka-med-vit-choklad-och-kardemumma-721994/',
            '//www.ica.se/imagevaultfiles/id_161146/cf_259/rabarberkladdkaka_med_vit_choklad_och_kardemumma.jpg',
            '3.9',
            '65',
            '10',
            'smör\nvit choklad\nströsocker\nsalt\nägg\nkardemummakärna\nvetemjöl\nrabarber\npotatismjöl\nflorsocker',
            'Smarrig kladdkaka med rabarber, vit choklad och kardemumma. Ett lättlagat och somrigt recept där rabarberns syrliga strävhet balanseras av den söta och mjuka kladdkakan. Här hittar du fler härliga kladdkakerecept.'
          );

        } else if (/^https:\/\/www.ica.se\/recept\/rabarber\/$/.test(testURL)) {
          // Knäckig rabarberpaj med brynt smör - https://www.ica.se/recept/rabarberpaj-med-brynt-smor-718995/
          // Rabarberkräm - https://www.ica.se/recept/len-rabarberkram-med-kardemumma-713752/
          // Rabarberkladdkaka - https://www.ica.se/recept/rabarberkladdkaka-med-vit-choklad-och-kardemumma-721994/

          test.modifyRecipe('toprecipe-1',
            718995,
            'Knäckig rabarberpaj med brynt smör',
            'https://www.ica.se/recept/rabarberpaj-med-brynt-smor-718995/',
            '//www.ica.se/imagevaultfiles/id_116224/cf_259/rabarberpaj_med_brynt_smor.jpg',
            '4.3',
            '23',
            '9',
            'rabarber\nsmör\nhavregryn\nströsocker\nvetemjöl\nbakpulver\nsirap\nmjölk\nsalt',
            'Lyxa till rabarberpajen med brynt smör. Det ger en fantastisk nötig touch som passar perfekt till den sötsyrliga fyllningen. En glutenfri variant? Välj ren havre och byt ut vetemjöl mot potatismjöl. Servera pajen ljummen med vaniljglass eller fluffig vaniljsås.'
          );

          test.modifyRecipe('toprecipe-2',
            713752,
            'Len rabarberkräm med kardemumma',
            'https://www.ica.se/recept/len-rabarberkram-med-kardemumma-713752/',
            '//www.ica.se/imagevaultfiles/id_36643/cf_259/len_rabarberkram_med_kardemumma_.jpg',
            '4.1',
            '13',
            '7',
            'vatten\nsocker\nkardemumma\nrabarber\npotatismjöl\nsocker\nmjölk',
            'Recept på en utsökt och somrig efterrätt gjord på rabarber. Rabarberkräm med kardemumma fixar du snabbt av bland annat socker, kardemumma, rabarber och potatismjöl. Servera den lena krämen med mjölk till dessert.'
          );

          test.modifyRecipe('toprecipe-3',
            721994,
            'Rabarberkladdkaka med vit choklad och kardemumma',
            'https://www.ica.se/recept/rabarberkladdkaka-med-vit-choklad-och-kardemumma-721994/',
            '//www.ica.se/imagevaultfiles/id_161146/cf_259/rabarberkladdkaka_med_vit_choklad_och_kardemumma.jpg',
            '3.9',
            '65',
            '10',
            'smör\nvit choklad\nströsocker\nsalt\nägg\nkardemummakärna\nvetemjöl\nrabarber\npotatismjöl\nflorsocker',
            'Smarrig kladdkaka med rabarber, vit choklad och kardemumma. Ett lättlagat och somrigt recept där rabarberns syrliga strävhet balanseras av den söta och mjuka kladdkakan. Här hittar du fler härliga kladdkakerecept.'
          );

        } else if (/^https:\/\/www.ica.se\/recept\/middag\/$/.test(testURL)) {
          // Klassisk lasagne - https://www.ica.se/recept/klassisk-lasagne-679675/
          // Risotto med svamp - https://www.ica.se/recept/risotto-med-skogschampinjoner-716952/
          // Foliepaket med torsk - https://www.ica.se/recept/foliepaket-med-torskrygg-sparris-potatis-orter-och-citron-714922/

          test.modifyRecipe('toprecipe-1',
            679675,
            'Klassisk lasagne',
            'https://www.ica.se/recept/klassisk-lasagne-679675/',
            '//www.ica.se/imagevaultfiles/id_76171/cf_259/klassisk_lasagne.jpg',
            '4.2',
            '217',
            '17',
            'lök\nvitlöksklyfta\nnötfärs\nolja\ntomatpuré\ntimjan\nrosmarin\nkrossad tomat\nköttbuljongtärning\nsalt och peppar\nlasagneplatta\nmatfett\nvetemjöl\nmjölk\nsalt och peppar\nparmesanost\nsallad',
            'Klassisk lasagne är väl en rätt man aldrig tröttnar på? Med det här receptet blir din lasagne perfekt med en mjuk och härlig konsistens och dessutom har den en ljuv och exemplarisk smak. Parmesanosten är pricken över i!'
          );

          test.modifyRecipe('toprecipe-2',
            716952,
            'Risotto med skogschampinjoner',
            'https://www.ica.se/recept/risotto-med-skogschampinjoner-716952/',
            '//www.ica.se/imagevaultfiles/id_89399/cf_259/risotto_med_skogschampinjoner.jpg',
            '4.8',
            '106',
            '11',
            'schalottenlök\nvitlöksklyfta\nsvampbuljong\nolivolja\narborioris\nvin\nkastanjechampinjon\nsmör\nparmesanost\nsalt\nruccola',
            'En perfekt kokt risotto är krämig och riset har kvar lite tuggmotstånd. Följ det här grundreceptet på svamprisotto och du har alla chanser att lyckas. Kastanjechampinjonerna i risotton går utmärkt att byta ut mot andra goda svampar som kantareller, karljohansvamp eller portabella till en ännu lyxigare vegetarisk festrätt.'
          );

          test.modifyRecipe('toprecipe-3',
            714922,
            'Foliepaket med torskrygg, sparris, potatis, örter och citron',
            'https://www.ica.se/recept/foliepaket-med-torskrygg-sparris-potatis-orter-och-citron-714922/',
            '//www.ica.se/imagevaultfiles/id_63758/cf_259/foliepaket_med_torskrygg__sparris__potatis__orter_och_citron.jpg',
            '4.8',
            '23',
            '12',
            'färskpotatis\nrödlök\nchili\nrädisa\ngrön sparris\nsmör\nört\ncitron\nflingsalt\npeppar\ngrillfolie\ntorskfilé',
            'Enklaste sättet att grilla är i folie! Gärna primörer med gräslök, persilja, citron, lite chili och smör. Riktigt gott till grillad fisk som torsk eller lax. En sommarfräsch middag till både vardag och fest.'
          );

        } else if (/^https:\/\/www.ica.se\/recept\/grill\/$/.test(testURL)) {
          // Grillad lax i folie - https://www.ica.se/recept/grillad-lax-i-folie-720557/
          // Grillade grönsaksspett med sting - https://www.ica.se/recept/grillade-gronsaksspett-med-sting-720369/
          // Karréspett - https://www.ica.se/recept/karrespett-med-tahinisas-och-grillad-hjartsallad-723893/

          test.modifyRecipe('toprecipe-1',
            720557,
            'Grillad lax i folie',
            'https://www.ica.se/recept/grillad-lax-i-folie-720557/',
            '//www.ica.se/imagevaultfiles/id_138072/cf_259/grillad_lax_i_folie.jpg',
            '4.0',
            '5',
            '5',
            'laxfilé\nfolieark\nsalt och svartpeppar\nsmör\nört',
            'Grillad lax i folie som trängs med härliga kryddor blir verkligen en smaksensation i sig. Lägg till en god sås, härliga tillbehör och en solig eftermiddag och du har garanterat en sommardag att minnas tillbaka till.'
          );

          test.modifyRecipe('toprecipe-2',
            720369,
            'Grillade grönsaksspett med sting',
            'https://www.ica.se/recept/grillade-gronsaksspett-med-sting-720369/',
            '//www.ica.se/imagevaultfiles/id_137108/cf_259/grillade_gronsaksspett_med_sting_____.jpg',
            '3.0',
            '112',
            '9',
            'grillspett\npaprikapulver\nsambal oelek\nolja\nzucchini\nröd paprika\naubergine\nchampinjon\nsalt och svartpeppar',
            'Grillade grönsaksspett piffar upp vilken grilltallrik som helst och med den röda paprikan i fokus blir det en härlig färgklick. I receptet som presenteras nedan oljas grönsakerna in med både parikapulver och sambal oelek, som i sin tur förhöjer smakerna i denna fina grönsaksblandning.'
          );

          test.modifyRecipe('toprecipe-3',
            723893,
            'Karréspett med tahinisås och grillad hjärtsallad',
            'https://www.ica.se/recept/karrespett-med-tahinisas-och-grillad-hjartsallad-723893/',
            '//www.ica.se/imagevaultfiles/id_180838/cf_259/karréspett_med_tahinisas_och_grillad_hjartsallad.jpg',
            '5.0',
            '1',
            '14',
            'kokosmjölk\ningefära\ntahini\nhonung\nlime\nsrirachasås\nsalt\nkarré\npeppar\nhjärtsalladshuvud\nbroccoli\nris\nsesamfrö\nlime',
            'Gör premiär på grillen med dessa saftiga och möra karréspett och grillad hjärtsallad. Den karaktäristiska tahinisåsen som du serverar till, får sin smak från tahini, ingefära, kokosmjölk, lime och sriracha. Lägg upp det grillade på ett stort fat och strö över rostade sesamfrön. Voìla!'
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

    // }

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

    // saveBtn.attr('data-name',recipeName).attr('data-link',recipeUrl).attr('data-recipeid',recipeId);
    //
    // saveBtn.click((e) => {
    //   e.preventDefault();
    //   ICA.legacy.savedRecipes.add(recipeId, function (data) {
    //       icadatalayer.add('recipe-save'); // Add info to datalayer for analytics
    //       saveBtn.css('active');
    //       saveBtn.css('icon-heart-filled');
    //   });
    // });

    recipeEl.click((e) => {
      gaPush({ eventAction: 'Recept, 3 utvalda', eventLabel: recipeUrl });
    });

  },

};

$(document).ready(() => {
  Object.assign(test, CROUTIL());
  test.manipulateDom();
});
