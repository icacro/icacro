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

      var categories = $.map(tags, function(a) { return a.content.toLowerCase(); });
      var result = null;

      topCategories.forEach((tc) => {
        if(result == null) {
          if(categories.some(function(c) {
            return c == tc;
          })) {
            result = tc;
          }
        }
      });
      return test.capitalizeFirstLetter(result == null ? categories[0] : result);
    }
    return null;
  },

  getCategory() {
    //check if traffic is direct
    //alert(document.referrer);

    var category = null;

    // look for meta 'Typ av recept', check prio list or use first
    category = test.findTopCategory($("meta[name='Typ av recept']"), test.topTypeCategories);
    if(category != null) {
      return category;
    }

    // look for meta 'Ingrediens', check prio list or use first
    category = test.findTopCategory($("meta[name=Ingrediens]"), test.topIngredientCategories);
    if(category != null) {
      return category;
    }

    // look for meta 'Måltid', check prio list or use first
    category = test.findTopCategory($("meta[name=Måltid]"), test.topMealCategories);
    if(category != null) {
      return category;
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
