// ==UserScript==
// @name         CTA-texter ansökningsflödet
// @path         //./src/ica-kort-cta/variant.js
// @namespace    http://tampermonkey.net/
// @version      0.1
// @match        https://www.ica.se/*
// @grant        none
// ==/UserScript==

(function ($) {
  'use strict';
  const test = {
    addStyles: function () {
        var styles = `<style type="text/css">
      .cro-imagebox {
        visibility: visible !important;
        display:block;
        background:#F9BEDA;
        padding:55px 22px 38px 30px;
        margin-bottom:24px;
        height:189px;
      }
      .cro-imagebox img {
        float: right;
        margin-top:40px;
      }
      .cro-imagebox h1 {
        font-size:3.2em;
        line-height:1;
        color:#3F3F40;
      }
      .cro-imagebox p {
        font-size: 1.1857em;
        line-height:1.35em;
        margin:15px 0 22px 0;
        max-width:340px;
        color:#3F3F40;
      }
      .cro-imagebox p .button {
        border-radius:38px;
        padding:10px 30px;
      }
      .cro-imagebox:hover .button {
        background:#a02971;
      }
      @media (max-width: 1000px) and (min-width: 701px) {
        .cro-imagebox {
          padding:5.4vw 2vw 3.6vw 3vw;
          height:auto;
        }
        .cro-imagebox img {
          margin-top:4vw;
          width:16vw;
        }
        .cro-imagebox h1 {
          font-size:4.5vw;
        }
        .cro-imagebox p {
          font-size: 1.7vw;
          margin:1.5vw 0 2.2vw 0;
          max-width:34vw;
        }
        .cro-imagebox p .button {
          border-radius:3.8vw;
          padding:1vw 3vw;
        }
      }
      @media (max-width: 701px) {
        .cro-imagebox {
          padding:7vw 2vw 3vw 4vw;
          height:auto;
        }
        .cro-imagebox img {
          margin-top:0;
          width:22vw;
        }
        .cro-imagebox h1 {
          font-size:6.4vw;
        }
        .cro-imagebox p {
          font-size: 3.2vw;
          margin:2.25vw 0 3.3vw 0;
          max-width:570vw;
        }
        .cro-imagebox p a.button {
          border-radius:5.7vw;
          padding:1.5vw 4.5vw;
        }
      }
      </style>`;
      $('head').append(styles);
    },

    /*addEventListeners: function () {
      $(document).on('click', '.top-bar a[href=\'/ansokan/\'], .login-page .login-help-area .right-link a', function () {
        document.cookie = 'loginintent=1; path=/';
      });
    },*/

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

    manipulateDom: function () {

      var copyAccount       = 'SKAFFA ICA-KORT OCH KONTO';

      //ALLA SIDOR / ANVÄNDARMENYN
      test.updateCopy(copyAccount,'#dropdown-avatar .quick-login a[href=\'/ansokan/\'].button');

      // SPECIFIKA SIDOR
      if (/^https:\/\/www.ica.se\/$/.test(window.location)) { //STARTSIDAN

        var copyStartpageBtn  = 'Skaffa ICA-kort';
        var hrefStartpageBtn  = 'http://www.ica.se/ica-kort/';

        //document.cookie = 'loginintent=0; path=/;';
        test.updateCopy(copyStartpageBtn,'.quicklink-list a[href=\'http://www.ica.se/ica-kort/\'].button');
        $('.quicklink-list a[href=\'http://www.ica.se/ica-kort/\'].button').attr('href',hrefStartpageBtn);

      } else if (/^https:\/\/www.ica.se\/logga-in/.test(window.location)) { //LOGINSIDAN

        test.updateCopy(copyAccount,'.login-page .login-help-area .right-link a');

      } else if (/^https:\/\/www.ica.se\/ansokan/.test(window.location)) { //ANSÖKNINGSFLÖDET

        var copyFormBtn       = 'Skaffa ICA-kort nu';
        var copyFormHeader    = 'Skaffa ICA-kort';

        //console.log(getCookie('loginintent'));
        test.updateInput(copyFormBtn,'.easy-signup-page .proceed input');
        //ANSÖKNINGSFLÖDET – steg 1, 2
        if (/^https:\/\/www.ica.se\/ansokan\/\?.*step/.test(window.location)) {
          test.updateCopy(copyFormHeader,'.easy-signup-page .container-steps .step-header h1');
        }

      } else if (/^https:\/\/www.ica.se\/erbjudanden\/nojeserbjudanden/.test(window.location)) { //NÖJESERBJUDANDEN

        var copyOfferHeader   = 'Saknar du ICA-kort?';
        var copyOfferBody     = 'Med ICA-kortet får du ta del av våra rabatter och erbjudanden';
        var copyOfferBtn      = 'Skaffa ICA-kort';

        test.updateCopy(copyOfferHeader,'.ica-card-module .text-card .heading-icatext');
        test.updateCopy(copyOfferBody,'.ica-card-module .text-card p');
        test.updateCopy(copyOfferBtn,'.ica-card-module .text-card a');

      } else if (/^https:\/\/www.ica.se\/ica-kort/.test(window.location)) { //ICA-KORT-SIDORNA

        var copySubMenu       = 'Skaffa ICA-kort';
        var copySubpageBtn    = 'Skaffa ICA-kort här';
        var copySubpageExtra  = 'Har du fått en engångskod i kassan? Klicka på Skaffa ICA-kort nedan! <span class="red">Du behöver inte ange någon kod om du ansöker om ett kort med betalfunktion.</span>';

        //document.cookie = 'loginintent=0; path=/;';
        test.updateCopy(copySubMenu,'.top-bar-sub-menu .top-bar-sub-menu__item a[href=\'/ica-kort/ansok-om-ica-kort/\']');

        if (/^https:\/\/www.ica.se\/ica-kort\/$/.test(window.location)) {

          var copyBoxHeader     = 'Skaffa ICA-kort idag';
          var copyBoxButton     = 'Börja här';

          test.updateCopy(copySubMenu,'.listed-articles h2.title a[href=\'/ica-kort/ansok-om-ica-kort/\']');
          var croImagebox = $('<div class="cro-imagebox" style="visibility:hidden;">' +
          '<img data-original="//icase.azureedge.net/imagevaultfiles/id_165015/cf_13071/ansok-ny-160x136.jpg" width="160" height="135" alt="ansok-ny-160x136" src="//icase.azureedge.net/imagevaultfiles/id_165015/cf_13071/ansok-ny-160x136.jpg">' +
          '<h1>'+copyBoxHeader+'</h1><p>Med ICA-kort kan du få bonus, erbjudanden och kan handla maten på nätet. Smart va!</p><p><span class="button" title="'+copyBoxButton+'" href="/ansokan/">'+copyBoxButton+'</span></p>' +
          '</div>');
          $('.imagebox a[href=\'/ica-kort/ansok-om-ica-kort/\']').html(croImagebox).css('visibility','visible');

        } else if (/^https:\/\/www.ica.se\/ica-kort\/ansok-om-ica-kort/.test(window.location)) {

          var copyApplyHeader   = 'Skaffa ICA-kort';

          $('.primary .content .clearfix > strong').html(copySubpageExtra).css('visibility','visible');
          test.updateCopy(copyApplyHeader,'header h1');
          test.updateCopy(copySubpageBtn,'.content a[href=\'/ansokan/\']');

        } else if (/^https:\/\/www.ica.se\/ica-kort\/samla-och-fa-tillbaka/.test(window.location)) {

          test.updateCopy(copySubpageBtn,'.lead a[href=\'http://www.ica.se/ica-kort/ansok-om-ica-kort/\'].button');
          test.updateCopy(copySubpageBtn,'.content a[href=\'/ica-kort/ansok-om-ica-kort/\'].button');

          $('.lead a[href=\'http://www.ica.se/ica-kort/ansok-om-ica-kort/\'].button').attr('href','/ansokan/');;
          $('.content a[href=\'/ica-kort/ansok-om-ica-kort/\'].button').attr('href','/ansokan/');;

        } else if (/^https:\/\/www.ica.se\/ica-kort\/icas-olika-kort/.test(window.location)) {

          var copyCardpageBtn1  = 'Skaffa ICA-kort för bonus';
          var copyCardpageBtn2  = 'Skaffa ICA-kort med betalfunktion';

          test.updateCopy(copyCardpageBtn1,'.content a[href=\'/ansokan/\'].button');
          test.updateCopy(copyCardpageBtn2,'.content a[href=\'https://www.icabanken.se/kort-och-konto/vara-kort/valj-kort\'].button');

        }
      }
    }
  };

  test.addStyles();

  $(document).ready(() => {
    $('body').addClass('cro');
    test.manipulateDom();
  });
})(jQuery);
