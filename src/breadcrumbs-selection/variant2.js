// ==UserScript==
// @name         Breadcrumbs
// @path         //./src/breadcrumbs-selection/variant2.js
// @namespace    http://tampermonkey.net/
// @version      0.1
// @match        https://www.ica.se/*
// @grant        none
// ==/UserScript==

'use strict';

import { CROUTIL, ELM } from '../util/main';
import { throttle, gaPush } from '../util/utils';
// import './style.common.css';
import './style.css';

const test = {
  pages: [[2083, 'Pannkakor', 'pannkakor/'],
    [690203, 'Scones',  'scones/'],
    [713437, 'American pancakes', 'amerikansk/pannkakor/'],
    [5058, 'Chokladbollar', 'chokladbollar/'],
    [679675,	'Lasagne',	'lasagne/'],
    [714125,	'Äppelpaj',	'apple/paj/'],
    [722780,	'Carbonara',	'carbonara/'],
    [424,	'Chiligryta',	'chiligryta/'],
    [641589, 'Äppelpaj',	'apple/paj/'],
    [533512,	'Stroganoff',	'stroganoff/'],
    [722982,	'Kladdkaka',	'kladdkaka/'],
    [716077,	'Potatissoppa',	'#:search=potatissoppa'],
    [716070,	'Pajdeg',	'#:search=pajdeg'],
    [723129,	'Köttfärslimpa',	'kott/fars/#:search=köttfärslimpa'],
    [716702,	'Äppelpaj',	'apple/paj/'],
    [5129,	'Nötgryta',	'not/gryta/'],
    [716485,	'Makaroner',	'makaroner/'],
    [4153,	'Äppelmos',	'apple/mos/'],
    [551761,	'Kladdkaka',	'kladdkaka/'],
    [632631,	'Kalops',	'kalops/'],
    [599834,	'Småkakor',	'smakakor/'],
    [715880,	'Morotskakor',	'morot/kaka/']
  ],
  isRecipe: $("#page").hasClass("recipepage"),
  getCategory() {
    //check if traffic is direct
    //alert(document.referrer);

    var id = parseInt($('meta[name=Id]').attr("content"));
    var cat2 = test.pages.find(function(e) {
      return e[0] == id;
    });
    return cat2 == undefined ? null : cat2;
  },
  getCrumbItem(title, urlPart) {
      // get formatted bread crumb
      var url = "https://www.ica.se/recept/" + urlPart;
      var content = urlPart != null ? "<a class='cro-breadcrumb-link' href='" + url + "'>" + title + "</a>" : title;
      return $("<li/>").append(content);
    },
    getRecipeName() {
      return $('meta[name=RecipeName]').attr("content");
    },
  onClick(e) {
    //e.preventDefault();
    //console.log(e.target.href);
    gaPush({ eventAction: 'Recept, Breadcrumbs', eventLabel: e.target.href });
  },
  manipulateDom() {
    if(!test.isRecipe) {
      return;
    }

    // get current category
    var category = test.getCategory();
    if(category == null) { // no category found, no recipe
      return;
    }

    // create elements
    var $div = $("<div />");
    $div.addClass("bread-crumbs");
    var $bc = $("<ul />");
    $bc.addClass("breadcrumb");
    $bc.addClass("backarrow");

    $bc.append(test.getCrumbItem("", "", 1));
    $bc.append(test.getCrumbItem(category[1], category[2]));
    $div.append($bc);

    // add elements
    var $header = $("div.col-12.recipe-meta.recipe-meta--header");
    var cookingTime = $header.text().trim();
    $header.text("");
    $header.append($div);

    // tracking
    $(".cro-breadcrumb-link").on("click", test.onClick);

    $(".recipe-header").append("<span class='cooking-time'>" + cookingTime + "</span>");
  }
};

$(document).ready(() => {
  Object.assign(test, CROUTIL());
  test.manipulateDom();
});
