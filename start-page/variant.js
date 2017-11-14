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
        stars: 4,
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
        stars: 4,
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
        stars: 4,
        cookTime: '60 MIN | MEDEL',
        image: 'https://www.ica.se/imagevaultfiles/id_155207/cf_259/torsk-med-potatis-och-aggsas-i-kastrull-721634-lit.jpg',
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

.cro .banner-wrapper .banner-image {
  height: 220px;
  overflow: hidden;
}

.cro .banner-wrapper .banner-image img {
  width: 100%;
  position: relative;
  margin-left: 0 !important;
  height: auto !important;
  min-width: 375px;
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

.cro .rating-star-container .headline {
  font-size: 36px;
  margin-bottom: 5px;
  margin-top: 5px;
  max-width: none;
  font-family: icarubrik;
  font-weight: 600;
  line-height: 3rem;
}

.cro .rating-star-container .difficulty {
  text-transform: uppercase;
  font: 16px icatext;
  font-weight: 900;
  margin-top: 6px;
}

.cro .rating-star-container .offer-text {
  font: 19px icatext, sans-serif;
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
    font-size: 24px;
    margin-bottom: -10px;
    font-weight: 100;
    font-family: icatext;
    margin-top: 10px;
}
.cro .ica-card-container a {
    align-self: center;
    margin-top: 20px;
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

@media (max-width: 767px) { .cro .cro-iframe-container { padding-bottom: 135% !important; } }
.cro > .cro-iframe-container { display: none; }
.cro .modal-copntainer .cro-iframe-container { display: initial; }
.cro .container { text-align: center; margin-top: 50px;}
.cro .container h2 { font: 28px icahand; margin-bottom: 20px; }
.cro .cro-iframe-container {
  position: relative;
  height: 0;
  overflow: hidden;
  padding-bottom: 85%;
  background-color: #F3F0EB;
}
.cro .cro-iframe-container iframe {
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.cro .usp-list li {
  font: 24px icarubrik;
  font-weight: 600;
  margin-bottom: 15px;
}
.cro .usp-list svg {
  fill: #8DB72C;
margin-right: 5px;
}
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
        addStars(stars) {
            const arr = ['0', '26', '52', '78', '104'];
            const strs = arr.map((x, index) => (
`<g transform="translate(${x} 0)" class="${index < stars ? 'active' : ''}">
<path d="M23.2 10.303q.194.509-.073.97-1.188 2.182-5.067 5.479 1.018 4.194 1.212 6.715.049.679-.533 1.067-.315.194-.63.194-.242 0-.533-.121-.412-.242-1.333-.679-3.273-1.624-4.606-2.473-1.333.849-4.606 2.473-.921.436-1.333.679-.606.315-1.164-.073-.582-.388-.533-1.067.194-2.521 1.212-6.715-3.879-3.297-5.067-5.479-.267-.461-.073-.97.17-.509.63-.679 1.358-.606 6.861-.8 1.988-5.77 3.248-7.03.388-.339.824-.339.461 0 .8.339 1.285 1.261 3.273 7.03 5.503.194 6.861.8.461.194.63.679z"></path>
</g>`));
          return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-0.12099626660346985 1.4550001621246338 127.39400121569633 25.34600469470024">
<linearGradient id="half" x1="0" x2="100%" y1="0" y2="0">
<stop offset="50%" stop-color="currentColor"></stop>
<stop offset="50%" stop-color="#d5d7da"></stop>
</linearGradient>
${strs.join('')}
</svg>`;
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
            const couponsImageContainer = self.create('banner-image', bannerWrapper);
            self.create('image', couponsImageContainer, banner.image, 'img');

            self.create('offer-text', ratingContainer, 'Erbjudande på:', 'h3');
            self.create('headline', ratingContainer, banner.title, 'h1');
            self.create('rating', ratingContainer).innerHTML = self.addStars(banner.stars);
            self.create('difficulty', ratingContainer, banner.cookTime, 'h4');
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
            let usps = self.create('usp-list', icaImageContainer, null, 'ul');
            usps.innerHTML = `
<li><svg viewBox="0 0 32 32" width="15px" height="15px"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/Assets/icons/sprite.svg#check"></use></svg> ICA-kort med bonus</li>
<li><svg viewBox="0 0 32 32" width="15px" height="15px"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/Assets/icons/sprite.svg#check"></use></svg> Personliga erbjudanden</li>
<li><svg viewBox="0 0 32 32" width="15px" height="15px"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/Assets/icons/sprite.svg#check"></use></svg> Kortpriser varje vecka</li>
`;
            self.create('button', icaImageContainer, 'Skapa konto och bli medlem', 'a')
              .href = '/ansokan/?step=6369766963666f726d';
            document.querySelector('.main').appendChild(icaImageContainer);

        },
        manipulateDom: function () {
          let recipeId = this.getActionCookie();
          if (recipeId && this.isLoggedIn()) {
            this.addRecipeToShoppingList(recipeId);
            this.saveRecipe(recipeId);
            this.addRecipeToSavedList(recipeId);
          }

            this.addCROClass();
            this.hideElements();
            this.addBanners();
            this.addIcaCard();

            var returnUrl = encodeURIComponent(window.location.href);
            var iframeContainer = $('<div class="cro-iframe-container"><span class="loader"></span><iframe src="//www.ica.se/logga-in/?returnurl=' + returnUrl + '" frameborder="0"></iframe></div>');
            $('body').append(iframeContainer);
        },
      createSaveRecipeCTA(banner, parentNode) {
        const self = this;
        let savedRecipes = self.getSavedRecipes();
        if (savedRecipes.includes(banner.recipeId)) return;

        const cta = self.create('button banner-button', parentNode, 'Lägg till i inköpslistan och spara recept', 'a');
        cta.href = `/logga-in/?returnUrl=${encodeURIComponent(window.location)}`;
        cta.dataset['recipeId'] = banner.recipeId;
        cta.dataset['tracking'] = `{ "name": "${banner.title}", "URL": "${banner.url}" }`;
        cta.classList.add('js-add-to-new-shoppinglist');
        cta.onclick = (e) => {
          e.preventDefault();
          self.setActionCookie(banner.recipeId);
          self.createModal();
        };
      },
      addRecipeToShoppingList(recipeId) {
        // tracking sker via klassnamn

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
        let banner = banners.filter((b) => b.recipeId == recipeId)[0];

        dataLayer.push({
          'event': 'recipe-save',
          'name': banner.title,
          'URL': banner.url
        });

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

        return +actionCookie; // coerce to number
      },
      addRecipeToSavedList(recipeId) {
        let self = this;
        let d = new Date();
        d.setDate(new Date().getDate() + 1); // expires tomorrow

        let savedRecipes = self.getSavedRecipes();

        savedRecipes.push(recipeId);

        ICA.legacy.setCookie('cro_start_savedRecipes', JSON.stringify(savedRecipes), d);
      },
      getSavedRecipes() {
        let cookie = ICA.legacy.getCookie('cro_start_savedRecipes');
        return cookie ? JSON.parse(cookie) : [];
      },
      // hotjarTriggered: false,
      loaderIsActive: false,
        buttonHandlerPollTimeout: null,
        showLoader: function() {
            var container = $('.cro-iframe-container');
            container.find('.loader').show();
            container.find('iframe').css('opacity', '0');
            this.loaderIsActive = true;
        },
        hideLoader: function() {
            var container = $('.cro-iframe-container');
            container.find('.loader').hide();
            container.find('iframe').css('opacity', '1');
            this.loaderIsActive = false;
        },
        addButtonHandlerPoll: function () {
            var self = this;
            var iframe = $('.cro-iframe-container iframe');
            var e = iframe.contents().find('.remodal-wrapper #grey-card-btn, .remodal-wrapper .pink-card-btn');

            if (e.length) {
                e.click(function () {
                    self.showLoader();
                });
                window.clearTimeout(self.buttonHandlerPollTimeout);
            } else {
                self.buttonHandlerPollTimeout = window.setTimeout(self.addButtonHandlerPoll.bind(self), 1000);
            }
        },
        addEventListeners: function () {
            var self = this;

            $('.header').off('mousedown');

            $(window).on("message onmessage", function(e) {
                var origin = window.location.protocol + '//' + window.location.host;
                if (e.originalEvent.origin === origin && /mobilebankid/i.test(e.originalEvent.data)) {
                    self.showLoader();
                }
            });
        },
        getIframeStyles: function () {
            var styles = '<style type="text/css">' +
                '@media  (max-width: 767px) {' +
                'h3.greeting, h3.card-heading { font-size: 18px; }' +
                'img.card-icon { width: 50px; }' +
                '.select-card-modal { border: 0; padding: 0; margin: 0; }' +
                '.remodal-wrapper { padding: 0; }' +
                '}' +
                '</style>';
            return styles;
        },
        createModal: function (action = '') {
            var self = this;
            var modal = new coreComponents.modal({
                tpl: $('.cro-iframe-container').get(0),
                size: 'md',
                container: $('.modal-container').get(0)
            });

            setTimeout(function () {
                self.showLoader();

                var iframe = $('.cro-iframe-container iframe');

                iframe.on('load', function () {
                    var regex = new RegExp(`^${window.location.href}$`, 'gi');
                    if(regex.test(this.contentWindow.location)) {
                        window.location.reload(true);
                    }

                    if(this.contentWindow.location.href.indexOf('logga-in') !== -1) {
                        var headerBarTimeout = window.setTimeout(hideHeaderBar, 10);
                        var appendHeaderTimeout =  window.setTimeout(appendHeader, 10);
                        var addStylesTimeout = window.setTimeout(addStyles, 10);
                        var addIframeTrackingTimeout = window.setTimeout(addIframeTracking, 10);
                        var hideHeaderBarDeferred = $.Deferred();
                        var appendHeaderDeferred = $.Deferred();
                        var addStylesDeferred = $.Deferred();
                        var addIframeTrackingDeferred = $.Deferred();

                        $.when(hideHeaderBarDeferred,
                               appendHeaderDeferred,
                               addStylesDeferred,
                               addIframeTrackingDeferred).done(function() {
                            self.hideLoader();
                        });

                        function hideHeaderBar() {
                            var e = $('.cro-iframe-container iframe').contents().find('.header-bar');
                            if (e.length) {
                                e.hide();
                                window.clearTimeout(headerBarTimeout);
                                hideHeaderBarDeferred.resolve();
                            } else {
                                headerBarTimeout = window.setTimeout(hideHeaderBar, 0);
                            }
                        }

                        function appendHeader() {
                            var e = $('.cro-iframe-container iframe').contents().find('h1');
                            if (e.length) {
                                e.append(' för att lägga till i inköpslistan och spara recept');
                                e.css({ 'font-family': 'icahand, arial, sans-serif', 'font-size': '3rem' });

                                if (window.screen.width < 768) {
                                    e.css('font-size', '18px');
                                    e.parent().css('margin', '0');
                                }
                                window.clearTimeout(appendHeaderTimeout);
                                appendHeaderDeferred.resolve();
                            } else {
                                appendHeaderTimeout = window.setTimeout(appendHeader, 0);
                            }
                        }

                        function addStyles() {
                            var e = $('.cro-iframe-container iframe').contents().find('body');
                            if (e.length) {
                                e.append(self.getIframeStyles());
                                window.clearTimeout(addStylesTimeout);
                                addStylesDeferred.resolve();
                            } else {
                                addStylesTimeout = window.setTimeout(addStyles, 0);
                            }
                        }

                        function addIframeTracking() {
                            var e = $('.cro-iframe-container iframe').contents();
                            if (e.length) {
                                var eventAction = 'Spara recept från startsidan';

                                // Fortsätt (Mobilt BankId)
                                e.find('#submit-login-mobile-bank-id').on('click', function () {
                                    ga('send', 'event', 'A/B', eventAction, 'Logga in - Mobilt BankId');
                                });

                                // Behöver du hjälp (Mobilt BankId)
                                e.find('.login-support-bank-id-link').on('click', function () {
                                    ga('send', 'event', 'A/B', eventAction, 'Behöver du hjälp');
                                });

                                // Skapa konto (Mobilt BankId)
                                e.find('.get-mobile-bank-id-link').on('click', function () {
                                    ga('send', 'event', 'A/B', eventAction, 'Skapa konto - Mobilt BankId');
                                });

                                // Logga in (Lösenord)
                                e.find('#log-in-submit').on('click', function () {
                                    ga('send', 'event', 'A/B', eventAction, 'Logga in - Lösenord');
                                });

                                // Glömt lösenord (Lösenord)
                                e.find('.login-support-password-link').on('click', function () {
                                    ga('send', 'event', 'A/B', eventAction, 'Glömt lösenord');
                                });

                                // Skapa konto (Lösenord)
                                e.find('.create-account-link').on('click', function () {
                                    ga('send', 'event', 'A/B', eventAction, 'Skapa konto - Lösenord');
                                });

                                window.clearTimeout(addIframeTrackingTimeout);
                                addIframeTrackingDeferred.resolve();
                            } else {
                                addIframeTrackingTimeout = window.setTimeout(addIframeTracking, 0);
                            }
                        }
                    }

                    $('.cro-iframe-container iframe').contents().find('form').on('submit', function(e) {
                        if (!$(this).find('input.error').length) {
                            self.showLoader();
                        }
                    });

                    $('.cro-iframe-container iframe').contents().find('#submit-login-mobile-bank-id').on('click', function() {
                        if (!$(this).find('input.error').length) {
                            self.buttonHandlerPollTimeout = setTimeout(self.addButtonHandlerPoll.bind(self), 1000);
                        }
                    });

                    $('.cro-iframe-container iframe').contents().find('a[href*="www.ica.se"]').each(function () {
                        $(this).attr('href', $(this).attr('href').replace('http://', 'https://'));
                    }).click(function (e) {
                        window.location.href = $(this).attr('href');
                        e.preventDefault();
                    });
                });

                // trigga hotjar heatmap första gången modalen öppnats
                // if (typeof hj === 'function' && !self.hotjarTriggered) {
                //     hj('trigger', 'variant');
                //     self.hotjarTriggered = true;
                // }
            }, 50);
        },
      isLoggedIn() {
        return $('#hdnIcaState').val() ? true : false;
      }
    };

    test.addStyles();

    $(document).ready(function (){
        test.manipulateDom();
        test.addEventListeners();
        ICA.icaCallbacks.initUnslider();
    });
})(jQuery);
