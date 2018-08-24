// ==UserScript==
// @name         recipe-toggle-ingredients
// @path         //./src/recipe-inf-scroll/variant.js
// @namespace    http://tampermonkey.net/
// @version      0.1
// @match        https://www.ica.se/recept/*
// @grant        none
// ==/UserScript==

'use strict';

import { CROUTIL, ELM } from '../util/main';
import { triggerHotJar, gaPush } from '../util/utils';
import './style.css';

let recipesArr = [];
const maxlength = 25;
let nextPage,currentPage,nextUrl;

//bugg tom loadingarea? tillbaka till 1 och fram igen?
//---(ev) förflytta sig i historiken - hamna högst upp på aktuellt recept

//OK____skriv ut
//portionsomräknare
//OK____görsåhär-styling
//"För alla" m.m. (kvarvarande ol ok?)
//timer
//lägg i inköpslista
//ladda kupong
//e-handla
//näring/klimatguide
//kommentarer


const test = {

  manipulateDom() {

    const currentUrl = window.location.pathname;
    const page = ELM.get('#page');
    const pageNext = page;
    page.attr('data-count',1)

    recipesArr.push(currentUrl);

    test.gotoPage(pageNext,page,currentUrl);

  },

  gotoPage(pageNext,page,currentUrl) {

    const pageWrapper = ELM.get('#page-wrapper');

    currentPage = pageNext;
    const prevPage = page;
    const pages = document.querySelectorAll('.page');
    const pageCount = pages.length;

    if (currentPage.find('h1').exist()) {

      const loadingAreaTitle = ELM.create('p loading-area-title');
      const loadingArea = ELM.create('div loading-area');
      loadingArea.append(loadingAreaTitle);
      const title  = currentPage.find('h1').text();
      const pagePosition = currentPage.offsetTop;
      const svg = '<svg><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/Assets/icons/sprite.svg#arrow-down"></use></svg>';

      const printBtn = currentPage.find('.button--print');
      if (printBtn.exist()) {
        printBtn.removeAttr('href');
        printBtn.click(() => {
          window.print();
        })
      }

      const howtoSection = currentPage.find('howto-steps');
      if (howtoSection.exist()) {
        const howTo = ELM.create('div howto-steps');
        const howtoItems = document.querySelectorAll('.recipe-howto-steps ol > li');
        for (var i = 0; i < howtoItems.length; i++) {
          const cookingStepCheck = ELM.create('div cooking-step__check').append(ELM.create('label checkbox checkbox--circle').attr('tabindex','0').append(ELM.create('input checkbox__input js-track-cookmode-stepcompleted').attr('type','checkbox').attr('tabindex','-1').attr('data-tracking','{&quot;step&quot;:' + (i+1) + '}')).append(ELM.create('span checkbox__label')));
          const cookingStepContent = ELM.create('div cooking-step__content').append(ELM.create('div cooking-step__content__instruction').append(howtoItems[i].innerHTML));
          howTo.append(ELM.create('div cooking-step').append(cookingStepCheck).append(cookingStepContent));
          let completed = 0;
          cookingStepCheck.click(() => {
            if (completed === 0) {
              cookingStepCheck.parent().css('completed');
              window.setTimeout(function () {
                completed = 1;
              },20);
            } else {
              cookingStepCheck.parent().removeClass('completed');
              window.setTimeout(function () {
                completed = 0;
              },30);
            }
          })
        }
        howtoSection.parent().append(howTo.append(howtoSection));
        document.querySelector('howto-steps ol').remove();
        const wrapper = document.querySelector('howto-steps');
        wrapper.outerHTML = wrapper.innerHTML;
      }

      //innehåller ngt som totalkraschade 23 augusti...

      const servingsPicker = currentPage.find('.servings-picker--static');
      if (servingsPicker.exist()) {
        const servingsWrapper = servingsPicker.parent();
        document.querySelector('.servings-picker--static').innerHTML='';
        const customServings = ELM.create('div custom-select').append('<select name="portions" id="currentPortions" class="js-servingspicker"><option class="servings-picker__servings" value="2">2 portioner</option><option class="servings-picker__servings" value="4">4 portioner</option><option class="servings-picker__servings" value="6">6 portioner</option><option class="servings-picker__servings" value="8">8 portioner</option><option class="servings-picker__servings" value="10">10 portioner</option><option class="servings-picker__servings" value="12">12 portioner</option></select>');
        servingsPicker.css('servings-picker--dynamic').removeClass('servings-picker--static').append(customServings);

        const ingredientsHeader = ELM.create('div ingredients__header').append(currentPage.find('.ingredients--dynamic h2'));

        const ingredientsContent = ELM.create('div ingredients__content');
        currentPage.find('.ingredients--dynamic').append(servingsPicker).append(ingredientsHeader).append(ingredientsContent);

        const ingredientList = currentPage.find('.ingredients--dynamic').children('ul, strong');

        for (var i = 0; i < ingredientList.length; i++) {
          ingredientsContent.append(ingredientList[i]);
        }

      }

      const commentsSection = currentPage.find('section.comments');
      if (commentsSection.exist()) {
        let commentsText;
        const commentsCount = currentPage.find('.comments__header__text--votes');
        if (commentsCount.exist()) {
          commentsText = 'Kommentarer '+ commentsCount.text();
        } else {
          commentsText = 'Kommentarer (0)';
        }
        const commentsBtn = ELM.create('div comments-toggle button--link').append(commentsText + svg).css('button');
        commentsSection.append(commentsBtn);
        commentsBtn.click(() => {
          commentsBtn.parent().find('.comments__inner-wrapper').toggle('open');
        })
      }

      const nutrientsSection = currentPage.find('.recipe-details .nutrients');
      const climateSection = currentPage.find('.recipe-details .climate');
      if (nutrientsSection.exist() || climateSection.exist()) {
        let detailsText;
        if (nutrientsSection.exist() && climateSection.exist()) {
          detailsText = 'Näringsvärde och klimatguide';
        } else if (nutrientsSection.exist()) {
          detailsText = 'Näringsvärde';
        } else if (climateSection.exist()) {
          detailsText = 'Klimatguide';
        }
        const detailsBtn = ELM.create('div details-toggle button--link').append(detailsText + svg).css('button');
        currentPage.find('.recipe-details').append(detailsBtn);
        detailsBtn.click(() => {
          detailsBtn.parent().find('.row').toggle('open');
        });
      }

      if (pageCount >= maxlength) {
        document.getElementById('footer').classList.add('visible');
      } else {
        nextPage = ELM.create('div page page-mod-fullwidth pl recipepage').attr('id','page-next');
        if (recipesArr.length < maxlength) {
          const relatedList = document.querySelectorAll('#page .related-recipes-list > a');
          for (var i = 0; i < relatedList.length; i++) {
            recipesArr.push(relatedList[i].getAttribute('href'));
          }
          recipesArr = test.removeDuplicates(recipesArr);
        }
        nextUrl = recipesArr[recipesArr.indexOf(currentUrl)+1];
        test.loadNextPage(nextUrl);
        currentPage.append(loadingArea);
        nextPage.attr('data-href',nextUrl);
        pageWrapper.append(nextPage);
      }

      if (currentPage !== prevPage) {
        currentPage.attr('id','page');
        prevPage.attr('id','page-' + prevPage.attr('data-count'));
        test.changeURL(pagePosition,title,currentUrl);
        currentPage.attr('data-count',pageCount);
      } else {
        currentPage.attr('data-count','1');
        currentPage.attr('data-href',currentUrl);
      }

      $(window).on('scroll', _.throttle(function() {
        test.scrollListener(loadingArea,nextPage,pageWrapper,nextUrl,currentPage,pageCount);
      }, 200));

      $('body').on('click','.page .loading-area.added .loading-area-title', function() {
        const elem = $(this).closest('.page').next().attr('id');
        test.scrollToElement(elem);
      });

    } else {
      document.querySelector('#page .loading-area .loading-area-title').innerHTML='Vi lyckades tyvärr inte ladda nästa recept.<br><a href="' + currentPage.attr('data-href') + '">Prova igen!</a>';
      document.querySelector('#page .loading-area').classList.add('reload');
    }

    // window.onpopstate = function(event) {
    //   window.setTimeout(function () {
    //     console.log(window.location.pathname);
    //     window.location.replace(window.location.pathname);
    //   }, 50);
    // };

  },

  removeDuplicates(recipesArr){
    recipesArr = Array.from(new Set(recipesArr))
    return recipesArr
  },

  loadNextPage(url) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        var resp = request.responseText;
        var parser = new DOMParser();
        var xmlDoc = parser.parseFromString(resp,"text/html");
        var tds = xmlDoc.getElementById("page");
        var title = xmlDoc.title;
        title = '<span>Nästa recept:</span> ' + title.substring(0, title.indexOf('|'));
        var arrow = '<div class="svg"><svg width="32px" height="32px"><use xlink:href="/Assets/icons/symbols.svg#arrow-down"></use></svg><span class="loader"></span></div>';
        document.getElementById('page-next').innerHTML=tds.innerHTML;
        document.querySelector('#page .loading-area .loading-area-title').innerHTML=title + arrow;
        if (tds.classList.contains('recipepage--large')) {
          document.getElementById('page-next').classList.add('recipepage--large');
        } else {
          document.getElementById('page-next').classList.add('recipepage--small');
        }
      } else {
        //felhantering?
      }
    };
    request.onerror = function() {
      //felhantering?
    };
    request.send();
  },

  changeURL(pagePosition,title,currentUrl) {
    const stateObj = { position: pagePosition };
    document.title = title;
    history.pushState(stateObj, title, currentUrl);
  },

  scrollListener(loadingArea,nextPage,pageWrapper,nextUrl,currentPage,pageCount) {
    if (document.getElementById('page')) {
     const cur = document.getElementById('page');
     const pageHeight = cur.offsetHeight;
     const startPos = cur.offsetTop - 70;
     const endPos = startPos + pageHeight - 300;
     const currentPos = window.pageYOffset + window.innerHeight;
     if (currentPos < startPos) {
       test.goToPrevPage(cur);
     } else if (currentPos > endPos) {
       if(window.scrollY + window.innerHeight >= document.body.scrollHeight - 300) {
         if (!loadingArea.hasClass('added')) {
           loadingArea.css('added');
           window.setTimeout(function () {
             test.gotoPage(nextPage,currentPage,nextUrl);
           }, 1000);
         }
       } else {
         test.goToNextPage(cur);
       }
     }
   }
  },

  goToNextPage(cur) {
    if (cur.nextSibling.id && cur.nextSibling.id !== 'page-next' && cur.nextSibling.id !== 'page') {
      if (cur.getAttribute('data-count') > 1) {
        if ((parseInt(cur.getAttribute('data-count')) + 1) <= document.querySelectorAll('.page:not(#page-next)').length) {
          cur.id = 'page-' + cur.getAttribute('data-count');
          cur.nextSibling.id = 'page';
          test.changeURL('0',cur.nextSibling.getElementsByTagName('h1')[0].innerHTML,cur.nextSibling.getAttribute('data-href'));
        }
      }
    } else if (cur.nextSibling.id !== 'page-next' && cur.nextSibling.id !== 'page' && document.querySelectorAll('.page:not(#page-next)').length > 1) {
      document.querySelector('#page-wrapper .page:first-child').id = 'page-1';
      const next = document.querySelector('#page-wrapper .page:nth-child(2)');
      next.id = 'page';
      test.changeURL('0',next.getElementsByTagName('h1')[0].innerHTML,next.getAttribute('data-href'));
    }
  },

  goToPrevPage(cur) {
    cur.id = 'page-' + cur.getAttribute('data-count');
    if (cur.getAttribute('data-count') > 2) {
      cur.previousSibling.id = 'page';
      test.changeURL('0',cur.previousSibling.getElementsByTagName('h1')[0].innerHTML,cur.previousSibling.getAttribute('data-href'));
    } else {
      const first = document.getElementById('page-1');
      first.id = 'page';
      cur.id = 'page-2';
      test.changeURL('0',first.getElementsByTagName('h1')[0].innerHTML,first.getAttribute('data-href'));
    }
  },

  scrollToElement(elem) {
    const elPosition = document.getElementById(elem).offsetTop;
    $('html,body').animate({
			 scrollTop: elPosition
		}, 400);
  },

};

$(document).ready(() => {
  Object.assign(test, CROUTIL());
  test.manipulateDom();
});
