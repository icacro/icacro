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
  const couponId = 458288;
    const banner = {
      title: 'Banner',
      cookTime: '45 MIN | ENKELT',
      stars: 4,
      preamble: 'En variant på....',
      img: '/imagevaultfiles/id_171018/cf_5291/raggmunk-med-lingonapple-v47-723024.jpg'
    };
    let coupon = {
      title: 'Banner',
      discount: '5kr rabatt',
      stars: 4,
      preamble: 'En variant på....',
      img: '/imagevaultfiles/id_171018/cf_5291/raggmunk-med-lingonapple-v47-723024.jpg'
    };
    const test = {
        addStyles: function () {
          const coupon = `.hse-recipe-list{background-color:#F8EBF3}.hse-recipe-list:first-of-type{padding-top:1px}.hse-recipe-list__wrapper{align-items:center;background-color:#FFF;display:flex;flex-direction:row;margin:10px 15px;min-height:133px;position:relative}.hse-recipe-list__wrapper::after{background:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDIxLjAuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCAxMCAyMCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMTAgMjA7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPHN0eWxlIHR5cGU9InRleHQvY3NzIj4KCS5zdDB7ZmlsbDojRjhFQkYzO30KPC9zdHlsZT4KPHBhdGggY2xhc3M9InN0MCIgZD0iTTIuNDk3MDIxLDkuOTg4ODA3YzAsNC4xNDIxNTEsMy4zNTc4NDksNy41MDAwMDEsNy41LDcuNTAwMDAxdi0xNQoJQzUuODU0ODcsMi40ODg4MDcsMi40OTcwMjEsNS44NDY2NTYsMi40OTcwMjEsOS45ODg4MDd6Ii8+Cjwvc3ZnPgo=) space;background-size:13px 26px;bottom:0;content:'';display:block;height:100%;position:absolute;right:0;top:0;width:13px}.hse-recipe-list__offer-content h1{font-size:1.6rem;line-height:1.3;margin-bottom:0}@media (min-width:480px){.hse-recipe-list__offer-content{border-left:0!important;padding-left:0!important}.hse-recipe-list__offer-content h1{font-size:1.8rem}}.hse-recipe-list__offer-content span{color:#EB1F07;font-family:icarubrik;font-size:2.2rem;font-weight:700}.hse-recipe-list__offer-content p{color:#808283;font-size:1.3rem;line-height:1}.hse-recipe-list .coupon-load-wrapper{padding-left:0;padding-right:0;right:20px}.hse-recipe-list .coupon-load-wrapper .button--load-coupon{align-items:center;background:#F8EBF3;color:#A02971;cursor:pointer;display:flex;flex-direction:column;justify-content:center;line-height:1.4rem}.hse-recipe-list .coupon-load-wrapper .button--onload-coupon{margin:0 auto;min-width:0;transition:width .2s 250ms ease,color .1s .2s ease;width:90px}@media (min-width:768px){.hse-recipe-list .coupon-load-wrapper .button--onload-coupon{width:115px}}@media (min-width:1024px){.hse-recipe-list .coupon-load-wrapper .button--onload-coupon{width:150px}}.hse-recipe-list .coupon-load-wrapper .button--onload-coupon.loading{color:transparent;height:40px;margin:0 auto;position:relative;transition:width 250ms ease,color .1s ease;width:40px}.hse-recipe-list .coupon-load-wrapper .button--onload-coupon.loading .loader{display:inline-block}.hse-recipe-list .coupon-load-wrapper .button--onload-coupon .loader{border-width:4px;display:none;height:28px;margin-left:-14px;margin-top:-14px;width:28px}.hse-recipe-list.offer-loaded{background-color:#F7F7F7;margin-top:10px!important}.hse-recipe-list.offer-loaded .hse-recipe-list__wrapper::after{background:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDIxLjAuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCAxMCAyMCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMTAgMjA7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPHN0eWxlIHR5cGU9InRleHQvY3NzIj4KCS5zdDB7ZmlsbDojRjdGN0Y3O30KPC9zdHlsZT4KPHBhdGggY2xhc3M9InN0MCIgZD0iTTIuNDk3MDIxLDkuOTg4ODA3YzAsNC4xNDIxNTEsMy4zNTc4NDksNy41MDAwMDEsNy41LDcuNTAwMDAxdi0xNQoJQzUuODU0ODcsMi40ODg4MDcsMi40OTcwMjEsNS44NDY2NTYsMi40OTcwMjEsOS45ODg4MDd6Ii8+Cjwvc3ZnPgo=) space}.hse-recipe-list.offer-loaded .hse-recipe-list__wrapper img{filter:grayscale(1);opacity:.4}.hse-recipe-list.offer-loaded .hse-recipe-list__offer-content span{color:#D5D7DA}.hse-recipe-list.offer-loaded .coupon-load-wrapper a{background:#DDE9BF;color:#8DB72C;pointer-events:none;transition:width .2s ease,color .2s 250ms ease,background .2s ease}.hse-modal-login{padding:30px 0;text-align:center}.hse-modal-login h3{margin:0 0 15px;max-width:none}.hse-modal-login p{max-width:none}`;
            const styles = `
              ${coupon}
              .cro .personal-offer {
                background-color: white;
                padding: 15px 10px;
                margin-bottom: 10px;
              }
              .cro .personal-offer .toggle-personal-offer {
                color: #a02971;
                font-family: icatext;
                font-weight: 600;
                width: 100%; display: flex; justify-content: flex-end; cursor: pointer;
              }
              .cro .personal-offer .toggle-personal-offer__svg {
                align-self: flex-end;
                height: 20px;
              }

              .cro .personal-offer__toggle-header {
                display: none;
                flex-grow: 1;
                margin: 0;
              }

              .cro .personal-offer--hidden .personal-offer__container { display: none; }
              .cro .personal-offer--hidden .personal-offer__toggle-header { display: block; }
              .cro .personal-offer--hidden .toolbar__icon--indicator { transform: rotateZ(180deg) translateY(2px); }

              .cro .personal-offer .toolbar__icon--indicator { fill: #a02971; }


              .cro .personal-offer__preamble, .cro .personal-offer__preamble--strong { display: block; margin-bottom: 10px; }
              .cro .personal-offer__recipe-and-coupon {
                display: flex;
                flex-direction: row;
              }
              .cro .personal-offer__recipe-and-coupon-l50-s100 { width: 50%; display: flex; flex-direction: row; }
              .cro .personal-offer__recipe-and-coupon-l50-s100 .personal-offer__recipe-text {
                width:100%;
              }
              .cro .personal-offer__recipe-and-coupon-l50-s100 .personal-offer__recipe-image {
                padding-right:10px;
                height: 100%;
              }
              .cro .personal-offer__recipe-and-coupon-l50-s100 h2 { font-size: 2rem; font-weight: bold; margin: 0; line-height: 1; }
              .cro .personal-offer__recipe-and-coupon-l50-s100 h4 {
                  margin: 0 0 5px;
                  padding: 0;
                  font-size: 1.2rem;
                  color: #808283;
                  line-height: 1;
              }
              .cro .personal-offer__recipe-and-coupon-l50-s100 .personal-offer__recipe-text p {
                  margin: 0;
                  line-height: 1;
              }
              .cro .personal-offer__recipe-and-coupon-l50-s100 svg .active { fill: #A02971; }
              .cro .personal-offer__recipe-and-coupon-l50-s100 svg {
                  display: inline-block;
                  fill: #D5D7DA;
                  height: 18px;
                  vertical-align: middle;
                  width: 91px;
              }
              @media (max-width: 980px) {
                .cro .dashboard { position: relative; }
                .cro .dashboard .toolbars-wrapper { position: absolute; top: 0; left: 0;}
                .cro .personal-offer { margin-top: 58px; }
              }
              @media (max-width: 520px) {
                .cro .personal-offer__recipe-and-coupon { flex-direction: column; }
                .cro .personal-offer__recipe-and-coupon-l50-s100 { width: 100%; }
                .cro .personal-offer__recipe-and-coupon-l50-s100 .personal-offer__recipe-text p { display: none; }
              }
            `;
            const style = document.createElement('style');
            style.setAttribute('type', 'text/css');
            style.appendChild(document.createTextNode(styles));
            document.querySelector('head').appendChild(style);
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
                ${strs.join('')}</svg>`;
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
        addRecepie() {
            const self = this;
            const container = self.create('personal-offer__recipe-and-coupon-l50-s100');
            const containerImage = self.create('personal-offer__recipe-image', container);
            const containerText = self.create('personal-offer__recipe-text', container);
            self.create('', containerImage, banner.img, 'img');
            self.create('', containerText, banner.cookTime, 'h4');
            self.create('', containerText, banner.title, 'h2');
            self.create('', containerText, banner.preamble, 'p');
            self.create('', containerText).innerHTML = self.addStars(banner.stars);
            return container;
        },
        addCoupon() {
            const self = this;
            const container = self.create('personal-offer__recipe-and-coupon-l50-s100');
            const loginUrl = `/logga-in?returnUrl=${encodeURIComponent(window.location)}`;
            const kupongCta = `<a href="#" data-url="" data-login-url="${loginUrl}" class="button button--auto-width button--load-coupon js-loggin-btn">Ladda kupong</a>`;

            const kupongTemplate =
              `<article class="hse-recipe-list grid_fluid pl loaded">
                  <div class="hse-recipe-list__wrapper">
                      <div class="column size6of20 lg_size5of20">
                          <picture>
                             <img src="${coupon.img}">
                          </picture>
                      </div>
                      <div class="column size10of20 lg_size10of20 hse-recipe-list__offer-content">
                        <h1>${coupon.title}</h1>
                  <span>${coupon.discount}</span>
                  <p>${coupon.preamble}</p>
                  <a href="/kampanj/hse/458288">Mer info</a>
                      </div>
                      <div class="column size6of20 lg_size5of20 coupon-load-wrapper" data-offerid="${coupon.offerId}">
                          ${kupongCta}
                      </div>
                  </div>

              </article>`;
            container.innerHTML = kupongTemplate;
            return container;
        },
        addToggleButton(personalOffer){
          const self = this;
          const arrow = `
              <svg class="toolbar__icon toolbar__icon--indicator" viewBox="0 0 32 32" width="20px" height="20px">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/Assets/icons/sprite.svg#arrow-up"></use>
              </svg>
          `;
          const toggle = self.create('toggle-personal-offer', personalOffer, '', 'div');
          self.create('personal-offer__toggle-header', toggle, 'Personligt erbjudande', 'h3');
          self.create('toggle-personal-offer__text', toggle, 'Dölj', 'span');
          const svg = self.create('toggle-personal-offer__svg', toggle, null, 'span');
          svg.innerHTML = arrow;
          return toggle;
        },
        addBlock() {
            const self = this;
            const personalOffer = self.create('personal-offer');
            const toggle = self.addToggleButton(personalOffer);
            const container = self.create('personal-offer__container', personalOffer);
            toggle.addEventListener('click', () => {
              if (personalOffer.classList.contains('personal-offer--hidden')) {
                personalOffer.classList.remove('personal-offer--hidden');
              } else {
                personalOffer.classList.add('personal-offer--hidden');
              }
            });
            self.create('personal-offer__h1', container, 'Hej', 'h1');
            self.create('personal-offer__preamble--strong', container, 'Efter', 'strong');
            self.create('personal-offer__preamble--strong', container, 'I sådana fall....', 'span');

            const recipeAndCoupon = self.create('personal-offer__recipe-and-coupon', container);
            recipeAndCoupon.appendChild(self.addRecepie());
            recipeAndCoupon.appendChild(self.addCoupon());
            return personalOffer;
        },
        addCROClass() {
            document.querySelector('body').classList.add('cro');
        },
        manipulateDom: function () {
            this.addCROClass();
            const container = this.addBlock();
            const dashboard = document.querySelector('#dashboard');
            dashboard.insertBefore(container, dashboard.firstChild);
          this.loadCouponData();
        },
      loadCouponData() {
        const self = this;
        window.fetch(`/api/jsonhse/${couponId}`)
          .then((response) => response.json())
          .then((json) => coupon = $().extend({}, coupon, json));
      }
    };

    test.addStyles();

    $(document).ready(function (){
        test.manipulateDom();
    });
})(jQuery);
