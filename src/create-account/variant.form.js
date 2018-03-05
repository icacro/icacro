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
  loaderIsActive: false,
  buttonHandlerPollTimeout: null,
  showLoader: function() {
    var container = $('.cro-iframe-container');
    container.find('.loader').show();
    container.find('iframe').css('opacity', '0');
    this.loaderIsActive = true;
  },
  hideLoader: function() {
    var container = $('.cro-iframe-container');
    container.find('.loader').hide();
    container.find('iframe').css('opacity', '1');
    this.loaderIsActive = false;
  },
  loadIframe(self) {

    const iframeContainer = ELM.get('.cro-iframe-container');
    const iframeContent = '<span class="loader"></span><iframe id="cro-reg" name="cro-reg" src="//www.ica.se/ansokan/?step=6369766963666f726d" frameborder="0"></iframe>';
    iframeContainer.append(iframeContent);
    const iframe = $('.cro-iframe-container iframe');

    iframe.on('load', function () {

      const iframeInner = iframe.contents();

      if(this.contentWindow.location.href.indexOf('ansokan') !== -1) {
        var headerBarTimeout = window.setTimeout(hideHeaderBar, 10);
        var hideHeaderBarDeferred = $.Deferred();

        $.when(hideHeaderBarDeferred).done(function() {
          self.hideLoader();
        });

        function hideHeaderBar() {
          var e = iframeInner.find('.easy-signup-header');
          if (e.length) {
            iframeInner.find('body').addClass('cro-modal');
            iframeInner.find('.step-header').show();
            iframeInner.find('form').attr('target','step2');
            window.clearTimeout(headerBarTimeout);
            hideHeaderBarDeferred.resolve();
          } else {
            headerBarTimeout = window.setTimeout(hideHeaderBar, 0);
          }
        }

        const iframeStep2 = $('<div class="cro-step2-container"><span class="loader"></span><iframe id="step2" name="step2" src="" frameborder="0"></iframe></div>');
        iframeStep2.insertAfter(iframeInner.find('.step1 .form-wrapper'));

        iframeInner.find('form').on('submit', function(e) {
          if(iframeInner.find('.icon-checkmark:visible').length) {
            iframeInner.find('.payWithCard, .form-wrapper .form li:last-child').hide();
            setTimeout(function () {
              iframeInner.find('#step2').addClass('loaded');
              iframeInner.find('#step2').contents().find('body').addClass('cro-modal');
              iframeInner.find('#step2').contents().find('form').attr('target','cro-reg');
            }, 1000);
          } else {
            console.log('error');
          }
        });

      }

    });
  },
  createModal() {
    var self = this;

    var modal = new coreComponents.modal({
      tpl: $('.cro-iframe-container').get(0),
      size: 'md',
      container: $('.modal-container').get(0)
    });

    setTimeout(function () {
      self.showLoader();
      test.loadIframe(self);
    }, 50);

  },
  addEventListeners() {

    //temporär öppning
    const container = ELM.get('.quicklink-list');
    if (container.element) {
      const cta = ELM.create('a');
      cta.html('Öppna');
      cta.href('#');
      cta.click((e) => {
        e.preventDefault();
        test.createModal();
      });
      container.append(cta);
    }
  },
  manipulateDom() {
    let iframeContainer = ELM.create('div cro-iframe-container');
    ELM.get('body').append(iframeContainer);
  },
};

//https://www.ica.se/ansokan/?step=6369766963666f726d
//https://www.ica.se/ansokan/?step=6c6f79616c74796e6577637573746f6d6572666f726d

$(document).ready(() => {
  Object.assign(test, CROUTIL());
  test.manipulateDom();
  test.addEventListeners();
});
