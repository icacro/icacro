// ==UserScript==
// @name         testName
// @path         testPath
// @namespace    http://tampermonkey.net/
// @version      0.1
// @match        https://www.ica.se/*
// @grant        none
// ==/UserScript==

(function($) {
    'use strict';
    hj;
    const test = {
        addStyles() {
          const styles = `
            .cro { }
          `;
          return styles;
        },
        manipulateDom() {}
    };

    const loadJS = (callback) => {
      const script = document.createElement('script');
      script.setAttribute('async', '')
      script.setAttribute('src', 'https://rawgit.com/Banzaci/icacro/0.1/main.js');// Prod cdn. //Check tag
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
