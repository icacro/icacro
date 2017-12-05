import { $ELM } from '../util/main';
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
    const isUsedClass = isUsed ? ' is-used' : '';
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
    );
    const buttonText = isUsed ? 'Kupong laddad' : 'Ladda kupong';

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
    $ELM.save(id, bannerElement);

    icadatalayer.add('HSE', {
      HSE: {
        action: 'display',
        title: data.PageName,
        hseurl: `/kampanj/hse/${data.CampaignId}`,
      },
    });
  },
  async loadCouponOnCard(data) {
    await this.load(`/api/jsonhse/Claimoffer`, {
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
    $ELM.get(id).get('button').css('is-used');
  },
  async onClick(event, data) {
    event.preventDefault();
    if (this.isLoggedIn()) {
      this.deactivateCoupon(data.CampaignId);
      await this.loadCouponOnCard(data);
      icadatalayer.add('HSE', {
        HSE: {
          action: 'coupon-loaded',
          name: data.PageName,
          offer: data.ProductName,
          hseurl: `/kampanj/hse/${data.CampaignId}`,
        },
      });
    } else {
      icadatalayer.add('HSE', {
        HSE: {
          action: 'login-mousedown',
          name: data.PageName,
          hseurl: `/kampanj/hse/${data.CampaignId}`,
        },
      });
      this.storage.set('coupon', data);
      this.createModal();
    }
  },
  loadBanners(ids, content) {
    ids.forEach((id) => {
      this.load(`https://www.ica.se/api/jsonhse/${id}`, { credentials: 'same-origin' })
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
            CampaignId,
            ProductName,
            CampaignId,
            PageName,
            OfferId,
            StoreId,
            StoreGroupId,
          };
          this.printBanner(content, {
            data,
            id: CampaignId,
            isUsed: LoadedOnCard,
            title: Header,
            discount: OfferCondition.Conditions[0],
            preamble: `${Brand} ${SizeOrQuantity.Text}`,
            url: '',
            img: Offer.Image.ImageUrl,
          });
        });
    });
  },
  addIframe() {
    const returnUrl = encodeURIComponent(window.location.href);
    const iframe = $ELM.create('cro-iframe-container');
    const iframeContainer = `<span class="loader"></span><iframe src="//www.ica.se/logga-in/?returnurl=${returnUrl}" frameborder="0"></iframe>`;
    iframe.html(iframeContainer);
    $ELM.get('body').append(iframe);
  },
  manipulateDom(ICACRO, createModal) {
    Object.assign(this, ICACRO, { createModal });
    const content = $ELM.get('#content');
    const regexp = /www.ica.se\/kampanj\/hse/g;
    const banners = this.getElementContentByTagAndAttr(regexp, 'a', 'href');
    const ids = banners.map(banner => banner.match(/\d+$/)[0]);
    this.addIframe();
    content.html(' ');
    this.loadBanners(ids, content);
    this.checkActionCookie();
    this.storage.clear();
  },
};

export default coupons;