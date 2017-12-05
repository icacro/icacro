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
  setActionCookie(offerId) {
    const d = new Date();
    d.setDate(new Date().getDate() + 1); // expires tomorrow

    ICA.legacy.setCookie('cro_personalOffer_actionCookie_loadCoupon', offerId, d);
  },
  getActionCookie() {
    const actionCookie = ICA.legacy.getCookie('cro_personalOffer_actionCookie_loadCoupon');
    if (actionCookie) {
      ICA.legacy.killCookie('cro_personalOffer_actionCookie_loadCoupon');
    }
    return +actionCookie;
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
      this.setActionCookie(data.CampaignId);
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
  manipulateDom(ICACRO) {
    Object.assign(this, ICACRO);
    const content = $ELM.get('#content');
    const regexp = /www.ica.se\/kampanj\/hse/g;
    const banners = this.getElementContentByTagAndAttr(regexp, 'a', 'href');
    const ids = banners.map(banner => banner.match(/\d+$/)[0]);
    content.html(' ');
    this.loadBanners(ids, content);
  },
};

export default coupons;
