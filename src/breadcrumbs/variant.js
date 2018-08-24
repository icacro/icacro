// ==UserScript==
// @name         Breadcrumbs
// @path         //./src/breadcrumbs/variant.js
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
  //tegories: ['cheesecake', 'smörgåstårta', 'färs', 'hamburgare', 'tårta', 'kärleksmums', 'smoothie', 'sallad', 'pasta'],
  //topIngredientCategories: ['västerbottensost', 'kyckling', 'lax', 'zucchini', 'körsbär', 'squash', 'lax'],
  //topMealCategories: ['vardag', 'middag', 'enkel', 'nyttig', 'efterrätt', 'grill'],

  topTypeCategories: ['cheesecake', 'smörgåstårta', 'hamburgare', 'tårta', 'smoothie', 'sallad', 'pasta', 'quesadillas', 'paj', 'cupcakes', 'müsli', 'pannkakor', 'bakverk', 'tapas', 'pizza', 'ugnspannkaka', 'soppa', 'kladdkaka', 'bröd'],
  topIngredientCategories: ['västerbottensost', 'kyckling', 'lax', 'zucchini', 'körsbär', 'squash', 'lax', 'halloumi', 'kyckling', 'kassler', 'torsk', 'plommon', 'falukorv', 'karljohan', 'kantarell', 'sötpotatis'],
  topMealCategories: ['vardag', 'middag', 'enkel', 'nyttig', 'efterrätt', 'grill', 'förrätt'],

  //topSpecial: ['vegan', 'vegetarisk'],

  //['middag', 'nyttig', 'vegan', 'vegetarisk', 'vardag', 'fredag', 'lax', 'enkel']

  // specialkost?

  findTopCategory(tags, topCategories) {
    if(tags != undefined && tags.length > 0){

      //var categories = $.map(tags, function(a) { return a.content.toLowerCase(); });
      var result = null;

      topCategories.forEach((tc) => {
        if(result == null) {
          if(tags.some(function(c) {
            return c == tc;
          })) {
            result = test.capitalizeFirstLetter(tc);
          }
        }
      });
      //return test.capitalizeFirstLetter(result == null ? tags[0] : result);
    }
    return result;
  },

  getCategory() {
    //check if traffic is direct
    //alert(document.referrer);

    var category = null;

    // look for meta 'Typ av recept', check prio list or use first
    var typeTags = $.map($("meta[name='Typ av recept']"), function(a) { return a.content.toLowerCase(); });
    category = test.findTopCategory(typeTags, test.topTypeCategories);
    if(category != null) {
      return category;
    }

    // look for meta 'Ingrediens', check prio list or use first
    var ingridientTags = $.map($("meta[name=Ingrediens]"), function(a) { return a.content.toLowerCase(); });
    category = test.findTopCategory(ingridientTags, test.topIngredientCategories);
    if(category != null) {
      return category;
    }

    // look for meta 'Måltid', check prio list or use first
    var mealTags = $.map($("meta[name=Måltid]"), function(a) { return a.content.toLowerCase(); });
    category = test.findTopCategory(mealTags, test.topMealCategories);
    if(category != null) {
      return category;
    }

    // look for ingridents in title
    var title = $('meta[name=RecipeName]').attr("content").toLowerCase();

    if(ingridientTags != undefined && ingridientTags.length > 0){
      for(var i = 0; i < ingridientTags.length; i++) {
        if(title.indexOf(ingridientTags[i]) != -1) {
          return test.capitalizeFirstLetter(ingridientTags[i]);
        }
      }
    }

    if(typeTags != undefined && typeTags.length > 0){
      for(var i = 0; i < typeTags.length; i++) {
        if(title.indexOf(typeTags[i]) != -1) {
          return test.capitalizeFirstLetter(typeTags[i]);
        }
      }
    }

    if(mealTags != undefined && mealTags.length > 0){
      for(var i = 0; i < mealTags.length; i++) {
        if(title.indexOf(mealTags[i]) != -1) {
          return test.capitalizeFirstLetter(mealTags[i]);
        }
      }
    }

    if(ingridientTags != null && ingridientTags.length > 0) {
      return test.capitalizeFirstLetter(ingridientTags[0]);
    }

    if(typeTags != null && typeTags.length > 0) {
      return test.capitalizeFirstLetter(typeTags[0]);
    }

    if(mealTags != null && mealTags.length > 0) {
      return test.capitalizeFirstLetter(mealTags[0]);
    }

    return null;
  },
  getUrl(title) {
    // convert special charcters
    var url = title.toLowerCase().replace(/ /g,"-");
    url = url.replace(/[áàäâãå]/g,"a").replace(/[óòöôõ]/g,"o");
    url = url.replace(/[éèëê]/g,"e").replace(/[úùüû]/g,"u").replace(/[íìïî]/g,"i");
    return url.replace(/[^a-z-]/g, "").replace(/(-)\1+/g, '$1');
  },
  capitalizeFirstLetter(txt) {
    return txt.charAt(0).toUpperCase() + txt.slice(1);
  },
  getCrumbItem(urlPart, title, level) {
			// get formatted bread crumb
			var url = "https://www.ica.se";
			if(level > 0){
				url += "/recept/" + urlPart;
			}
			title = level > 0 ? " / " + title : title;
			return $("<li/>").append("<a href='" + url + "'>" + title + "</a>");
		},
    getRecipeInfo() {
			// get information about current recipe
			var id = $('meta[name=Id]').attr("content");
			var name = $('meta[name=RecipeName]').attr("content");
			var url = test.getUrl(name) + "-" + id;
			return { name: name, url: url};
		},
  manipulateDom() {
    // get current category
    var category = test.getCategory();
    if(category == null) { // no category found, no recipe
      return;
    }

    // create elements
    var $bc = $("<ul />");
    $bc.addClass("breadcrumb");

    $bc.append(test.getCrumbItem("", "ICA", 0));
    $bc.append(test.getCrumbItem("", "Recept", 1));

    $bc.append(test.getCrumbItem(test.getUrl(category), category, 2));
    var recipe = test.getRecipeInfo();
    $bc.append(test.getCrumbItem(recipe.url, recipe.name, 3));

    // add elements
    $("body").prepend($bc);
  }
};

$(document).ready(() => {
  Object.assign(test, CROUTIL());
  test.manipulateDom();
});
