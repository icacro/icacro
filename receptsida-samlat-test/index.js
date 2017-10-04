// ==UserScript==
// @name         Receptsidan: Samlat test
// @namespace    https://www.ica.se/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.ica.se/recept/*
// @match        http://test3-sezvm3485t.ica.ia-hc.net/recept/*
// @grant        none
// ==/UserScript==

(function($) {
    'use strict';

    var cro = {
        addStyles: function() {
            var styles = '<style type="text/css">' +
                '.cro h1 { font-size: 32px; margin-top: 20px !important; font-weight: 900; }' +
                '@media only screen and (min-width: 768px) { .cro h1 { font-size: 38px !important; } }' +
                '@media only screen and (min-width: 1024px) { .cro h1 { font-size: 64px !important; } }' +
                '.cro .ingredients, .cro .recipe-howto { margin-bottom: 0; }' +
                '.cro .recipe-preamble { font-size: 20px; line-height: 1.4; margin-top: 0; }' +
                '.cro .recipe-header__difficulty { color: #808283; font-size: 18px; }' +
                '.cro .recipe-header__comments { display: none; }' +
                '.cro .js-recipe-save,' +
                '.cro .js-login-return-function,' +
                '.cro .js-open-shoppinglist-modal:not(.button--secondary),' +
                '.cro .comments__header .button,' +
                '.cro .comments__form .button { background-color: #6B3250; }' +
                '.cro .comments__header .button:hover,' +
                '.cro .comments__form .button:hover,' +
                '.cro .js-open-shoppinglist-modal:not(.button--secondary):hover { background-color: #DC438C; }' +
                '.cro .js-recipe-save.button--active { color: #eb1f07; background-color: #fde8e6; }' +
                '.cro .js-recipe-save.button--active svg { fill: #eb1f07; }' +
                '.cro .js-recipe-save.button--active:hover { color: white; background-color: #DC438C; }' +
                '.cro .js-recipe-save.button--active:hover svg { fill: white; }' +
                '.cro .custom-select select { font-size: 12px; padding: 9px 32px 6px 11px; }' +
                '.cro .ingredients ul { list-style-type: none; padding: 0; }' +
                '.cro .ingredients li:first-child { border-top: solid 1px #D5D7DA; }' +
                '.cro .ingredients li { border-bottom: solid 1px #D5D7DA; padding: 10px 0; font-size: 20px; line-height: 1.4; }' +
                '.cro .ingredients strong { font-size: 20px; margin-top: 20px; display: inline-block; }' +
                '.cro .cooking-step__content__instruction { font-size: 20px; line-height: 1.4; }' +

                // kommentarer
                '.cro .comments { background-color: transparent; margin-top: 60px; }' +
                '.cro .comments__inner-wrapper { max-width: none; padding: 0; }' +
                '.cro .comments__icon { line-height: inherit; margin: 0; position: static; font-size: inherit; }' +
                '.cro .comments__icon svg { display: none; }' +
                '.cro .comments__icon .comments__icon__text { color: #3f3f40; position: static; font-size: 24px; }' +
                '.cro .comments__icon .comments__icon__text:before { content: \'(\'; }' +
                '.cro .comments__icon .comments__icon__text:after { content: \')\'; }' +
                '.cro .comments__header { margin-bottom: 15px; }' +
                '.cro .comments__header__text { float: left; margin-right: 10px; }' +
                '.cro .comments__header .button { margin: 0; vertical-align: initial; }' +
                '.cro .recipe-rating-wrapper { margin: 0; padding: 0; }' +
                '.cro .recipe-rating-wrapper p { display: none; }' +
                '.cro .recipe-rating-wrapper .arrow-down  { left: -24px; transform: scale(-.5, .5) rotate(0); top: -5px; }' +
                '.cro .recipe-rating-wrapper > .button { margin-top: 7px; }' +
                '.cro .rating-stars { display: block; }' +
                '.cro .rating-stars svg  { width: 83px; }' +
                '.cro .rating-stars .recipe-meta  { font-size: 12px; font-weight: normal; }' +
                '.cro .comments__form { max-width: none; }' +
                '.cro .comments__form .input-text--textarea .input-text__input-wrapper {' +
                    'display: flex;' +
                    'font-size: 0;' +
                '}' +
                '.cro .comments__form textarea {' +
                    'border-bottom-left-radius: 4px !important;' +
                    'border-top-left-radius: 4px;' +
                    'border-top-right-radius: 0;' +
                    'border-bottom-right-radius: 0;' +
                    'flex-grow: 1;' +
                    'height: 71px;' +
                    'padding: 5px 30px 5px 5px !important;' +
                    'width: 100%;' +
                    'margin: 0;' +
                    'border: solid 1px #808283 !important;' +
                    'font-family: icatext, sans-serif;' +
                    'font-size: 14px;' +
                    'font-style: italic;' +
                '}' +
                '.cro .comments__form input[type="email"] {' +
                    'border-radius: 4px !important;' +
                    'padding: 5px 30px 5px 5px !important;' +
                    'border: solid 1px #808283 !important;' +
                    'font-family: icatext, sans-serif;' +
                    'font-size: 14px;' +
                    'font-weight: normal;' +
                    'margin: 3px 0 0 0;' +
                    'height: 38px;' +
                '}' +
                '@media only screen and (max-width: 767px) { '+
                    '.cro .comments__form { padding: 15px; }'+
                    '.cro .comments__form .input-text--textarea .input-text__input-wrapper { display: block;}'+
                    '.cro .comments__header, .cro .comments__list { margin: 15px; }'+
                    '.cro .comments__form textarea, .cro .comments__form textarea:focus { font-size: 14px !important; border-radius: 4px !important; margin-bottom: 5px !important; }' +
                    '.cro .comments__form .input-text__input-wrapper .button { line-height: 43px !important; display: inline-block; border-radius: 5rem !important;} '+
                    '.cro .input-text.input-text--textarea .input-text__icon { right: 1rem !important; }' +
                '}' +
                '@media only screen and (min-width: 768px) { .cro .comments__form textarea { height: 51px; } }' +
                '@media only screen and (min-width: 1024px) { .cro .comments__form textarea { height: 41px; } }' +
                '.cro .input-text.input-text--textarea .input-text__icon { right: 19rem; }' +
                '.cro .comments__form .input-text__input-wrapper .button { line-height: 71px; border-bottom-left-radius: 0; border-top-left-radius: 0; border-bottom-right-radius: 4px; height: auto; border-top-right-radius: 4px; margin: 0; }' +
                '@media only screen and (min-width: 768px) { .cro .comments__form .input-text__input-wrapper .button { line-height: 51px; } }' +
                '@media only screen and (min-width: 1024px) { .cro .comments__form .input-text__input-wrapper .button { line-height: 41px; } }' +
                '.cro .comments__form .input-text__label { display: none; }' +
                '.cro .comments__form .checkbox--block { margin: 1rem 0 0 0; }' +
                '.cro .comments__form .checkbox--block .checkbox__label { font-size: 12px; }' +
                '.cro .comments__form .checkbox--block .checkbox__label:before { margin-bottom: -2px; border-width: 2px; }' +
                '.cro .comments__form .button--link { display: none; }' +
                '.cro .comments__list { padding: 0 20px; border-radius: 4px; background-color: #fefefe; border: solid 1px #d5d7da; }' +
                '.cro .comments__list__item-wrapper:first-child { border: none; }' +
                '.cro .comments__list__header { display: flex; }' +
                '.cro .comments__list__body, .cro .comments__list__date { color: #808283; }' +
                '.cro .comments__list__name, .cro .comments__list__date { margin: 0; }' +
                '.cro .comments__list__name { flex-grow: 1; text-transform: none; }' +
                '.cro .comments__list__show-more { border: none; }' +
                '.cro .comments__list__show-more .button { padding: 0; height: auto; line-height: inherit; margin: 0; min-width: 19rem; }' +
                '.cro .cro-triangle-icon { position: relative; }' +
                '.cro .cro-triangle-icon:before {' +
                    'content: \'\';' +
                    'width: 0;' +
                    'height: 0;' +
                    'border-left: 7px solid transparent;' +
                    'border-right: 7px solid transparent;' +
                    'border-top: 8px solid #a02971;' +
                    'position: absolute;' +
                    'top: 6px;' +
                    'right: 0;' +
                '}' +
                '.cro .coachmark-arrow { display: block; font-family: \'icahand\', arial, sans-serif; font-size: 2.4rem; font-weight: normal; position: relative; text-align: left; margin: 10px 0 0 25px; }' +
                '.cro .ingredients .coachmark-arrow--left-up svg { left: -30px; top: -10px; -webkit-transform: scale(-1, -1) rotate(-20deg); transform: scale(-1, -1) rotate(-20deg); }' +
                '.cro .ingredients .coachmark-arrow svg { content: \'\'; height: 35px; position: absolute; width: 20px; }' +
                '.cro .climate__item-rating { display: none; }' +
                '.cro .nutrient__container, .cro .climate__container { display: none; }' +
                '.nutrient { margin-bottom: 16px; }' +
                '@media (min-width: 768px) { .nutrient { margin-bottom: 0; } }' +
                '.cro .climate__current-value { border: 0 !important; padding: 0; }' +
                '.cro .nutrient__show-more a, .cro .climate__show-more a { text-transform: uppercase; font-size: 12px; font-weight: 900; }' +
                '.cro .nutrient__show-more, .cro .climate__show-more { margin-top: 15px; }' +
                '.recipe-details .cro-triangle-icon:before { top: 0px !important; right: -20px !important; }' +
                '.cro .nutrient__subheading { margin-bottom: 15px; }' +
                '.cro .climate__current-value { font-size: 18px !important; display: inline-block; margin: 0 !important; vertical-align: middle; }' +
                '.cro .climate__current-value span:not(.unit-prefix) { font-weight: 900; }' +
                '.cro .nutrient__graphic { margin-top: 15px; }' +
                '.cro .climate h3:not(.climate__current-value) { padding-bottom: 10px; }' +
                '.cro .climate h3 .unit-prefix:before { font-size: 12px; left: 24px; top: 14px; }' +
                '.cro .nutrient__summary__text__data { font-size: 18px; font-weight: 900; }' +
                '.cro .nutrient__summary .circle-icon:before { height: 40px; width: 40px; }' +
                '.cro .nutrient__summary .circle-icon svg { margin-left: -7px; margin-top: -8px; width: 15px; height: 15px; }' +
                '</style>';

            $('head').append(styles);
        },
        addEventListeners: function () {

            $(document).on('click', '.comments__list__show-more .button', function () {
                $('.comments__list__report').remove();
            });

            $(document).on('click', '.cro .js-recipe-save:not(.button--active)', function () {
                if(!/ABTEST_mittica_after_save/.test(document.cookie)) {
                    $('.myica-icon').addClass('variation1');
                    $('html, body').animate({scrollTop: '0px'}, 300);
                }
            });
        },
        manipulateDom: function () {
            $('body').addClass('cro');
            if ($('#hdnIcaState').val()) {
                $('body').addClass('cro-logged-in');
                $('.comments__header .button').click();
            }

            // flytta svårighetsgrad ovanför rubriken
            var difficulty = $('.recipe-header__difficulty');
            $('h1').before(difficulty);

            // flytta sparaknapp till under ingressen
            var sparaKnapp = $('.cro .recipe-action-buttons');
            $('.recipe-preamble').after(sparaKnapp);

            // lägg till coachmarks för inköpsliste-CTA
            var coachmarkInkopslista = '<div class="coachmark-arrow coachmark-arrow--left-up">' +
                'Stå inte vilsen i butiken igen!' +
                '<svg width="30px" height="93px" viewBox="0 0 30 93" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
                '<g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">' +
                '<g id="Tablet/desktop-modal-Copy-2" transform="translate(-1075.000000, -497.000000)" fill="#3F3F40">' +
                '<path d="M1064.7307,548.861113 C1070.57763,524.792959 1089.56414,514.248189 1093.5794,512.36612 C1097.19874,510.667473 1112.05801,504.04235 1114.2856,507.932093 C1115.30341,509.712482 1114.19562,511.458978 1113.29578,511.764017 C1111.20617,512.415963 1109.60246,512.081018 1106.50103,512.998128 C1092.5356,517.131104 1072.95319,530.967501 1069.58981,551.999224 C1069.43984,552.932284 1069.1199,554.014872 1068.91793,555.125373 C1067.94611,560.394767 1067.50819,566.34402 1067.39421,569.48213 C1068.99592,566.916216 1071.85539,562.583869 1072.75123,561.800338 C1074.18297,560.638001 1075.55272,560.324987 1076.84648,561.437481 C1078.15824,562.456271 1077.86229,563.548828 1077.52635,564.344321 C1077.14042,565.420928 1076.85848,565.941289 1076.13261,567.334897 C1075.05081,569.135224 1067.83613,579.809586 1066.76833,581.522189 C1065.10463,584.45694 1063.6609,584.658306 1063.01102,584.626406 C1061.78125,584.678243 1060.9414,583.653472 1060.42549,582.885891 C1059.52766,581.659755 1058.80579,579.98902 1058.43186,578.960262 C1056.28026,573.852359 1052.27499,559.485632 1052.01304,558.381113 C1051.65111,556.782152 1051.87107,554.046772 1053.76472,553.452644 C1055.92632,552.912347 1057.60601,554.477415 1058.44386,557.03336 C1058.68781,557.751098 1060.07556,563.955546 1060.88541,567.1754 C1061.11937,565.398998 1061.56129,562.996568 1062.0232,560.498441 C1062.96103,555.414462 1064.08282,551.534688 1064.7307,548.861113" id="Fill-1" transform="translate(1083.279824, 545.678165) scale(-1, 1) rotate(-32.000000) translate(-1083.279824, -545.678165) "></path>' +
                '</g>' +
                '</g>' +
                '</svg>' +
                '</div>';
            $('.cro .js-open-shoppinglist-modal').after(coachmarkInkopslista);

            $('.comments__list__report').remove();

            var visaFler = $('.comments__list__show-more');
            $('.comments__inner-wrapper').append(visaFler);
            var triangleIcon = '<span class="cro-triangle-icon"></span>';
            visaFler.append(triangleIcon);

            // Flytta ner kommentarsrubriken till ovanför listan
            $('.comments__list').before($('.comments__header'));

            var arrowDown = '<svg class="arrow-down" width="30px" height="93px" viewBox="0 0 30 93" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
                '<g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">' +
                '<g id="Tablet/desktop-modal-Copy-2" transform="translate(-1075, -497)" fill="#3F3F40">' +
                '<path d="M1064.7307,548.861113 C1070.57763,524.792959 1089.56414,514.248189 1093.5794,512.36612 C1097.19874,510.667473 1112.05801,504.04235 1114.2856,507.932093 C1115.30341,509.712482 1114.19562,511.458978 1113.29578,511.764017 C1111.20617,512.415963 1109.60246,512.081018 1106.50103,512.998128 C1092.5356,517.131104 1072.95319,530.967501 1069.58981,551.999224 C1069.43984,552.932284 1069.1199,554.014872 1068.91793,555.125373 C1067.94611,560.394767 1067.50819,566.34402 1067.39421,569.48213 C1068.99592,566.916216 1071.85539,562.583869 1072.75123,561.800338 C1074.18297,560.638001 1075.55272,560.324987 1076.84648,561.437481 C1078.15824,562.456271 1077.86229,563.548828 1077.52635,564.344321 C1077.14042,565.420928 1076.85848,565.941289 1076.13261,567.334897 C1075.05081,569.135224 1067.83613,579.809586 1066.76833,581.522189 C1065.10463,584.45694 1063.6609,584.658306 1063.01102,584.626406 C1061.78125,584.678243 1060.9414,583.653472 1060.42549,582.885891 C1059.52766,581.659755 1058.80579,579.98902 1058.43186,578.960262 C1056.28026,573.852359 1052.27499,559.485632 1052.01304,558.381113 C1051.65111,556.782152 1051.87107,554.046772 1053.76472,553.452644 C1055.92632,552.912347 1057.60601,554.477415 1058.44386,557.03336 C1058.68781,557.751098 1060.07556,563.955546 1060.88541,567.1754 C1061.11937,565.398998 1061.56129,562.996568 1062.0232,560.498441 C1062.96103,555.414462 1064.08282,551.534688 1064.7307,548.861113" id="Fill-1" transform="translate(1083.279824, 545.678165) scale(-1, 1) rotate(-32.000000) translate(-1083.279824, -545.678165) "></path>' +
                '</g>' +
                '</g>' +
                '</svg>';
            $('.recipe-rating-wrapper .arrow-down').replaceWith(arrowDown);
            $('.recipe-rating-wrapper h4').text('Vad tycker du?');

            // Recipe-wrapper finns inte förrän senare
            setTimeout(function () {
                // Flytta ner rating till kommentarsformuläret
                var commmentsForm = $('.comments__form');
                if (commmentsForm.length) {
                    commmentsForm.prepend($('.recipe-rating-wrapper'));
                } else {
                    commmentsForm = $('<div class="comments__form"></div>');
                    commmentsForm.prepend($('.recipe-rating-wrapper'));
                    $('.comments__inner-wrapper').prepend(commmentsForm);
                }

                $('.comments__form .button:last-child').after($('.recipe-rating-wrapper .rating-stars'));

                // Lägg textarea och skicka-knapp i en flex-wrapper
                $('.comments__form .input-text__input-wrapper').append($('.comments__form .button:not(.button--link)'));

                $('.comments__form .input-text__input').attr('placeholder', 'Har du något bra tips eller bara vill uttrycka din nöjdhet eller missnöjdhet med ord.');

                $('.comments__form .input-text--textarea').after($('.comments__form .rating-stars'));

                $('.recipe-rating-wrapper h4').after($('.comments__header .button'));

                // Trigga coachmark för sparat recept om applicerbart
                if($('.js-recipe-save').hasClass('button--active')) {
                    $('.myica-icon').addClass('variation1');
                }
            }, 0);

            // Flytta kupong
            $('#ingredients-section').append($('.recipe-ad'));

            // Flytta näringsvärden och klimatguide
            $('.recipe-content').after($('.recipe-details'));

            var nutrientsToggle = '<div class="nutrient__show-more"><a href="#">Visa mer <span class="cro-triangle-icon"></span></a></div><div class="nutrient__container"></div>';
            $('.nutrient').append(nutrientsToggle);
            $('.nutrient__container').append($('.nutrient__graphic')).append($('.nutrient .block-link'));
            $('.nutrient').find('.nutrient__show-more').click(function (e) {
                e.preventDefault();
                $('.nutrient').find('.nutrient__container').css('display', 'block');
                $(this).hide();
            });

            var climateToggle = '<div class="climate__show-more"><a href="#">Visa mer <span class="cro-triangle-icon"></span></a></div><div class="climate__container"></div>';
            $('.climate').append(climateToggle);
            $('.climate__container').append($('.climate > p')).append($('.climate .block-link'));
            $('.climate').find('.climate__show-more').click(function (e) {
                e.preventDefault();
                $('.climate').find('.climate__container').css('display', 'block');
                $(this).hide();
            });
        }
    };

    cro.addStyles();

    $(document).ready(function (){
        cro.manipulateDom();
        cro.addEventListeners();
    });
})(jQuery);