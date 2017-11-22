// ==UserScript==
// @name         Banner
// @path         //./src/banner/variant.js
// @namespace    http://tampermonkey.net/
// @version      0.1
// @match        https://www.ica.se/*
// @grant        none
// ==/UserScript==

import { ICACRO, $ELM } from '../../icacro/src/main';

(function ($) {
  'use strict';

  hj && hj('trigger', 'variant2');// eslint-disable-line

  const test = {
    addStyles() {
      const styles = `
        .cro .grow-one { flex-grow: 1; }
        .cro .banner { display:flex; background-color: #F8EBF3; margin-bottom: 10px; }
        .cro .banner-row {
          display:flex;
          width:100%;
          align-items: center;
          background-color: white;
          margin: 10px 15px;
          min-height: 133px;
          position: relative;
        }
        .cro .banner-row::after {
          background:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDIxLjAuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCAxMCAyMCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMTAgMjA7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPHN0eWxlIHR5cGU9InRleHQvY3NzIj4KCS5zdDB7ZmlsbDojRjhFQkYzO30KPC9zdHlsZT4KPHBhdGggY2xhc3M9InN0MCIgZD0iTTIuNDk3MDIxLDkuOTg4ODA3YzAsNC4xNDIxNTEsMy4zNTc4NDksNy41MDAwMDEsNy41LDcuNTAwMDAxdi0xNQoJQzUuODU0ODcsMi40ODg4MDcsMi40OTcwMjEsNS44NDY2NTYsMi40OTcwMjEsOS45ODg4MDd6Ii8+Cjwvc3ZnPgo=") space;
          background-size: 13px 26px;
          bottom: 0;
          content: '';
          display: block;
          height: 100%;
          position: absolute;
          right: 0;
          top: 0;
          width: 13px;
        }
        .cro .banner .banner-column { padding: 20px 10px; }
        .cro .banner .banner-column .download {
          align-items: center;
          background: #F8EBF3;
          color: #A02971;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          justify-content: center;
          margin: 10px 20px;
          border-radius: 5rem;
        }
        .cro .banner .banner-column h1 { font-size: 1.6rem; }
        .cro .banner .banner-column span {
          color: #EB1F07;
          font-family: icarubrik;
          font-size: 2.2rem;
          font-weight: bold;
        }
        .cro .banner .banner-column p {
          color: #808283;
          font-size: 1.3rem;
        }
        .cro .banner .banner-column .banner-column__more-info { font-size: 20px; }
        .cro .banner-column__image img { max-width: 140px; max-height: 100px; }
      `;
      return styles;
    },
    getElementContentByTagAndAttr(regexp, tag, attr) {
      const elements = document.querySelectorAll(tag);
      return this.toArray(elements).reduce((acc, element) => {
        if (new RegExp(regexp).test(element[attr])) {
          acc.push(element[attr]);
        }
        return acc;
      }, []);
    },
    printBanner(content, {
      title,
      discount,
      preamble,
      url,
      img,
    }) {
      const [
        bannerElement,
        bannerRow,
        bannerColumn1,
        bannerColumn2,
        bannerColumn3,
        imgElement,
        titleElement,
        discountElement,
        preambleElement,
        imgHolder,
        readMore,
        downLoad,
      ] = $ELM.create(
        'banner',
        'banner-row',
        'banner-column',
        'banner-column grow-one',
        'banner-column',
        'banner-column__image',
        'h1',
        'span',
        'p',
        'img',
        'a',
        'a .button download',
      );

      imgHolder.image(img);
      imgElement.append(imgHolder);

      readMore.href(url).text('Läs mer');
      downLoad.href(url).text('Ladda ner');

      titleElement.html(title);
      discountElement.html(discount);
      preambleElement.html(preamble);

      bannerColumn1.append(imgElement);
      bannerColumn2.appendAll(titleElement, discountElement, preambleElement, readMore);
      bannerColumn3.append(downLoad);

      bannerRow.appendAll(bannerColumn1, bannerColumn2, bannerColumn3);
      bannerElement.append(bannerRow);
      content.append(bannerElement);
    },
    loadBanners(ids, content) {
      ids.forEach((id) => {
        this.load(`https://www.ica.se/api/jsonhse/${id}`, { credentials: 'same-origin' })
          .then(response => response.json())
          .then((response) => {
            const { Header, Offer } = response;
            const { OfferCondition, Brand, SizeOrQuantity } = Offer;
            this.printBanner(content, {
              title: Header,
              discount: OfferCondition.Conditions[0],
              preamble: `${Brand} ${SizeOrQuantity.Text}`,
              url: '',
              img: Offer.Image.ImageUrl,
            });
          });
      });
    },
    manipulateDom() {
      const content = $ELM.get('.content');
      const regexp = /www.ica.se\/kampanj/g;
      const banners = this.getElementContentByTagAndAttr(regexp, 'a', 'href');
      const ids = banners.map(banner => banner.match(/\d+$/)[0]);
      content.html(' ');
      this.loadBanners(ids, content);
    },
  };

  // const loadJS = (callback) => {
  //   const script = document.createElement('script');
  //   script.setAttribute('async', '');
  //   script.setAttribute('src', 'https://rawgit.com/Banzaci/icacro/v1.1.0/dist/main.min.js');
  //   document.querySelector('head').appendChild(script);
  //   script.onreadystatechange = callback;
  //   script.onload = callback;
  // };

  $(document).ready(() => {
    // loadJS(() => {
    Object.assign(test, ICACRO());
    test.style(test.addStyles());
    test.manipulateDom();
    // });
  });
})(jQuery);
