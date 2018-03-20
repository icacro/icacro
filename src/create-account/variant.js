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

//TODO
//Mobiltest
//Browsertest
//Tacksida i _top???
//Slutför ansökan-test


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

    const iframeInner = test.getIframeInner(iframeType);

    if(iframeType === 'step1') {
      //OBS! Bort med länken!!!!
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
        iframeInner.find('form').attr('target','_parent');

        //TEMP BYT UT TILL HELT EGEN - GÖR OM FORM-TAGGEN
        //iframeInner.find('form').html('<input type="submit">');

        setTimeout(function() {
          $('.cro-iframe-container iframe').contents().find('#step2').addClass('loaded');
          $('.cro-iframe-container iframe').contents().find('html,body').animate({
            scrollTop: $('.cro-iframe-container iframe').contents().find('#step2').offset().top - 92
          }, 500).delay(250);
        },50);
      } else {
        top.location = step2;
      }
    }
    test.addEventListeners();

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
    const modalCover = ELM.create('div pl-modal-cover');
    const iframeContainer = ELM.get('.cro-iframe-container');
    const iframeContent = '<span class="loader"></span><iframe id="cro-reg" name="cro-reg" src="" frameborder="0"></iframe>';
    modalCover.insertAfter(ELM.get('.pl .pl-modal .pl-modal__window'));
    iframeContainer.html(iframeContent);
    const iframe = $('.cro-iframe-container iframe').attr('src','https://www.ica.se/ansokan/?step=6369766963666f726d');
    iframe.load(function () {
      if(this.contentWindow.location.href.indexOf('ansokan/?step=636') !== -1) {
        //load step1
        test.loadIframe('step1');
        const step2container = $('<div class="cro-step2-container pl"><span class="loader"></span><iframe id="step2" name="step2" src="" frameborder="0"></iframe></div>');
        const iframeInner = iframe.contents();
        step2container.insertAfter(iframeInner.find('.step1 .form-wrapper'));
      } else {
        top.location = this.contentWindow.location.href;
      }
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

    iframeInner.on('click', '.backToStep1', function(e) {
      test.loadModal();
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
  }

};

$(document).ready(() => {

  $('body').addClass('cro');

  if (window.self === window.top) {

    const createAccount = ELM.get('.top-bar .top-bar__right .quick-login a[href="/ansokan/"]');

    if(createAccount.exist()) {
      createAccount.css('modal-application');
    }

    let checkAccount;
    if (/^https:\/\/www.ica.se\/$/.test(window.location)) {
      checkAccount = ELM.get('.quicklink-list a[href="http://www.ica.se/ica-kort/"]');

    // LOGINSIDAN??? Hur och varför ändras länken?
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

  } else if (window.frameElement.getAttribute('name') === 'cro-reg' || window.frameElement.getAttribute('name') === 'step2') {

    ELM.get('html').css('cro-modal');
    ELM.get('body').css('cro-modal');

  }

});
