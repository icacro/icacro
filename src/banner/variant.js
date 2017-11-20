// ==UserScript==
// @name         Banner
// @path         //./src/banner/variant.js
// @namespace    http://tampermonkey.net/
// @version      0.1
// @match        https://www.ica.se/*
// @grant        none
// ==/UserScript==

// import { ICACRO, $ELM } from '../../icacro/src/main';
(function($) {
    'use strict';
    hj('trigger','variant2');
    const test = {
        addStyles() {
          const styles = `
            .cro .banner { display:flex; }
            .cro .banner .banner__title { font-size: 20px; }
          `;
          return styles;
        },
        getElementContentByTagAndAttr(regexp, tag, attr) {
          const elements = document.querySelectorAll(tag);
          return this.toArray(elements).reduce((acc, element) => {
            if(new RegExp(regexp).test(element[attr])) {
              acc.push(element[attr]);
            }
            return acc;
          }, []);
        },
        printBanner(content, { title, discount, preamble, url, img }) {
          const banner = $ELM();
          const titleElement = $ELM();
          titleElement
            .css('banner__title')
            .html(title);
          banner
            .css('banner')
            .append(titleElement);
          content.append(banner);
        },
        loadBanners(ids, content) {
          ids.forEach((id) => {
            this.load(id)
              .then((response) => {
                this.printBanner(content, {
                  title: 'Buljongkuber',
                  discount: '25% rabatt',
                  preamble: 'Knoww 6pack',
                  url: '',
                  img: ''
                });// response
              });
          })
        },
        manipulateDom() {
          const content = $ELM('.content');
          const regexp = /www.ica.se\/kampanj/g;
          const banners = this.getElementContentByTagAndAttr(regexp, 'a', 'href');
          const ids = banners.map((banner) => banner.match(/\d+$/)[0]);
          content.html(' ');
          this.loadBanners(ids, content);
        }
    };

    const loadJS = (callback) => {
      const script = document.createElement('script');
      script.setAttribute('async', '')
      script.setAttribute('src', 'https://rawgit.com/Banzaci/icacro/v0.12.0/dist/main.min.js');// Prod cdn. //Check tag
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
