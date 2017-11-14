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
        addStyles: function () {
          const styles = `
              .cro {}
            `;
            const style = document.createElement('style');
            style.setAttribute('type', 'text/css');
            style.appendChild(document.createTextNode(styles));
            document.querySelector('head').appendChild(style);
        },
        create(className, parent, text, type) {
            const self = this;
            const t = type ? type : 'div';
            const div = document.createElement(t);
            if (text && type === 'img') {
                div.src = text;
            } else if (text) {
                div.appendChild(document.createTextNode(text));
            }
            if (className) div.className = className;
            if (parent) parent.appendChild(div);
            return div;
        },
        hideElements() {
            [].forEach((element) => {
                const elm = document.querySelector(element);
                elm.parentNode.removeChild(elm);
            });
        },
        addBlock() {

        },
        manipulateDom: function () {
            this.hideElements();
            this.addBlock();
        }
    };

    test.addStyles();

    $(document).ready(function (){
        test.manipulateDom();
        test.addEventListeners();
    });
})(jQuery);
