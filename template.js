// ==UserScript==
// @name         First page
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.ica.se/
// @grant        none
// ==/UserScript==

(function($) {
    'use strict';

    const test = {
        addStyles: function () {
            const styles = `
<style type="text/css">
.cro {}
</style>`;
            const style = document.createElement('style');
            style.setAttribute('type', 'text/css');
            style.appendChild(document.createTextNode(styles));
            document.querySelector('head').appendChild(style);
        },
        addEventListeners: function () {},
        hideElements() {
            [].forEach((element) => {
                const elm = document.querySelector(element);
                elm.parentNode.removeChild(elm);
            });
        },
        manipulateDom: function () {
            this.hideElements();
        }
    };

    test.addStyles();

    $(document).ready(function (){
        test.manipulateDom();
        test.addEventListeners();
    });
})(jQuery);
