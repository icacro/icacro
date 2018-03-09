// ==UserScript==
// @name         Create-account
// @path         //./src/create-account/variant.js
// @namespace    http://tampermonkey.net/
// @version      0.1
// @match        https://www.ica.se/*
// @grant        none
// ==/UserScript==

'use strict';

import { CROUTIL, ELM } from '../util/main';
import { waitForContent, elements, triggerHotJar } from '../util/utils';
import './style.css';

const test = {

  showLoader(container) {
    container.find('.loader').show();
    container.find('iframe').css('opacity','0');
  },

  hideLoader(container) {
    container.find('.loader').hide();
    container.find('iframe').css('opacity','1');
  },

  iframeStep1() {
    let headerBarTimeout = window.setTimeout(hideHeaderBarStep1, 10);
    let hideHeaderBarDeferred = $.Deferred();
    $.when(hideHeaderBarDeferred).done(function() {
      test.hideLoader($('.cro-iframe-container'));
    });
    function hideHeaderBarStep1() {
      const iframeInner = $('.cro-iframe-container iframe').contents();
      const leadContent = 'Skaffa ICA-kort och få (styling TBD, kolla text):<br>- Bonus på dina inköp<br>- Personliga erbjudanden<br>- Rabatt på resor och nöjen';
      if (test.checkHeader(iframeInner,headerBarTimeout,hideHeaderBarDeferred)) {
        iframeInner.find('body').addClass('cro-modal');
        iframeInner.find('.step-header').show();
        iframeInner.find('a').attr('target','_blank');
        iframeInner.find('form').attr('target','step2');
        iframeInner.find('.step1 p.lead').html(leadContent);
      } else {
        headerBarTimeout = window.setTimeout(hideHeaderBarStep1, 0);
      }
    }
  },

  iframeStep2() {
    let headerBarTimeout = window.setTimeout(hideHeaderBarStep2, 10);
    let hideHeaderBarDeferred = $.Deferred();
    $.when(hideHeaderBarDeferred).done(function() {
      setTimeout(function(e) {
        const step1=document.getElementById("cro-reg").contentWindow.document;
        const step2=step1.getElementById("step2").contentWindow.location.href;
        if (step2 === 'https://www.ica.se/ansokan/?step=6c6f79616c74796e6577637573746f6d6572666f726d') {
          $('.cro-iframe-container iframe').contents().find('#step2').addClass('loaded');
          test.hideLoader($('.cro-iframe-container iframe').contents().find('.cro-step2-container'));

          $('.cro-iframe-container iframe').contents().find('html,body').animate({
            scrollTop: $('.cro-iframe-container iframe').contents().find('#step2').offset().top - 10
          }, 500);

        } else if (step2 === 'https://www.ica.se/ansokan/?step=6578697374696e67637573746f6d657261726561') {
          step1.location = step2;
        } else {
          top.location = step2;
        }
      },500);
    });
    function hideHeaderBarStep2() {
      const iframeInner=$('.cro-iframe-container iframe').contents().find('#step2').contents();
      if (test.checkHeader(iframeInner,headerBarTimeout,hideHeaderBarDeferred)) {
        iframeInner.find('body').addClass('cro-modal');
        iframeInner.find('a').attr('target','_blank').removeClass('modal modal-loaded');
        iframeInner.find('a[href="#terms"]').attr('href','https://www.ica.se/PageFiles/80195/VILLKOR_ICABanken_REKPCX2064_ICA_bonus_formanskund_A4.pdf?epslanguage=sv');
        iframeInner.find('a[href="#create-pultext-modal"]').attr('href','https://www.ica.se/policies/behandling-av-personuppgifter/');
        iframeInner.find('form').attr('target','cro-reg');
      } else {
        headerBarTimeout = window.setTimeout(hideHeaderBarStep2, 0);
      }
    }
  },

  checkHeader(iframeInner,headerBarTimeout,hideHeaderBarDeferred) {
    const e = iframeInner.find('.easy-signup-header');
    if (e.length) {
      window.clearTimeout(headerBarTimeout);
      hideHeaderBarDeferred.resolve();
      return true;
    }
  },

  loadModal() {
    const iframeContainer = ELM.get('.cro-iframe-container');
    const iframeContent = '<span class="loader"></span><iframe id="cro-reg" name="cro-reg" src="//www.ica.se/ansokan/?step=6369766963666f726d" frameborder="0"></iframe>';
    iframeContainer.append(iframeContent);
    const iframe = $('.cro-iframe-container iframe');
    iframe.on('load', function () {
      const iframeInner = iframe.contents();
      if(this.contentWindow.location.href.indexOf('ansokan') !== -1) {
        test.iframeStep1();
        const step2container = $('<div class="cro-step2-container pl"><span class="loader"></span><iframe id="step2" name="step2" src="" frameborder="0"></iframe></div>');
        step2container.insertAfter(iframeInner.find('.step1 .form-wrapper'));
      }
      test.addEventListeners(iframeInner);
    });
  },

  addEventListeners(iframeInner) {
    iframeInner.find('form').on('submit', function(e) {
      if(iframeInner.find('.icon-checkmark:visible').length) {
        iframeInner.find('.payWithCard, .form-wrapper .form li:last-child').hide();
        test.showLoader(iframeInner.contents().find('.cro-step2-container'));
        test.iframeStep2();
      }
    });
    iframeInner.contents().find('#step2').contents().find('form').on('submit', function(e) {
      //???
    });
  },

  createModal() {
    const container = $('.cro-iframe-container');
    const modal = new coreComponents.modal({
      tpl: container.get(0),
      size: 'md',
      container: $('.modal-container').get(0)
    });
    setTimeout(function () {
      test.showLoader(container);
      test.loadModal();
    }, 50);
  },

  manipulateDom() {
    const iframeContainer = ELM.create('div cro-iframe-container');
    ELM.get('body').append(iframeContainer);
  },

};

$(document).ready(() => {

  if (window.self === window.top) {
    const createAccount = $('.top-bar .top-bar__right .quick-login a[href="/ansokan/"]');
    if (createAccount.length) {
      Object.assign(test, CROUTIL());
      test.manipulateDom();
      createAccount.click((e) => {
        e.preventDefault();
        test.createModal();
      });
    }
    //fler länkar?
  }

});
