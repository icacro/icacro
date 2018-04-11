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
    container.find('.loader').css('display','block');
    container.find('iframe').css('opacity','0');
  },

  hideLoader(container) {
    container.find('.loader').css('display','none');
    container.find('iframe').css('opacity','1');
  },

  iframeDone(iframeType) {
    let iframeInner = test.getIframeInner(iframeType);

    if(iframeType === 'step1') {
      const leadNew = '<p class="lead">Skaffa ICA-kort och få personliga erbjudanden<a href="/ansokan/tacksida/">!</a></p>';
      iframeInner.find('body').addClass('cro-step1');
      iframeInner.find('a.payWithCardLink').attr('target','_blank');

      //Även koll av skärmbredd?

      $('body').hasClass('cro-ios') ? iframeInner.find('form').attr('target','_parent') : iframeInner.find('form').attr('target','step2');

      iframeInner.find('.step1').prepend(leadNew);
    } else if(iframeType === 'step2') {
      iframeInner.find('body').addClass('cro-step2');
      const step1=document.getElementById("cro-reg").contentWindow.document;
      const step2=step1.getElementById("step2").contentWindow.location.href;
      if (step2 === 'https://www.ica.se/ansokan/?step=6c6f79616c74796e6577637573746f6d6572666f726d') {
        $('.cro-iframe-container iframe').contents().find('.payWithCard, .form-wrapper .form li:first-child label span').html('<a href="//www.ica.se/ansokan/?step=6369766963666f726d" target="cro-reg" class="backToStep1 small"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0.014599280431866646 -0.01454699132591486 31.977949142456055 31.999547958374023" id="edit" width="100%" height="100%"><path d="M31.878 30.051c.215.573.129 1.06-.272 1.461-.315.315-.644.473-1.002.473-.172 0-.358-.029-.53-.1a462.04 462.04 0 0 0-11.328-3.795 2.423 2.423 0 0 1-.63-.401L.501 9.974c-.272-.243-.415-.559-.473-.931a1.537 1.537 0 0 1 .229-1.031c1.017-1.647 2.162-3.065 3.437-4.268C4.897 2.541 6.401 1.381 8.219.25c.73-.415 1.389-.344 1.962.229l17.615 17.715c.2.158.329.372.401.63 2.205 6.717 3.423 10.454 3.68 11.228m-7.489-3.366l2.363-2.363a151.483 151.483 0 0 1-1.461-4.397L8.835 3.271c-.2.158-.501.401-.888.745s-.659.587-.816.716l15.925 15.925c.286.315.43.673.415 1.06a1.497 1.497 0 0 1-.487 1.06c-.315.315-.644.473-1.002.473-.473 0-.845-.143-1.131-.43L4.869 6.795A15.324 15.324 0 0 0 3.365 8.7L19.82 25.226c.286.086.988.301 2.077.644 1.117.344 1.933.616 2.492.816"></path></svg></a>').addClass('backactive');
        test.hideLoader($('.cro-iframe-container iframe').contents().find('.cro-step2-container'));
        iframeInner.find('a').attr('target','_blank').removeClass('modal modal-loaded');
        iframeInner.find('a[href="#terms"]').attr('href','https://www.ica.se/PageFiles/80195/VILLKOR_ICABanken_REKPCX2064_ICA_bonus_formanskund_A4.pdf?epslanguage=sv');
        iframeInner.find('a[href="#create-pultext-modal"]').attr('href','https://www.ica.se/policies/behandling-av-personuppgifter/');
        iframeInner.find('form').attr('target','cro-reg');
        setTimeout(function() {
          $('.cro-iframe-container iframe').contents().find('#step2').addClass('loaded');
          $('.cro-iframe-container iframe').contents().find('html,body').animate({
            scrollTop: $('.cro-iframe-container iframe').contents().find('#step2').offset().top - 92
          }, 500).delay(250);
        },50);
      } else if (step2 === 'https://www.ica.se/ansokan/?step=6578697374696e67637573746f6d657261726561') {
        step1.location = step2;
      } else if (step2 === 'https://www.ica.se/ansokan/?step=6369766963666f726d') {
        step1.location = step2;
      } else {
        top.location = step2;
      }
    }

    test.hideLoader($('.cro-iframe-container'));
  },

  loadIframe(iframeType) {
    let iframeInner = test.getIframeInner(iframeType);
    let headerBarTimeout = window.setTimeout(hideHeaderBar, 10);
    let hideHeaderBarDeferred = $.Deferred();
    $.when(hideHeaderBarDeferred).done(function() {
      test.iframeDone(iframeType);
    });
    function hideHeaderBar() {
      let iframeInner=test.getIframeInner(iframeType);
      const e = iframeInner.find('.easy-signup-header');
      if (e.length) {
        window.clearTimeout(headerBarTimeout);
        hideHeaderBarDeferred.resolve();
        return true;
      } else {
        headerBarTimeout = window.setTimeout(hideHeaderBar, 0);
      }
    }
  },

  getIframeInner(iframeType) {
    let iframeInner;
    if(iframeType === 'step2') {
      iframeInner = $('.cro-iframe-container iframe').contents().find('#step2').contents();
    } else {
      iframeInner = $('.cro-iframe-container iframe').contents();
    }
    return iframeInner;
  },

  loadModal() {
    const modalCover = $('<div></div>').addClass('pl-modal-cover');
    modalCover.insertBefore($('.pl .pl-modal .pl-modal__window'));
    const iframeContainer = ELM.get('.cro-iframe-container');
    const iframeContent = '<span class="loader"></span><iframe id="cro-reg" name="cro-reg" src="" frameborder="0"></iframe>';
    iframeContainer.html(iframeContent);
    const iframe = $('.cro-iframe-container iframe');
    iframe.attr('src','https://www.ica.se/ansokan/?step=6369766963666f726d');
    iframe.load(function () {
      if(this.contentWindow.location.href.indexOf('ansokan/?step=6369766963666f726d') !== -1) {
        test.loadIframe('step1');
        const step2container = $('<div class="cro-step2-container pl"><span class="loader"></span><iframe id="step2" name="step2" src="" frameborder="0"></iframe></div>');
        const iframeInner = iframe.contents();
        step2container.insertAfter(iframeInner.find('.step1 .form-wrapper'));
      }
      test.addEventListeners();
    });
  },

  addEventListeners() {
    const iframeInner = $('.cro-iframe-container iframe').contents();
    iframeInner.find('form').on('submit', function(e) {
      if(iframeInner.find('.icon-checkmark:visible').length) {
        iframeInner.find('.payWithCard, .form-wrapper .form li:last-child').hide();
        test.showLoader(iframeInner.find('.cro-step2-container'));
        //load step2
        test.loadIframe('step2');
      }
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
      test.showLoader($('.cro-iframe-container'));
      test.loadModal();
    }, 50);
  },

};

$(document).ready(() => {
  $('body').addClass('cro');

  const ua = window.navigator.userAgent;
  const iOS = !!ua.match(/iP(ad|hone)/i);
  if (iOS) $('body').addClass('cro-ios');

  if (window.self === window.top) {

    if(window.location.href.indexOf('ansokan/?step=6c6f79616c74796e6577637573746f6d6572666f726d') !== -1) {

      $('body').addClass('cro-modal');
      const closeButton = $('<div class="pl"><div class="pl-modal"><a onclick="history.back()" class="button button--icon pl-modal__close-button"><svg xmlns="http://www.w3.org/2000/svg" viewBox="3.092778444290161 4.548774719238281 17.0854434967041 17.08416748046875"><path d="M15.224 13.091l4.582 4.606q.315.291.364.691t-.194.667q-1.042 1.333-2.376 2.376-.267.242-.667.194t-.715-.339l-4.582-4.606-4.606 4.606q-.291.291-.691.339t-.691-.194q-1.309-1.042-2.352-2.352-.242-.291-.194-.691t.339-.691l4.606-4.606-4.582-4.582q-.315-.315-.364-.715t.194-.667q1.018-1.309 2.352-2.376.291-.242.691-.194t.691.364l4.606 4.388 4.582-4.388q.315-.315.715-.364t.667.194q1.333 1.042 2.376 2.376.242.267.194.667t-.364.715z"></path></svg></a></div></div>');
      $('#page-wrapper').prepend(closeButton);

    } else {

      const createAccount = ELM.get('.top-bar .top-bar__right .quick-login a[href="/ansokan/"]');

      if(createAccount.exist()) {
        createAccount.css('modal-application');
      }

      let checkAccount;
      if (/^https:\/\/www.ica.se\/$/.test(window.location)) {
        checkAccount = ELM.get('.quicklink-list a[href="http://www.ica.se/ica-kort/"]');

      // Skippar loginsidan?
      //} else if (/^https:\/\/www.ica.se\/logga-in/.test(window.location)) {
      //  checkAccount = ELM.get('.right-link a');

      } else if (/^https:\/\/www.ica.se\/ica-kort/.test(window.location)) {
        if (/^https:\/\/www.ica.se\/ica-kort\/$/.test(window.location)) {
          checkAccount = ELM.get('.imagebox a');
        } else {
          checkAccount = ELM.get('.page a[href="/ansokan/"]');
        }
      } else if (/^https:\/\/www.ica.se\/erbjudanden\/nojeserbjudanden/.test(window.location)) {
        checkAccount = ELM.get('.ica-card-module .text-card a');
      }

      if(checkAccount) {
        checkAccount.css('modal-application');
      }

      let modalApplication = $('.modal-application');

      if (modalApplication.length) {
        Object.assign(test, CROUTIL());
        const iframeContainer = ELM.create('div cro-iframe-container');
        ELM.get('body').append(iframeContainer);
        modalApplication.click((e) => {
          e.preventDefault();
          test.createModal();
        });
      }

    }

  } else if (window.frameElement.getAttribute('name') === 'cro-reg' || window.frameElement.getAttribute('name') === 'step2') {

    ELM.get('body').css('cro-modal');

    if (/^https:\/\/www.ica.se\/ansokan\/tacksida/.test(window.location)) {
      const column = $('.grid_fluid .column');
      $('.is-skt').removeClass('is-skt');
      $('.step-header').show().html('<h1>Nu är det fixat!</h1>');
      column.wrap('<a href="#" class="confpage-link"></a>');
      for (var i = 0; i < column.length; i++) {
        const originalLink = $(column[i]).find('a');
        const target = originalLink.attr('href');
        $(column[i]).parent().attr('href',target);
        originalLink.remove();
      }
    }

    $('ul.choices .has_card a').attr('href','/inloggning/jag-vet-inte-vad-jag-har-for-losenord/')
    $('.faq a').attr('target','_blank');
  }

});
