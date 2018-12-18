// ==UserScript==
// @name         loginCoachmark
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.ica.se/*
// @grant        none
// ==/UserScript==

'use strict';

import { CROUTIL } from '../util/main';
import { gaPush } from '../util/utils';
import './style.css';

const test = {

  manipulateDom() {
    const avatar = document.getElementById('js-toggle-avatar');

    /*const coachmark = document.createElement('div');
    coachmark.classList.add('coachmark-arrow');
    coachmark.innerHTML = 'Logga in, vettja! <svg width="30px" height="93px" viewBox="0 0 30 93" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Tablet/desktop-modal-Copy-2" transform="translate(-1075.000000, -497.000000)" fill="#3F3F40"><path d="M1064.7307,548.861113 C1070.57763,524.792959 1089.56414,514.248189 1093.5794,512.36612 C1097.19874,510.667473 1112.05801,504.04235 1114.2856,507.932093 C1115.30341,509.712482 1114.19562,511.458978 1113.29578,511.764017 C1111.20617,512.415963 1109.60246,512.081018 1106.50103,512.998128 C1092.5356,517.131104 1072.95319,530.967501 1069.58981,551.999224 C1069.43984,552.932284 1069.1199,554.014872 1068.91793,555.125373 C1067.94611,560.394767 1067.50819,566.34402 1067.39421,569.48213 C1068.99592,566.916216 1071.85539,562.583869 1072.75123,561.800338 C1074.18297,560.638001 1075.55272,560.324987 1076.84648,561.437481 C1078.15824,562.456271 1077.86229,563.548828 1077.52635,564.344321 C1077.14042,565.420928 1076.85848,565.941289 1076.13261,567.334897 C1075.05081,569.135224 1067.83613,579.809586 1066.76833,581.522189 C1065.10463,584.45694 1063.6609,584.658306 1063.01102,584.626406 C1061.78125,584.678243 1060.9414,583.653472 1060.42549,582.885891 C1059.52766,581.659755 1058.80579,579.98902 1058.43186,578.960262 C1056.28026,573.852359 1052.27499,559.485632 1052.01304,558.381113 C1051.65111,556.782152 1051.87107,554.046772 1053.76472,553.452644 C1055.92632,552.912347 1057.60601,554.477415 1058.44386,557.03336 C1058.68781,557.751098 1060.07556,563.955546 1060.88541,567.1754 C1061.11937,565.398998 1061.56129,562.996568 1062.0232,560.498441 C1062.96103,555.414462 1064.08282,551.534688 1064.7307,548.861113" id="Fill-1" transform="translate(1083.279824, 545.678165) scale(-1, 1) rotate(-32.000000) translate(-1083.279824, -545.678165) "></path></g></g></svg></div>';
    */

    var coachmark = document.createElement("div");
    coachmark.classList.add("coachmark-wrapper");
    coachmark.classList.add("pl");
    coachmark.classList.add("login-shout");
    //coachmark.setAttribute("style", "margin-left: -49px; top: 62px; position: absolute; z-index: 99;");
    var mark = document.createElement("div");
    mark.classList.add("coachmark-tooltip");
    mark.classList.add("coachmark-tooltip--top-middle");
    mark.innerHTML = "<span class='coachmark-tooltip__arrow' style='left: 50%; top: 0px; position: absolute; transform: translateX(0px);'></span>Logga in, vettja!";
    coachmark.insertAdjacentElement("afterbegin", mark);

    avatar.parentNode.insertBefore(coachmark, avatar.nextSibling);




    /*const myOffers = document.createElement('a');
    myOffers.classList.add('circle-link','js-track-nav-user-item');
    myOffers.href = '/erbjudanden/butikserbjudanden/';
    var dataTracking = document.createAttribute('data-tracking');
    dataTracking.value = '{"name":"Erbjudanden"}';
    myOffers.setAttributeNode(dataTracking);
    myOffers.innerHTML = '<div class="circle-icon circle-icon--purple circle-offers"><svg><use xlink:href="/Assets/icons/symbols.svg#price-tag"></use></svg></div><span class="circle-link__label">Erbjudanden</span>';

    document.getElementById('dropdown-avatar').querySelector('.circle-links').prepend(myOffers); */

  }

};

$(document).ready(() => {
  Object.assign(test, CROUTIL());
  test.manipulateDom();
});
