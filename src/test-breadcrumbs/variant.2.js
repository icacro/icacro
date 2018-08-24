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
//import './style.css';

const breadcrumbs = {
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
      return breadcrumbs.capitalizeFirstLetter(result == null ? categories[0] : result);
    }
    return null;
  },

  getCategory() {
    //check if traffic is direct
    //alert(document.referrer);

    var category = null;

    // look for meta 'Typ av recept', check prio list or use first
    category = breadcrumbs.findTopCategory($("#bottom-bar meta[name='Typ av recept']"), breadcrumbs.topTypeCategories);
    if(category != null) {
      return category;
    }

    // look for meta 'Ingrediens', check prio list or use first
    category = breadcrumbs.findTopCategory($("#bottom-bar meta[name=Ingrediens]"), breadcrumbs.topIngredientCategories);
    if(category != null) {
      return category;
    }

    // look for meta 'Måltid', check prio list or use first
    category = breadcrumbs.findTopCategory($("#bottom-bar meta[name=Måltid]"), breadcrumbs.topMealCategories);
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
			var id = $('#bottom-bar meta[name=Id]').attr("content");
			var name = $('#bottom-bar meta[name=RecipeName]').attr("content");
			var url = breadcrumbs.getUrl(name) + "-" + id;
			return { name: name, url: url};
		},
  manipulateDom() {
    // get current category
    var category = breadcrumbs.getCategory();
    if(category == null) { // no category found, no recipe
      return;
    }

    // create elements
    var $bc = $("<ul />");
    $bc.addClass("breadcrumb");

    $bc.append(breadcrumbs.getCrumbItem("", "ICA", 0));
    $bc.append(breadcrumbs.getCrumbItem("", "Recept", 1));

    $bc.append(breadcrumbs.getCrumbItem(breadcrumbs.getUrl(category), category, 2));
    var recipe = breadcrumbs.getRecipeInfo();
    $bc.append(breadcrumbs.getCrumbItem(recipe.url, recipe.name, 3));

    // add elements
    //Avsteg fr original
    //$("#page-wrapper .breadcrumbs-area").html('').append($bc);
    console.log($bc.text());
  }
};

// $(document).ready(() => {
//   Object.assign(test, CROUTIL());
//   breadcrumbs.manipulateDom();
// });

export default breadcrumbs;
