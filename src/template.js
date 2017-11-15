// ==UserScript==
// @name         Personal-offers
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.ica.se/mittica/*
// @grant        none
// ==/UserScript==

(function($) {
    'use strict';
    const test = {
        addStyles() {
          const styles = `
              .cro { background: #333; }
            `;
          return styles;
        },
        manipulateDom() {
            console.log(this);
        }
    };

    const loadJS = (callback) => {
      const script = document.createElement('script');
      script.setAttribute('async', '')
      script.setAttribute('src', 'https://rawgit.com/Banzaci/icacro/0.1/main.js');// Prod cdn. //Check tag
      document.querySelector('head').appendChild(script);
      script.onreadystatechange = script.onload = function() {
        callback();
      };
    }

    $(document).ready(function (){
      loadJS(() => {
        Object.assign(test, ICACRO());
        test.style(test.addStyles());
        test.manipulateDom();
      });
    });
})(jQuery);
