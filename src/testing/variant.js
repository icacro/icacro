// ==UserScript==
// @name         Testing
// @path         //./src/testing/variant.js
// @namespace    http://tampermonkey.net/
// @version      0.1
// @match        https://www.ica.se/*
// @grant        none
// ==/UserScript==
import { ICACRO, $ELM } from '../../icacro/src/main';
(function($) {
    'use strict';
    hj('trigger','variant1');
    const test = {
        addStyles() {
          const styles = `
            .cro { }
          `;
          return styles;
        },
        manipulateDom() {
          console.log('Apa');
        }
    };

    // const loadJS = (callback) => {
    //   const script = document.createElement('script');
    //   script.setAttribute('async', '')
    //   script.setAttribute('src', 'https://rawgit.com/Banzaci/icacro/0.7/dist/main.min.js');// Prod cdn. //Check tag
    //   document.querySelector('head').appendChild(script);
    //   script.onreadystatechange = script.onload = () => {
    //     callback();
    //   };
    // }

    $(document).ready(function (){
      Object.assign(test, ICACRO());
      test.style(test.addStyles());
      test.manipulateDom();
      // loadJS(() => {
      //   Object.assign(test, ICACRO());
      //   test.style(test.addStyles());
      //   test.manipulateDom();
      // });
    });
})(jQuery);
