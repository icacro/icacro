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

    const banners = [
    {
        title: 'After Eight Kladdkaka',
        starts: 4,
        cookTime: '15 min | ENKELT',
        image: 'https://www.ica.se/imagevaultfiles/id_171018/cf_259/raggmunk-med-lingonapple-v47-723024.jpg',
        url: '',
        coupons: [
            {
                title: 'Margarin',
                image: '/Templates/GlobalSearch/Views/images/buffe_logga.png',
                discount: '5 kr i rabatt',
                subtitle: 'Milda 1kg',
                url: ''
            },
            {
                title: 'Margarin',
                image: '/Templates/GlobalSearch/Views/images/buffe_logga.png',
                discount: '5 kr i rabatt',
                subtitle: 'Milda 1kg',
                url: ''
            }
        ]
    },
        {
        title: 'After Eight Kladdkaka',
        starts: 4,
        cookTime: '15 min | ENKELT',
        image: 'https://www.ica.se/imagevaultfiles/id_171018/cf_259/raggmunk-med-lingonapple-v47-723024.jpg',
        url: '',
        coupons: [
            {
                title: 'Margarin',
                image: '/Templates/GlobalSearch/Views/images/buffe_logga.png',
                discount: '5 kr i rabatt',
                subtitle: 'Milda 1kg',
                url: ''
            },
            {
                title: 'Margarin',
                image: '/Templates/GlobalSearch/Views/images/buffe_logga.png',
                discount: '5 kr i rabatt',
                subtitle: 'Milda 1kg',
                url: ''
            }
        ]
    },
        {
        title: 'Apornas planet',
        starts: 4,
        cookTime: '15 min | ENKELT',
        image: 'https://www.ica.se/imagevaultfiles/id_171018/cf_259/raggmunk-med-lingonapple-v47-723024.jpg',
        url: '',
        coupons: [
            {
                title: 'Margarin',
                image: '/Templates/GlobalSearch/Views/images/buffe_logga.png',
                discount: '5 kr i rabatt',
                subtitle: 'Milda 1kg',
                url: ''
            },
            {
                title: 'Margarin',
                image: '/Templates/GlobalSearch/Views/images/buffe_logga.png',
                discount: '5 kr i rabatt',
                subtitle: 'Milda 1kg',
                url: ''
            }
        ]
    }
];
/*
position: absolute; // in banner-container
   top: 0;
   left: 0;
*/
    var test = {
        addStyles: function () {
            const styles = `
<style type="text/css">
.cro header .image-slider {
  position: absolute !important;
}
.start-page>header {
    height: 450px;
}
.shadow {
   -webkit-filter: drop-shadow( 0px 0px 2px rgba(0,0,0,0.2) );
   filter: drop-shadow( 0px 0px 2px rgba(0,0,0,0.2) );
}

.cro .banner-container {

   width: 100%;
   height: 100%;
   background-color: white;
   padding: 0 5px;
}
.cro .banner-wrapper {
  position: relative;
  max-width: 1260px;
  margin: 0 auto;
  height: 420px;
}

.cro .coupons-container {
   position: absolute;
   top: 180px;
   width: 100%;
   z-index: 999;
}

.cro .coupons-wrapper {
   display: flex;
   flex-direction: row;
   margin: 0 5px;
}

.cro .coupons-container .coupons-container__item {
   background-color: white;
   width: 50%;
   margin: 0 4px;
   padding: 10px;
   border: 8px solid rgba(217,20,99,0.1);
   border-radius: 6px;
   display: flex;
   flex-direction: column;
}

.cro .coupons-container .coupons-container__item img {
   max-height: 50px;
   width: 100%;
}

.cro .coupons-container .coupons-container__item h3 {
   font-size: 1.5rem;
   line-height: 20px;
   margin: 5px 0 0;
}

.cro .coupons-container .coupons-container__item h1 {
   color:#d31c06;
   font-size: 1.8rem;
   line-height: 15px;
   margin: 0;
}

.cro .coupons-container .coupons-container__item h4 {
   font-size: 1.2rem;
   line-height: 15px;
    margin: 0;
}

.cro .coupons-container .coupons-container__item a {
   font-size: 1.2rem;
   line-height: 15px;
}

.cro .coupons-container .coupons-container__item .coupon-button {
    font-size: 1rem;
    line-height: 2.2rem;
    padding: 0 2rem;
    height: 3rem;
    min-width: auto;
    align-self: center;
}

.cro .banner-wrapper .coupons-image {
    height: 220px;
    overflow: hidden;
}

.cro .banner-wrapper .banner-button {
    width: 90%;
    margin: 170px 5%;
}

@media (max-width: 767px) {
  .cro .banner-wrapper {
    height: 330px;
  }
}

.cro .rating-star-container {
  position: absolute;
  z-index: 50;
  margin:10px;
  color: white;
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.4);
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

.cro .ica-card-container {
  display: flex;
  flex-direction: column;
  min-height: 250px;
}
.cro .ica-card-container h1, .cro .ica-card-container h3 {
   align-self: flex-start;
}
.cro .ica-card-container h1 {
   color: #EB1F07;
}
.cro .ica-card-container a {
align-self: flex-start;
max-width: 250px;
margin-top:-160px;
}
.cro .ica-card-container img {
  max-width: 385px;
  width: 80%;
 align-self: flex-end;
margin-top:-120px;
}

@media only screen and (max-width: 960px){
.cro .ica-card-container {
  min-height: none;
}
.cro .ica-card-container h1 {
    line-height: 3rem;
    font-size: 3rem;
    margin-bottom: 0;
}
.cro .ica-card-container h3 {
    line-height: 2rem;
    font-size: 1.7rem;
    margin-bottom: 0;
}
.cro .ica-card-container a {
    align-self: center;
    margin-top:auto;
}
.cro .ica-card-container img {
    align-self: center;
    margin-top:auto;
}
.cro .offers-container {
    width: 100%;
    background-color: white;
    -webkit-filter: drop-shadow( 1px 1px 2px rgba(0,0,0,0.4) );
    filter: drop-shadow( 1px 1px 2px rgba(0,0,0,0.4) );
}
}

</style>`;
            const style = document.createElement('style');
            style.setAttribute('type', 'text/css');
            style.appendChild(document.createTextNode(styles));
            document.querySelector('head').appendChild(style);
        },
        hideElements() {
            [
                '.image-slider',
                '.header-content',
                '.push-items-list',
                '.quicklink-list',
                '.main .link-list',
                '.recipe-category-listing .banner-image',
                '.recipe-category-listing > .col-12 > h2',
                '.search-recipe-container__recipe-count',
                '.recipe-category-listing .recipe-list-items',
            ].forEach((element) => {
                const elm = document.querySelector(element);
                elm.parentNode.removeChild(elm);
            });
        },
        toArray (list) {
            return Array.prototype.slice.call(list);
        },
        addCROClass() {
            document.querySelector('body').classList.add('cro');
        },
        addStyle(element, stl) {
            Object.assign(element.style, stl);
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
        addCoupon(coupon) {
            const self = this;
            const couponItem = self.create('shadow coupons-container__item');
            self.create('', couponItem, coupon.image, 'img');
            self.create('', couponItem, coupon.title, 'h3');
            self.create('', couponItem, coupon.discount, 'h1');
            self.create('', couponItem, coupon.subtitle, 'h4');
            self.create('', couponItem, 'Mer info', 'a');
            self.create('button coupon-button', couponItem, 'Ladda kupong', 'button');
            return couponItem;
        },
        addBanner(banner, index) {
            const self = this;
            const bannerContainer = self.create('banner-container slick-slide slick-cloned');
            const bannerWrapper = self.create('banner-wrapper', bannerContainer);
            const ratingContainer = self.create('rating-star-container', bannerWrapper);
            const couponsContainer = self.create('coupons-container', bannerWrapper);
            const couponsWrapper = self.create('coupons-wrapper', couponsContainer);
            const couponsImageContainer = self.create('coupons-image', bannerWrapper);
            self.create('image', couponsImageContainer, banner.image, 'img');
            self.create('offer-text', ratingContainer, 'Erbjudande på:', 'h3');
            self.create('recipepage__headline', ratingContainer, banner.title, 'h1');
            self.create('recipe-header__difficulty', ratingContainer, banner.cookTime);
            self.create('button banner-button', bannerWrapper, 'Lägg till recept', 'button');
            self.addStyle(bannerContainer, { 'width': '624px' });
            bannerContainer.dataset.slickIndex = index;
            banner.coupons.forEach((coupon) => {
                couponsWrapper.appendChild(self.addCoupon(coupon));
            });
            return bannerContainer;
        },
        addBanners() {
            const self = this;
            const header = document.querySelector('.header');
            const imageSlider = self.create('slick-class slick-initialized slick-slider', header);
            self.create('slick-prev slick-arrow', imageSlider, 'Previous', 'button');
            self.create('slick-next slick-arrow', imageSlider, 'Next', 'button');
            const slickList = self.create('slick-list draggable', imageSlider);
            const slickTrack = self.create('slick-track', slickList);
            self.addStyle(slickTrack, {
                'opacity': '1',
                'width': '1872px',
                'transform': 'translate3d(0px, 0px, 0px)'
            });
            banners.forEach((banner, index) => {
                slickTrack.appendChild(self.addBanner(banner, index));
            });
        },
        addIcaCard() {
            const self = this;
            const icaImageContainer = self.create('ica-card-container');
            self.create('', icaImageContainer, 'ICA-Kortet ger mer rabatt!', 'h1');
            self.create('', icaImageContainer, 'Bli ICA-bonusmedlem.', 'h3');
            self.create('', icaImageContainer, 'https://www.ica.se/ImageVaultFiles/id_61323/cf_259/ansok-ica-kort.png', 'img');
            self.create('button', icaImageContainer, 'Skapa konto och bli medlem', 'button');
            document.querySelector('.main').appendChild(icaImageContainer);
        },
        manipulateDom: function () {
            this.addCROClass();
            this.hideElements();
            this.addBanners();
            this.addIcaCard();
        }
    };

    test.addStyles();

    $(document).ready(function (){
        test.manipulateDom();
    });
})(jQuery);
