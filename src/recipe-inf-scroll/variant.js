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
//---(ev) förflytta sig i historiken - högst upp på aktuellt recept

//görsåhär-styling, funktioner
//fälla ut meta/kommentarer     .recipe-details: .nutrients, .climate
//                              section.comments .comments__list .comments__list__item-wrapper


//skriv ut - hoppar upp till första receptet
//timer
//instruktioner-avbockning
//omräknare
//lägg i inköpslista
//e-handla
//näring/klimatguide
//kommentarer
//ladda kupong / lägg i inköpslista


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

      if (currentPage.find('section.comments').exist()) {
        let commentsText;
        const commentsCount = currentPage.find('.comments__header__text--votes');
        if (commentsCount.exist()) {
          commentsText = 'Kommentarer '+ commentsCount.text();
        } else {
          commentsText = 'Kommentarer (0)';
        }
        const commentsBtn = ELM.create('div comments-toggle button--link').append(commentsText + svg).css('button');
        currentPage.find('section.comments').append(commentsBtn);
        commentsBtn.click(() => {
          commentsBtn.parent().find('.comments__inner-wrapper').toggle('open');
        })
      }

      let detailsText;
      if (currentPage.find('.recipe-details .nutrients').exist() && currentPage.find('.recipe-details .climate').exist()) {
        detailsText = 'Näringsvärde och klimatguide';
      } else if (currentPage.find('.recipe-details .nutrients').exist()) {
        detailsText = 'Näringsvärde';
      } else if (currentPage.find('.recipe-details .climate').exist()) {
        detailsText = 'Klimatguide';
      }

      if (currentPage.find('.recipe-details .nutrients').exist() || currentPage.find('.recipe-details .climate').exist()) {
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
