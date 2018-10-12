// ==UserScript==
// @name         recipe-toggle-ingredients
// @path         //./src/recipe-share/variant.js
// @namespace    http://tampermonkey.net/
// @version      0.1
// @match        https://www.ica.se/recept/*
// @grant        none
// ==/UserScript==

'use strict';

import { CROUTIL } from '../util/main';
import { gaPush } from '../util/utils';
import './style.css';

const test = {

  manipulateDom() {
    if (document.querySelector('.recipe-action-buttons.col-lg-4')) {
      document.querySelector('.recipe-action-buttons').classList.remove('col-lg-4');
    }

    const copyUrl = document.createElement('div');
    copyUrl.id = 'copy-url';
    copyUrl.innerHTML = window.location.href.split('?')[0] + '?utm_source=all_share';
    document.querySelector('.recipe-action-buttons').appendChild(copyUrl);

    const copyBtn = document.createElement('a');
    copyBtn.href = '#';
    copyBtn.classList.add('button--copy','button','button--link');
    copyBtn.setAttribute('data-clipboard-text',copyUrl)

    const btnText = 'Kopiera länk';
    copyBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 512 640" enable-background="new 0 0 512 512" xml:space="preserve"><g><path d="M472.021,39.991c-53.325-53.311-139.774-53.311-193.084,0l-76.184,76.154c6.031-0.656,12.125-0.938,18.25-0.938   c19.28,0,38.028,3.063,55.777,8.968l43.17-43.155c14.827-14.843,34.545-22.999,55.513-22.999c20.97,0,40.688,8.156,55.515,22.999   c14.828,14.812,22.981,34.499,22.981,55.498c0,20.968-8.153,40.686-22.981,55.498l-84.465,84.466   C331.687,291.326,311.968,299.48,291,299.48c-21,0-40.686-8.154-55.528-22.998c-7.219-7.188-12.843-15.563-16.718-24.688   c-9.625,0.531-18.624,4.531-25.499,11.405l-22.499,22.529c6.156,11.405,14.062,22.155,23.687,31.813   c53.31,53.313,139.774,53.313,193.099,0l84.48-84.497C525.316,179.736,525.316,93.302,472.021,39.991z"/><path d="M291.905,396.76c-19.312,0-38.248-3.125-56.402-9.281l-43.467,43.469c-14.812,14.844-34.529,22.999-55.497,22.999   c-20.968,0-40.654-8.155-55.498-22.999c-14.843-14.813-22.999-34.529-22.999-55.498s8.156-40.688,22.999-55.529l84.465-84.465   c14.843-14.812,34.53-22.968,55.498-22.968c20.999,0,40.686,8.156,55.512,22.968c7.22,7.218,12.857,15.593,16.75,24.717   c9.656-0.5,18.671-4.531,25.546-11.405l22.468-22.499c-6.156-11.438-14.078-22.187-23.718-31.843   c-53.31-53.311-139.774-53.311-193.084,0l-84.465,84.497c-53.341,53.313-53.341,139.744,0,193.086   c53.31,53.313,139.744,53.313,193.053,0l76.058-76.059c-5.671,0.529-11.405,0.813-17.187,0.813L291.905,396.76L291.905,396.76z"/></g></svg> ' + btnText;
    document.querySelector('.recipe-action-buttons').insertBefore(copyBtn, document.querySelector('.button--print'));

    const txt = '<div id="copy-link-message" class="notice copy-link-hidden"><p>Länken kopierades och finns nu i dina urklipp</p><a class="notice-close sprite2" title="Stäng"></a></div>';
    $('.cro #bottom-bar').prepend(txt);
    $('.cro #bottom-bar a.notice-close').on('click', function(e) {
      $('#copy-link-message').addClass('copy-link-hidden');
    })

    copyBtn.addEventListener('click', function(event) {
      event.preventDefault();
      window.getSelection().removeAllRanges();
      const range = document.createRange();
      range.selectNode(copyUrl);
      window.getSelection().addRange(range);
      try {
        const copy = document.execCommand('copy');
      } catch(err) {
        console.log('felmeddelande');
      }
      window.getSelection().removeAllRanges();
      test.showConfirmation();
    });

      //gaPush({ eventAction: 'Kopiera länk', eventLabel: window.location.href });
      //visa bekräftelse

          // Bekräftelse motsv ordinarie notiser enligt följande kod (placera efter footer):
          // <div id="bottom-bar" class="bottom-alerts">
          //     <div class="notice" data-version="e5a8e744-e99a-4f62-8e80-d761eae82fe4" style="display: block;">
          //         <p>Länken kopierades och finns nu i dina urklipp</p>
          //         <a class="notice-close sprite2" title="Stäng"></a>
          //     </div>
          // </div>

  },
  showConfirmation() {
    $('#copy-link-message').removeClass('copy-link-hidden');
  }

};


$(document).ready(() => {
  Object.assign(test, CROUTIL());
  test.manipulateDom();
});
