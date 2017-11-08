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

    var test = {
        addStyles: function () {
            const styles = `
<style type="text/css">
.cro {}
.cro .rating-star-container {
  position:relative;
  z-index: 50;
  margin: 20px 0 0 20px;
  color: white;
  text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.4);

}

.cro .rating-star-container a {
  color: white;
}

.cro .rating-star-container .recipepage__headline {
  font-size: 3.3rem;
  margin-bottom: 9px;
  margin-top: 5px;
  max-width: none;
  font-family: icarubrik;
  font-weight: 700;
  line-height: 3rem;
}

.cro .rating-star-container .recipe-header__difficulty {
  text-transform: uppercase;
  font-family: icarubrik;
  font-weight: 600;
  margin-top: 6px;
}

.cro .rating-star-container .offer-text {
  font: 17px icarubrik;
  font-weight: 600;
}
.cro .rating-star-container svg .active {
  fill: #EB1F07;
}
.cro .rating-star-container svg {
    display: inline-block;
    fill: #D5D7DA;
    height: 18px;
    vertical-align: middle;
    width: 91px;
    -webkit-filter: drop-shadow( 1px 1px 2px rgba(0,0,0,0.4) );
    filter: drop-shadow( 1px 1px 2px rgba(0,0,0,0.4) );
}

</style>`;
            const style = document.createElement('style');
            style.setAttribute('type', 'text/css');
            style.appendChild(document.createTextNode(styles));
            document.querySelector('head').appendChild(style);
        },
        addEventListeners: function () {},
        hideElements() {
            [
                '.header-content',
                '.push-items-list',
                '.quicklink-list',
                '.main .link-list',
                '.recipe-category-listing .banner-image',
                '.recipe-category-listing .col-12 > h2',
                // '.search-recipe-container__recipe-count',
                '.recipe-category-listing .recipe-list-items',
            ].forEach((element) => {
                const elm = document.querySelector(element);
                elm.parentNode.removeChild(elm);
            });
        },
        toArray (list) {
            return Array.prototype.slice.call(list);
        },
        replaceBackgroundBanner(url) {
            fetch(url).then((response) => {
                return response.text();
            }).then((html) => {
                const shadowDom = document.createElement('div');
                const container = document.createElement('div');
                container.className = 'rating-star-container';
                shadowDom.innerHTML = html;

                const ratingContainer = shadowDom.querySelector('.rating-stars');
                const rating = ratingContainer.dataset.rating;
                const svg = ratingContainer.querySelector('svg');
                const header = document.querySelector('.header');
                const nodes = this.toArray(svg.querySelectorAll('g')).reverse();

                for (let i = 0; i < rating; i++) {
                   nodes[i].classList.add('active');
                }
                const offerText = document.createElement('div');
                offerText.className = 'offer-text';
                offerText.appendChild(document.createTextNode('Erbjudande på:'));
                const recipeHeader = shadowDom.querySelector('.recipepage__headline');
                const recipeHeaderDifficulty = shadowDom.querySelector('.recipe-header__difficulty');

                container.appendChild(offerText);
                container.appendChild(recipeHeader);

                container.appendChild(ratingContainer);
                container.appendChild(recipeHeaderDifficulty);

                header.appendChild(container);
            });
        },
        addIcaCard() {

        },
        addCoupons() {

        },
        addCROClass() {
            document.querySelector('body').classList.add('cro');
        },
        manipulateDom: function () {
            this.addCROClass();
            this.hideElements();
            this.replaceBackgroundBanner('https://www.ica.se/recept/tabbouleh-med-quinoa-722825/');
            this.addCoupons();
            this.addIcaCard();
        }
    };

    test.addStyles();

    $(document).ready(function (){
        test.manipulateDom();
        test.addEventListeners();
    });
})(jQuery);
