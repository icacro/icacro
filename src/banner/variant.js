// ==UserScript==
// @name         Banner
// @path         //./src/banner/variant.js
// @namespace    http://tampermonkey.net/
// @version      0.1
// @match        https://www.ica.se/*
// @grant        none
// ==/UserScript==

(function($) {
    'use strict';
    hj('trigger','variant2');
    const test = {
        addStyles() {
          const styles = `
            .cro { }
          `;
          return styles;
        },
        ajax(url, method = 'get') {
          return fetch(url, { method })
            .then((response) => {
              return response;
            })
            .catch((err) => {
              console.log(err);
              return err;
            });
        },
        manipulateDom() {
          const page = this.ajax('https://www.ica.se/erbjudanden/butikserbjudanden/utvalda-kuponger/');
          console.log(this);
          page.then((result) => {
            // console.log(result);
          });
        }
    };

    const loadJS = (callback) => {
      const script = document.createElement('script');
      script.setAttribute('async', '')
      script.setAttribute('src', 'https://rawgit.com/Banzaci/icacro/0.8/dist/main.min.js');// Prod cdn. //Check tag
      document.querySelector('head').appendChild(script);
      script.onreadystatechange = script.onload = () => {
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
