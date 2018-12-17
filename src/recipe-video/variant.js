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
    if (document.querySelector('.recipepage')) {
      let recipe='', smallImage=0, poster;

      if (/^https:\/\/www.ica.se\/recept\/clementinpannacotta-722892\/$/.test(window.location)) {
        recipe = 'clementinpannacotta';
        document.querySelector('h1.recipepage__headline').innerHTML = 'Clementin&shy;pannacotta';
        poster = '//icase.azureedge.net/imagevaultfiles/id_172666/cf_259/clementinpannacotta-722927-580x580.jpg';
      } else if (/^https:\/\/www.ica.se\/recept\/cornflakesgodis-722914\/$/.test(window.location)) {
        recipe = 'cornflakes-godis';
        poster = '//icase.azureedge.net/imagevaultfiles/id_172270/cf_259/cornflakesgodis-722914_1_580x580px.jpg';
      } else if (/^https:\/\/www.ica.se\/recept\/gratinerad-hummer-med-vasterbottensost-722889\/$/.test(window.location)) {
        recipe = 'gratinerad-hummer-med-vasterbottensost';
        poster = '//icase.azureedge.net/imagevaultfiles/id_172717/cf_259/gratinerad-hummer-med-vasterbottensost-722924-580x.jpg';
      } else if (/^https:\/\/www.ica.se\/recept\/karamelliserade-paron-med-adelost-724415\/$/.test(window.location)) {
        recipe = 'karamelliserade-paron';
        poster = '//icase.azureedge.net/imagevaultfiles/id_190986/cf_259/karamelliserade-paron-med-adelost-och-pepparkakor-.jpg';
      } else if (/^https:\/\/www.ica.se\/recept\/griljera-kycklingjulskinka-724416\/$/.test(window.location)) {
        recipe = 'kycklingjulskinka';
        poster = '//icase.azureedge.net/imagevaultfiles/id_191308/cf_259/griljera-kycklingjulskinka-724416_580x580.jpg';
      } else if (/^https:\/\/www.ica.se\/recept\/mozartkulor-722922\/$/.test(window.location)) {
        recipe = 'mozartkulor';
        poster = '//icase.azureedge.net/imagevaultfiles/id_172499/cf_259/mozartkulor-722922-580x580.jpg';
      } else if (/^https:\/\/www.ica.se\/recept\/peach-melba-krans-med-marang-och-kanderad-mandel-721426\/$/.test(window.location)) {
        recipe = 'peach-melba';
        poster = '//icase.azureedge.net/imagevaultfiles/id_152436/cf_259/peach-melba-krans-med-marang-och-kanderad-mandel-7.jpg';
      } else if (/^https:\/\/www.ica.se\/recept\/snobollar-med-polka-722923\/$/.test(window.location)) {
        recipe = 'polkasnobollar';
        poster = '//icase.azureedge.net/imagevaultfiles/id_172505/cf_259/snobollar-med-polka-722923-580x580.jpg';
      } else if (/^https:\/\/www.ica.se\/recept\/prastostsnurror-med-hasselnotter-722891\/$/.test(window.location)) {
        recipe = 'prastostsnurror';
        poster = '//icase.azureedge.net/imagevaultfiles/id_172266/cf_259/ostsnurror-prastost-hasselnotter-722891_1_580x580p.jpg';
      } else if (/^https:\/\/www.ica.se\/recept\/tjocka-revben-i-ugn-med-ingefarsglaze-724414\/$/.test(window.location)) {
        recipe = 'revbensspjall';
        poster = '//icase.azureedge.net/imagevaultfiles/id_191306/cf_259/revben-med-ingefarsglaze-724414_580x580.jpg';
      } else if (/^https:\/\/www.ica.se\/recept\/saffransbullar-med-vanilj-714255\/$/.test(window.location)) {
        recipe = 'saffransbullar';
        poster = '//icase.azureedge.net/imagevaultfiles/id_44169/cf_259/saffransbullar-med-vanilj-714255.jpg';
        smallImage = 1;
      } else if (/^https:\/\/www.ica.se\/recept\/saffranskladdkaka-718016\/$/.test(window.location)) {
        recipe = 'saffranskladdkaka';
        poster = '//icase.azureedge.net/imagevaultfiles/id_104454/cf_259/saffranskladdkaka-718016.jpg';
        smallImage = 1;
      } else if (/^https:\/\/www.ica.se\/recept\/torskrygg-i-ugn-med-rakor-och-dillsmor-724417\/$/.test(window.location)) {
        recipe = 'torskrygg';
        poster = '//icase.azureedge.net/imagevaultfiles/id_191313/cf_259/torksrygg-i-ugn-724417_580x580.jpg';
      } else if (/^https:\/\/www.ica.se\/recept\/vegansk-fudge-722920\/$/.test(window.location)) {
        recipe = 'vegansk-fudge';
        poster = '//icase.azureedge.net/imagevaultfiles/id_172268/cf_259/vegansk-fudge-722920_1_580x580px.jpg';
      } else if (/^https:\/\/www.ica.se\/recept\/vegansk-julskinka-av-rotselleri-721241\/$/.test(window.location)) {
        recipe = 'vegansk-julskinka';
        poster = '//icase.azureedge.net/imagevaultfiles/id_150966/cf_259/vegansk-julskinka-av-rotselleri-721241-liten.jpg';
      } else if (/^https:\/\/www.ica.se\/recept\/veganska-revbensspjall-av-tofu-721242\/$/.test(window.location)) {
        recipe = 'veganska-revbensspjall';
        poster = '//icase.azureedge.net/imagevaultfiles/id_150979/cf_259/veganska-revbensspjall-av-tofu-721242.jpg';
      }

      if (recipe !== '') {
        const video = document.createElement('video');
        video.controls = true;
        video.src = 'https://assets.icanet.se/video/upload/' +  recipe + '.mp4';
        video.setAttribute('type','video/mp4');
        video.setAttribute('preload','none');
        video.setAttribute('poster',poster);

        const fullscreen = document.querySelector('.hero .hero__image__background');
        const square = document.querySelector('main .recipe-image-square__image');
        const mobile = document.querySelector('.hero .recipe-image-square__image');

        if (smallImage === 1) {
          test.activateVideo(square, video);
        } else {
          document.querySelector('#page').classList.add('recipepage--small');
          document.querySelector('#page').classList.remove('recipepage--large');
          document.querySelector('.container-backdrop header .row > .col-12').classList.add('col-md-6');
          const imgEl = document.createElement('div');
          const imgElInner = document.createElement('div');
          const imgElImage = document.createElement('div');

          const imgStyle = document.querySelector('.hero .recipe-image-square__image').getAttribute('style');

          imgEl.classList.add('col-6','col-lg-5','offset-lg-1');
          imgElInner.classList.add('recipe-image-square','recipe-image-square--small');
          imgElImage.classList.add('recipe-image-square__image');
          imgElImage.setAttribute('style',imgStyle);
          imgEl.append(imgElInner);
          imgElInner.append(imgElImage);
          document.querySelector('.container-backdrop header .row').append(imgEl);
          test.activateVideo(imgElImage, video);
          const fullscreenVideo = video.cloneNode();
          test.activateVideo(fullscreen, fullscreenVideo);

        }

        if (mobile) {
          const mobileVideo = video.cloneNode();
          test.activateVideo(mobile, mobileVideo);
        }

      }

    }
  },

  activateVideo(el,video) {
    el.append(video);
    video.addEventListener('play', function(e) {
      console.log('Play');
      //gaPush({ eventAction: 'Video', eventLabel: 'Play' });
    });
  }

};

$(document).ready(() => {
  Object.assign(test, CROUTIL());
  test.manipulateDom();
});



      // https://www.ica.se/recept/clementinpannacotta-722892/
      // https://www.ica.se/recept/cornflakesgodis-722914/
      // https://www.ica.se/recept/gratinerad-hummer-med-vasterbottensost-722889/
      // https://www.ica.se/recept/karamelliserade-paron-med-adelost-724415/
      // https://www.ica.se/recept/griljera-kycklingjulskinka-724416/
      // https://www.ica.se/recept/mozartkulor-722922/
      // https://www.ica.se/recept/peach-melba-krans-med-marang-och-kanderad-mandel-721426/
      // https://www.ica.se/recept/snobollar-med-polka-722923/
      // https://www.ica.se/recept/prastostsnurror-med-hasselnotter-722891/
      // https://www.ica.se/recept/tjocka-revben-i-ugn-med-ingefarsglaze-724414/
      // https://www.ica.se/recept/torskrygg-i-ugn-med-rakor-och-dillsmor-724417/
      // https://www.ica.se/recept/vegansk-fudge-722920/
      // https://www.ica.se/recept/vegansk-julskinka-av-rotselleri-721241/
      // https://www.ica.se/recept/veganska-revbensspjall-av-tofu-721242/

      // https://www.ica.se/recept/saffransbullar-med-vanilj-714255/    // liten bild
      // https://www.ica.se/recept/saffranskladdkaka-718016/            // liten bild
