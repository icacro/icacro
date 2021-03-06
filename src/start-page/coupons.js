import { ELM } from '../util/main';
import { ajax, storage, getElementContentByTagAndAttr, save } from '../util/utils';
import './coupons-style.css';

const coupons = {
  printBanner(content, {
    title,
    discount,
    preamble,
    url,
    img,
    isUsed,
    id,
    data,
  }) {
    const isUsedClass = isUsed ? 'is-used' : '';
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
    ] = ELM.create([
      `banner`,
      'banner-row',
      'banner-column',
      'banner-column grow-one',
      'banner-column',
      'banner-column__image',
      `h1`,
      `span`,
      `p`,
      `img`,
      'a',
      `button .button download ${isUsedClass}`,
    ]);
    const buttonText = isUsed ? 'Kupong laddad' : 'Ladda kupong';
    bannerElement.attr('id', `banner-${id}`);

    imgHolder.image(img);
    imgElement.append(imgHolder);

    readMore.href(`/kampanj/hse/${id}`).text('Läs mer');
    downLoad.href(url).text(buttonText);

    titleElement.html(title);
    discountElement.html(discount);
    preambleElement.html(preamble);

    bannerColumn1.append(imgElement);
    bannerColumn2.appendAll(titleElement, discountElement, preambleElement, readMore);
    bannerColumn3.append(downLoad);

    bannerRow.appendAll(bannerColumn1, bannerColumn2, bannerColumn3);
    bannerElement.append(bannerRow);
    content.append(bannerElement);

    downLoad.click(event => this.onClick(event, data));
    // this.save(id, bannerElement);

    icadatalayer.add('HSE', {
      HSE: {
        action: 'display',
        title: data.PageName,
        hseurl: `/kampanj/hse/${id}`,
      },
    });
  },
  async loadCouponOnCard(data) {
    await this.ajax(`/api/jsonhse/Claimoffer`, {
      credentials: 'same-origin',
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  },
  checkActionCookie() {
    const coupon = this.storage.get('coupon');
    if (coupon && this.isLoggedIn()) {
      this.storage.remove('coupon');
      this.loadCouponOnCard(coupon);
    }
  },
  deactivateCoupon(id) {
    ELM.get(`#banner-${id}`).get('button').css('is-used');
  },
  async onClick(event, data) {
    event.preventDefault();
    if (this.isLoggedIn()) {
      this.deactivateCoupon(data.id);
      await this.loadCouponOnCard(data);
      icadatalayer.add('HSE', {
        HSE: {
          action: 'coupon-loaded',
          name: data.PageName,
          offer: data.ProductName,
          hseurl: `/kampanj/hse/${data.id}`,
        },
      });
    } else {
      icadatalayer.add('HSE', {
        HSE: {
          action: 'login-mousedown',
          name: data.PageName,
          hseurl: `/kampanj/hse/${data.id}`,
        },
      });
      this.storage.set('coupon', data);
      this.createModal();
    }
  },
  loadBanners(ids, content) {
    ids.forEach((id) => {
      this.ajax(`https://www.ica.se/api/jsonhse/${id}`, { credentials: 'same-origin' })
        .then((response) => {
          const {
            PageName,
            Header,
            Offer,
            CampaignId,
            StoreGroupId,
            StoreId,
          } = response;
          const {
            ProductName,
            LoadedOnCard,
            OfferCondition,
            Brand,
            SizeOrQuantity,
            OfferId,
          } = Offer;

          const data = {
            id,
            CampaignId,
            ProductName,
            PageName,
            OfferId,
            StoreId,
            StoreGroupId,
          };
          this.printBanner(content, {
            data,
            id,
            isUsed: LoadedOnCard,
            title: Header,
            discount: OfferCondition.Conditions[0],
            preamble: `${Brand} ${SizeOrQuantity.Text}`,
            url: '',
            img: Offer.Image.ImageUrl.replace('http:', 'https:'),
          });
        });
    });
  },
  addIframe() {
    const returnUrl = encodeURIComponent(window.location.href);
    const iframe = ELM.create('cro-iframe-container');
    const iframeContainer = `<span class="loader"></span><iframe src="//www.ica.se/logga-in/?returnurl=${returnUrl}" frameborder="0"></iframe>`;
    iframe.html(iframeContainer);
    ELM.get('body').append(iframe);
  },
  manipulateDom(ICACRO, createModal) {
    Object.assign(this, ICACRO, {
      createModal,
      getElementContentByTagAndAttr,
      ajax,
      save,
      storage,
    });
    const content = ELM.get('#content');
    const regexp = /www.ica.se\/kampanj\/hse/g;
    const banners = this.getElementContentByTagAndAttr(regexp, 'a', 'href');
    const ids = banners.map(banner => banner.match(/\d+$/)[0]);
    this.addIframe();
    content.html(' ');
    this.loadBanners(ids, content);
    this.checkActionCookie();
  },
};

export default coupons;
