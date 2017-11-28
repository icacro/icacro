// ==UserScript==
// @name         Banner
// @path         //./src/banner/variant.js
// @namespace    http://tampermonkey.net/
// @version      0.1
// @match        https://www.ica.se/*
// @grant        none
// ==/UserScript==

import { ICACRO, $ELM } from '../util/main';
import { styles } from './style';

(function ($) {
  'use strict';
  // hj && hj('trigger', 'variant2');// eslint-disable-line
  const test = {
    addStyles() { return styles },
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
      downLoad.href(url).text('Ladda kupong');

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
      const content = $ELM.get('#content');
      const regexp = /www.ica.se\/kampanj\/hse/g;
      const banners = this.getElementContentByTagAndAttr(regexp, 'a', 'href');
      const ids = banners.map(banner => banner.match(/\d+$/)[0]);
      content.html(' ');
      this.loadBanners(ids, content);
    },
  };

  $(document).ready(() => {
    Object.assign(test, ICACRO());
    test.style(test.addStyles())
    test.manipulateDom();
  });
})(jQuery);
