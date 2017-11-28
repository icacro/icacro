const styles = `
.cro header .image-slider {
  position: absolute !important;
}
.start-page > header {
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
  margin-bottom: 5px;
}

.cro .coupons-container .coupons-container__item .coupon-button {
  font-size: 1rem;
  line-height: 2.2rem;
  padding: 0 1rem;
  height: 3rem;
  min-width: auto;
  align-self: center;
  width: 100%;
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

.cro .button-wrapper {
  padding: 0 10px;
}

.cro .banner-wrapper .banner-button {
  width: 100%;
  margin: 180px 0 0;
}

.cro .offers-button {
  width: 100%;
  margin-bottom: 20px;
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

  .start-page-icase > header.full-size-image .image-slider,
  .start-page-icase > header.full-size-image .image-slider ul,
  .start-page-icase > header.full-size-image .image-slider li {
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
`;

export default styles;