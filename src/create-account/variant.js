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
import Element from '../util/element';
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

  getIframeInner(iframeType) {
    let iframeInner;
    if(iframeType === 'step2') {
      iframeInner = $('.cro-iframe-container iframe').contents().find('#step2').contents();
    } else {
      iframeInner = $('.cro-iframe-container iframe').contents();
    }
    return iframeInner;
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

  loadModal() {
    const modalCover = ELM.create('div pl-modal-cover');
    modalCover.insertAfter(ELM.get('.pl .pl-modal .pl-modal__window'));

    const iframeContainer = ELM.get('.cro-iframe-container');
    const iframeContent = '<span class="loader"></span><iframe id="cro-reg" name="cro-reg" src="" frameborder="0"></iframe>';
    iframeContainer.html(iframeContent);

    const iframe = $('.cro-iframe-container iframe').attr('src','https://www.ica.se/ansokan/?step=6369766963666f726d');
    iframe.load(function () {
      test.loadIframe('step1');
      const step2container = $('<div class="cro-step2-container pl"><span class="loader"></span><iframe id="step2" name="step2" src="" frameborder="0"></iframe></div>');
      const iframeInner = iframe.contents();
      step2container.insertAfter(iframeInner.find('.step1 .form-wrapper'));
    });
  },

  loadIframe(iframeType) {
    const iframeInner = test.getIframeInner(iframeType);
    let headerBarTimeout = window.setTimeout(hideHeaderBar, 10);
    let hideHeaderBarDeferred = $.Deferred();
    $.when(hideHeaderBarDeferred).done(function() {
      test.iframeDone(iframeType);
    });
    function hideHeaderBar() {
      const iframeInner=test.getIframeInner(iframeType);
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

  iframeDone(iframeType) {

    const iframeInner = test.getIframeInner(iframeType);

    if(iframeType === 'step1') {
      const leadNew = '<p class="lead"><span class="usp-check">Bonus på dina inköp</span><span class="usp-check">Personliga erbjudanden</span><span class="usp-check">Rabatt på resor och nöjen</span></p>';
      iframeInner.find('h1').html('Välkommen som ICA-kortkund');
      iframeInner.find('body').addClass('cro-step1');
      iframeInner.find('a.payWithCardLink').attr('target','_blank');
      iframeInner.find('form').attr('target','step2');
      iframeInner.find('.step1').prepend(leadNew);
      test.hideLoader($('.cro-iframe-container'));

    } else {
      iframeInner.find('body').addClass('cro-step2');
      const step1=document.getElementById("cro-reg").contentWindow.document;
      const step2=step1.getElementById("step2").contentWindow.location.href;
      if (step2 === 'https://www.ica.se/ansokan/?step=6c6f79616c74796e6577637573746f6d6572666f726d') {
        $('.cro-iframe-container iframe').contents().find('.payWithCard, .form-wrapper .form li:first-child label span').html('<a href="#" class="backToStep1 small"><svg><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/Assets/icons/symbols.svg#edit"></use></svg></a>').addClass('backactive');
        test.hideLoader($('.cro-iframe-container iframe').contents().find('.cro-step2-container'));
        iframeInner.find('a').attr('target','_blank').removeClass('modal modal-loaded');
        iframeInner.find('.confirm-policy label').html('<span class="icon icon-checkbox checked sprite1"></span> Jag godkänner <a href="https://www.ica.se/PageFiles/80195/VILLKOR_ICABanken_REKPCX2064_ICA_bonus_formanskund_A4.pdf?epslanguage=sv" target="_blank" tabindex="0">ICAs kundvillkor</a>');
        iframeInner.find('.small-centerlink-wrapper').html('<a href="https://www.ica.se/policies/behandling-av-personuppgifter/" class="small" tabindex="0" target="_blank">Så behandlar ICA dina personuppgifter</a>');
        iframeInner.find('form').attr('target','_top');
        setTimeout(function() {
          $('.cro-iframe-container iframe').contents().find('#step2').addClass('loaded');
          $('.cro-iframe-container iframe').contents().find('html,body').animate({
            scrollTop: $('.cro-iframe-container iframe').contents().find('#step2').offset().top - 92
          }, 500).delay(250);
        },50);
      } else {
        //om redan medlem, ev andra undantag
        top.location = step2;
      }

    }
    test.addEventListeners();

  },

  addEventListeners() {

    const iframeInner = $('.cro-iframe-container iframe').contents();

    //submit från steg 1
    iframeInner.find('form').on('submit', function(e) {
      if(iframeInner.find('.icon-checkmark:visible').length) {
        iframeInner.find('.payWithCard, .form-wrapper .form li:last-child').hide();
        test.showLoader(iframeInner.find('.cro-step2-container'));
        test.loadIframe('step2');
      }
    });

    //backa/ändra pnr från steg 2 till steg 1
    iframeInner.on('click', '.backToStep1', function(e) {
      test.loadModal();
    });

  }

};

$(document).ready(() => {

  $('body').addClass('cro');

  //inte iframe/i flödet
  if (window.self === window.top) {

    //länk i avatarmeny
    const createAccount = ELM.get('.top-bar .top-bar__right .quick-login a[href="/ansokan/"]');
    if(createAccount.exist()) {
      createAccount.css('modal-application');
    }

    //länkar på startsida, Allt om ICA-kort, Ansök om ICA-kort och nöjeserbjudanden
    let checkAccount;
    let testlink;
    if (/^https:\/\/www.ica.se\/$/.test(window.location)) {
      checkAccount = ELM.get('.quicklink-list a[href="http://www.ica.se/ica-kort/"]');
    } else if (/^https:\/\/www.ica.se\/ica-kort/.test(window.location)) {
      if (/^https:\/\/www.ica.se\/ica-kort\/$/.test(window.location)) {
        testlink = ELM.get('.imagebox a');
      } else {
        testlink = ELM.get('.page a[href="/ansokan/"]');
      }
      if(testlink.exist()) {
        checkAccount = testlink;
      }
    } else if (/^https:\/\/www.ica.se\/erbjudanden\/nojeserbjudanden/.test(window.location)) {
      testlink = ELM.get('.ica-card-module .text-card a');
      if(testlink.exist()) {
        checkAccount = testlink;
      }
    }
    if(checkAccount) {
      checkAccount.css('modal-application');
    }

    //Om ansökningslänkar finns
    const modalApplication = $('.modal-application');
    if (modalApplication.length) {
      Object.assign(test, CROUTIL());
      const iframeContainer = ELM.create('div cro-iframe-container');
      ELM.get('body').append(iframeContainer);
      modalApplication.click((e) => {
        e.preventDefault();
        test.createModal();
      });
    }

  //om inne i flödet (iframe)
  } else if (window.frameElement.getAttribute('name') === 'cro-reg' || window.frameElement.getAttribute('name') === 'step2') {
    ELM.get('html').css('cro-modal'); //pga bef bakgrundsstyling
    ELM.get('body').css('cro-modal');

  }

});
