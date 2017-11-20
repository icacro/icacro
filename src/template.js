// ==UserScript==
// @name         testName
// @path         testPath
// @namespace    http://tampermonkey.net/
// @version      0.1
// @match        https://www.ica.se/*
// @grant        none
// ==/UserScript==

// import { ICACRO, $ELM } from '../../icacro/src/main';

(function ($) {
  'use strict';

  hj;
  const helperVersion = '#version';
  const test = {
    addStyles() {
      const styles = `
      .cro { }
      `;
      return styles;
    },
    manipulateDom() {},
  };

  const loadJS = (callback) => {
    const script = document.createElement('script');
    script.setAttribute('async', '');
    script.setAttribute('src', `https://cdn.rawgit.com/Banzaci/icacro/v${helperVersion}/dist/main.min.js`);
    document.querySelector('head').appendChild(script);
    script.onreadystatechange = callback;
    script.onload = callback;
  };

  $(document).ready(() => {
    loadJS(() => {
      Object.assign(test, ICACRO());
      test.style(test.addStyles());
      test.manipulateDom();
    });
  });
})(jQuery);
