// ==UserScript==
// @name         Shopping-list-in-nav
// @path         //./src/shopping-list-in-nav/variant.js
// @namespace    http://tampermonkey.net/
// @version      0.1
// @match        https://www.ica.se/*
// @grant        none
// ==/UserScript==

'use strict';

import { CROUTIL, ELM } from '../util/main';
import { triggerHotJar } from '../util/utils';
import './style.css';

const test = {

  updateCopy(newCopy, updateElement) {
    var selectElement=$(updateElement);
    if(selectElement.length > 0) {
      selectElement.html(newCopy);
      if(selectElement.attr('title')) {
        selectElement.attr('title',newCopy);
      }
    }
  },

  updateInput(newCopy, updateElement) {
    var selectElement=$(updateElement);
    if(selectElement.length > 0) {
      selectElement.attr('value',newCopy);
    }
  },

  cardStartpage() {
    const croImagebox = '<a class="block image-loaded" href="/ansokan/"><div class="cro-imagebox">' +
    '<img data-original="//icase.azureedge.net/imagevaultfiles/id_165015/cf_13071/ansok-ny-160x136.jpg" width="160" height="135" alt="ansok-ny-160x136" src="//icase.azureedge.net/imagevaultfiles/id_165015/cf_13071/ansok-ny-160x136.jpg">' +
    '<h1>Skaffa bonuskonto idag</h1><p>Med ICA-kort kan du få bonus, erbjudanden och kan handla maten på nätet. Smart va!</p><p><span class="button" title="Börja här" href="/ansokan/">Börja här</span></p>' +
    '</div></a>';
    ELM.get('.imagebox').html(croImagebox);

    const avatarSvg = ELM.svg('avatar', 'avatar');
    const linkLists = '<div><ul class="link-list link-list__horizontal"><li class="login"><a href="https://www.ica.se/logga-in/?returnurl=https://www.ica.se/"><div></div> Logga in</a></li><li><a href="https://www.ica.se/ansokan/?step=6369766963616e64636f6465666f726d">Använd engångskod</a></li><li><a href="https://www.ica.se/ica-kort/sparra-och-bestall-nytt-kort/">Spärra/beställ nytt kort</a></li></ul>' +
    '<ul class="link-list link-list__vertical"><li class="link-list-header">För dig utan kort</li><li><a href="https://www.ica.se/ansokan/ansokan-utan-svenskt-personnummer/">Ansök om ICA-kort utan svenskt personnummer</a><li><a href="https://www.icabanken.se/ansok-student?utm_source=ica.se&utm_medium=referral&utm_campaign=ica_student_campaign_inherited">Ansök om ICA Student</a><li><a href="https://www.ica.se/ica-kort/icas-olika-kort/">Läs om våra olika kort</a><li><a href="https://www.ica.se/ica-kort/samla-och-fa-tillbaka/">Förmåner med ICA-kort</a></li></ul>' +
    '<ul class="link-list link-list__vertical"><li class="link-list-header">För dig med kort</li><li><a href="https://www.ica.se/inloggning/jag-vet-inte-vad-jag-har-for-losenord/?returnurl=https://www.ica.se/">Få hjälp med lösenord</a><li><a href="https://www.ica.se/installningar/#:detaljer=kontodetaljer&tab=tab-upgradecard">Uppgradera ditt rosa kort till betalkort</a><li><a href="https://www.ica.se/hantera-bonuskonto/">Bjud in eller tacka ja till att dela bonuskonto</a><li><a href="https://www.ica.se/ica-kort/insattning-uttag/">Sätt in pengar på ditt ICA-kort</a></li></ul></div>';

    const wrapper = ELM.create('link-lists');
    const section = ELM.get('.primary');
    section.append(wrapper);
    wrapper.append(linkLists);

    ELM.get('.login a div').append(avatarSvg);
    triggerHotJar('icakortentryVariant');
  },

  manipulateDom() {

    const copyAccount       = 'SKAFFA BONUSKONTO';

    //ALLA SIDOR / ANVÄNDARMENYN
    test.updateCopy(copyAccount,'#dropdown-avatar .quick-login a[href=\'/ansokan/\'].button');

    // SPECIFIKA SIDOR
    if (/^https:\/\/www.ica.se\/$/.test(window.location)) { //STARTSIDAN

      const copyStartpageBtn  = 'Skaffa bonuskonto';
      const hrefStartpageBtn  = 'http://www.ica.se/ica-kort/';

      test.updateCopy(copyStartpageBtn,'.quicklink-list a[href=\'http://www.ica.se/ica-kort/\'].button');
      $('.quicklink-list a[href=\'http://www.ica.se/ica-kort/\'].button').attr('href',hrefStartpageBtn);

    } else if (/^https:\/\/www.ica.se\/logga-in/.test(window.location)) { //LOGINSIDAN

      test.updateCopy(copyAccount,'.login-page .login-help-area .right-link a');

    } else if (/^https:\/\/www.ica.se\/ansokan/.test(window.location)) { //ANSÖKNINGSFLÖDET

      const copyFormBtn       = 'Skaffa bonuskonto nu';
      const copyFormHeader    = 'Skaffa bonuskonto';

      test.updateInput(copyFormBtn,'.easy-signup-page .proceed input');

      if (/^https:\/\/www.ica.se\/ansokan\/\?.*step/.test(window.location)) { //ANSÖKNINGSFLÖDET – steg 1, 2
        test.updateCopy(copyFormHeader,'.easy-signup-page .container-steps .step-header h1');
      }

    } else if (/^https:\/\/www.ica.se\/ica-kort/.test(window.location)) { //ICA-KORT-SIDORNA

      const copySubMenu       = 'Skaffa ICA-kort';
      const copySubpageBtn    = 'Skaffa ICA-kort här';
      const copySubpageExtra  = 'Har du fått en engångskod i kassan? Klicka på Skaffa ICA-kort nedan! <span class="red">Du behöver inte ange någon kod om du ansöker om ett kort med betalfunktion.</span>';

      test.updateCopy(copySubMenu,'.top-bar-sub-menu .top-bar-sub-menu__item a[href=\'/ica-kort/ansok-om-ica-kort/\']');

      if (/^https:\/\/www.ica.se\/ica-kort\/$/.test(window.location)) {

        $('body').addClass('cro-cardstart');
        test.cardStartpage();

      }
    }

  },
};

$(document).ready(() => {
  Object.assign(test, CROUTIL());
  test.manipulateDom();
});
