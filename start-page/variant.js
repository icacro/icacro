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
        recipeId: 721648,
        title: 'Semmelmuffins',
        starts: 4,
        cookTime: '60 MIN | MEDEL',
        image: 'https://www.ica.se/imagevaultfiles/id_155248/cf_259/semmelmuffins-721648-stor.jpg',
        url: 'https://www.ica.se/recept/semmelmuffins-721648/',
        coupons: [
            {
                title: 'Margarin',
                image: 'https://www.ica.se/Handlers/Image.ashx?w=150&h=150&m=p&bgr=fff&u=http://extbild.ica.se//PictureWeb/80/1026/14_1000555305.jpg',
                discount: '5 kr rabatt',
                subtitle: 'Milda 1 kg',
                url: ''
            },
            {
                title: 'Mandelmassa',
                image: 'https://www.ica.se/Handlers/Image.ashx?w=150&h=150&m=p&bgr=fff&u=http://extbild.ica.se//PictureWeb/80/1044/14_1000555323.jpg',
                discount: '25% rabatt',
                subtitle: 'ICA 200 g',
                url: ''
            }
        ]
    },
        {
        recipeId: 721668,
        title: 'Viltskavsgryta med messmör och lingon',
        starts: 4,
        cookTime: '45 MIN | MEDEL',
        image: 'https://www.ica.se/imagevaultfiles/id_155280/cf_259/viltskavsgryta-med-messmor-och-lingon-721658-liten.jpg',
        url: 'https://www.ica.se/recept/viltskavsgryta-med-messmor-och-lingon-721668/',
        coupons: [
            {
                title: 'Margarin',
                image: 'https://www.ica.se/Handlers/Image.ashx?w=150&h=150&m=p&bgr=fff&u=http://extbild.ica.se//PictureWeb/80/1026/14_1000555305.jpg',
                discount: '5 kr rabatt',
                subtitle: 'Milda 1 kg',
                url: ''
            },
            {
                title: 'Buljongkuber',
                image: 'https://www.ica.se/Handlers/Image.ashx?w=150&h=150&m=p&bgr=fff&u=http://extbild.ica.se//PictureWeb/80/1028/14_1000555307.jpg',
                discount: '25% rabatt',
                subtitle: 'Knorr 6-pack',
                url: ''
            }
        ]
    },
        {
        recipeId: 721644,
        title: 'Torsk med potatis och äggsås i kastrull',
        starts: 4,
        cookTime: '60 MIN | MEDEL',
        image: 'https://www.ica.se/imagevaultfiles/id_171018/cf_259/raggmunk-med-lingonapple-v47-723024.jpg',
        url: 'https://www.ica.se/recept/torsk-med-potatis-och-aggsas-i-kastrull-721644/',
        coupons: [
            {
                title: 'iMat',
                image: 'https://www.ica.se/Handlers/Image.ashx?w=150&h=150&m=p&bgr=fff&u=http://extbild.ica.se//PictureWeb/80/1029/14_1000555308.jpg',
                discount: '15% rabatt',
                subtitle: 'Oatly 250 g',
                url: ''
            },
            {
                title: 'Torskfilé',
                image: 'https://www.ica.se/Handlers/Image.ashx?w=150&h=150&m=p&bgr=fff&u=http://extbild.ica.se//PictureWeb/80/1038/14_1000555317.jpg',
                discount: '5 kr i rabatt',
                subtitle: 'ICA 600 g',
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


.cro .shadow .coupons-container__item img {
width: 100% !important;
margin-left: 0 !important;
}

.shadow {
   -webkit-filter: drop-shadow( 0px 0px 2px rgba(0,0,0,0.2) );
   filter: drop-shadow( 0px 0px 2px rgba(0,0,0,0.2) );
}

.cro .has-hover .image-slider li.active,
.cro .unslider-controls {
  z-index: 21 !important;
}

.cro .banner-container {

   width: 100%;
   height: 100%;
   background-color: white;
   padding: 0 5px;
   z-index: 20 !important;
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

.cro .coupons-container .coupons-container__item .coupons-image {
width: 100%;
height: 60px;
background-repeat: no-repeat;
background-size: contain;
background-position: center;
}

.cro .banner-wrapper .coupons-image {
    height: 220px;
    overflow: hidden;
}

.cro .banner-wrapper .coupons-image img {
    width: 100%;
margin-left: 0 !important;
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
.start-page-icase>header.full-size-image .image-slider, .start-page-icase>header.full-size-image .image-slider ul, .start-page-icase>header.full-size-image .image-slider li {
max-height: 450px;
}
}
.cro .unslider-controls { pointer-events: none; }
.cro .unslider-arrow { pointer-events: auto; }
</style>`;
            const style = document.createElement('style');
            style.setAttribute('type', 'text/css');
            style.appendChild(document.createTextNode(styles));
            document.querySelector('head').appendChild(style);
        },
        hideElements() {
            [
                '.image-slider li',
                '.image-slider .lazy-spinner',
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
        testing() {

        },
        addStars(stars) {
            const arr = ['0', '26', '52', '78', '104'];
            const strs = arr.map((x, index) => (
`<g transform="translate(${x} 0)" class="${index < stars ? 'active' : ''}">
<path d="M23.2 10.303q.194.509-.073.97-1.188 2.182-5.067 5.479 1.018 4.194 1.212 6.715.049.679-.533 1.067-.315.194-.63.194-.242 0-.533-.121-.412-.242-1.333-.679-3.273-1.624-4.606-2.473-1.333.849-4.606 2.473-.921.436-1.333.679-.606.315-1.164-.073-.582-.388-.533-1.067.194-2.521 1.212-6.715-3.879-3.297-5.067-5.479-.267-.461-.073-.97.17-.509.63-.679 1.358-.606 6.861-.8 1.988-5.77 3.248-7.03.388-.339.824-.339.461 0 .8.339 1.285 1.261 3.273 7.03 5.503.194 6.861.8.461.194.63.679z"></path>
</g>`));
          return `<a href="#" class="rating-stars" data-recipeid="722893" data-rating="${stars}" title="${stars}">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="-0.12099626660346985 1.4550001621246338 127.39400121569633 25.34600469470024">
<linearGradient id="half" x1="0" x2="100%" y1="0" y2="0">
<stop offset="50%" stop-color="currentColor"></stop>
<stop offset="50%" stop-color="#d5d7da"></stop>
</linearGradient>
${strs.join('')}
</svg>
</a>`;
        },
        addCoupon(coupon) {
            const self = this;
            const couponItem = self.create('shadow coupons-container__item');
            const img = self.create('coupons-image', couponItem);
            self.addStyle(img, {
              'background-image': `url(${coupon.image})`
            });

            self.create('', couponItem, coupon.title, 'h3');
            self.create('', couponItem, coupon.discount, 'h1');
            self.create('', couponItem, coupon.subtitle, 'h4');
            self.create('', couponItem, 'Mer info', 'a');
            self.create('button coupon-button', couponItem, 'Ladda kupong', 'button');
            return couponItem;
        },
        addBanner(banner, index) {
            const self = this;
            const bannerContainer = self.create('banner-container', null, null, 'li');
            const bannerWrapper = self.create('banner-wrapper', bannerContainer);
            const ratingContainer = self.create('rating-star-container', bannerWrapper);
            const couponsContainer = self.create('coupons-container', bannerWrapper);

            const couponsWrapper = self.create('coupons-wrapper', couponsContainer);
            const couponsImageContainer = self.create('coupons-image', bannerWrapper);
            self.create('image', couponsImageContainer, banner.image, 'img');

            self.create('offer-text', ratingContainer, 'Erbjudande på:', 'h3');
            self.create('offer-text', ratingContainer).innerHTML = self.addStars(banner.stars);
            self.create('recipepage__headline', ratingContainer, banner.title, 'h1');
            self.create('recipe-header__difficulty', ratingContainer, banner.cookTime, 'h4');
            self.createSaveRecipeCTA(banner, bannerWrapper);
            banner.coupons.forEach((coupon) => {
                couponsWrapper.appendChild(self.addCoupon(coupon));
            });
            return bannerContainer;
        },
        addBanners() {
            const self = this;
            const slider = document.querySelector('.image-slider ul');
            banners.forEach((banner, index) => {
                slider.appendChild(self.addBanner(banner, index));
            });
        },
        addIcaCard() {
            const self = this;
            const icaImageContainer = self.create('ica-card-container');
            self.create('', icaImageContainer, 'ICA-Kortet ger mer rabatt!', 'h1');
            self.create('', icaImageContainer, 'Bli ICA-bonusmedlem.', 'h3');
            self.create('', icaImageContainer, 'https://www.ica.se/ImageVaultFiles/id_61323/cf_259/ansok-ica-kort.png', 'img');
            self.create('button', icaImageContainer, 'Skapa konto och bli medlem', 'a')
              .href = '/ansokan/?step=6369766963666f726d';
            document.querySelector('.main').appendChild(icaImageContainer);

        },
        manipulateDom: function () {
            this.addCROClass();
            this.hideElements();
            this.addBanners();
            this.addIcaCard();

            let recipeId = this.getActionCookie();
            if (recipeId) {
                this.addRecipeToShoppingList(recipeId);
                this.saveRecipe(recipeId);
            }
        },
      createSaveRecipeCTA(banner, parentNode) {
        const self = this;
        const cta = self.create('button banner-button', parentNode, 'Lägg till i inköpslistan och spara recept', 'a');
        cta.href = `/logga-in/?returnUrl=${encodeURIComponent(window.location)}`;
        cta.dataset['recipeId'] = banner.recipeId;
        cta.onclick = (e) => {
          self.setActionCookie(banner.recipeId);
        };
      },
      addRecipeToShoppingList(recipeId) {
        // kolla upp med Nicklas vad GTM kräver för nedanstående event
        // dataLayer.push({
        //     'event': 'recipe-add-to-shopping-list'
        // });

        ICA.ajax.post('/Templates/Recipes/Handlers/ShoppingListHandler.ashx', {
          recipeIds: [recipeId],
          ShoppingListId: 0,
          numberOfServings: 0,
          recipes:[],
          shoppingListName: createShoppingsListName()
        });

        function createShoppingsListName() {
          let d = new Date();
          let year = d.getFullYear();
          let month = d.getMonth();
          let day = d.getDate();
          let months = { 10: 'nov', 11: 'dec' }; // testet kommer endast ligga ute i nov, senast dec

          return `Att handla, ${day} ${months[month]} ${year}`;
        }
      },
      saveRecipe(recipeId) {
        // kolla upp med Nicklas vad GTM kräver för nedanstående event
        // dataLayer.push({
        //     'event': 'recipe-save'
        // });

        ICA.ajax.get('/Templates/Recipes/Handlers/FavoriteRecipesHandler.ashx', {
          recipeId: recipeId,
          method: 'Add'
        });
      },
      setActionCookie(recipeId){
        let d = new Date();
        d.setDate(new Date().getDate() + 1); // expires tomorrow

        ICA.legacy.setCookie('saveRecipeAndAddToShoppingListFromStartpage', recipeId, d);
      },
      getActionCookie() {
        let actionCookie = ICA.legacy.getCookie('saveRecipeAndAddToShoppingListFromStartpage');

        if (actionCookie) {
          ICA.legacy.killCookie('saveRecipeAndAddToShoppingListFromStartpage');
        }

        return actionCookie;
      }
    };

    test.addStyles();

    $(document).ready(function (){
        test.manipulateDom();
        ICA.icaCallbacks.initUnslider();
    });
})(jQuery);
