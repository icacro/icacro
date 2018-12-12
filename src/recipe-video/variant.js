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

      const video = document.createElement('video');
      //const videos = '<source src="https://cdn.rawgit.com/icacro/icacro/v1.0.342/src/recipe-video/flower.mp4" type="video/mp4">';
      video.controls = true;
      video.src = 'https://cdn.rawgit.com/icacro/icacro/v1.0.342/src/recipe-video/flower.mp4';
      video.type = 'video/mp4';

      //<video loop autoplay controls="true" width='100%' height='100%' src='//some_video.mp4' type='video/mp4'></video>

      //video.innerHTML = videos;
      const mobileVideo = video.cloneNode();
      //mobileVideo.innerHTML = videos;

      const fullscreen = document.querySelector('.hero__image__background');
      const square = document.querySelector('main .recipe-image-square__image');
      const mobile = document.querySelector('.hero .recipe-image-square__image');

      if (fullscreen) {
        test.activateVideo(fullscreen, video);
      }
      if (square) {
        test.activateVideo(square, video);
      }
      if (mobile) {
        test.activateVideo(mobile, mobileVideo);
      }

    }
  },

  activateVideo(el,video) {
    el.append(video);
    video.addEventListener('play', function(e) {
      console.log('play');
      //gaPush({ eventAction: 'Video' });
    });
    video.addEventListener('pause', function(e) {
      console.log('pause');
      //gaPush({ eventAction: 'Video' });
    });
  }

};

$(document).ready(() => {
  Object.assign(test, CROUTIL());
  test.manipulateDom();
});
