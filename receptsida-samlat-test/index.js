(function($) {
    'use strict';

    var cro = {
        addStyles: function() {
            var styles = '<style type="text/css">' +
                '.cro h1 { font-size: 32px; margin-top: 20px; }' +
                '@media only screen and (min-width: 768px) { .cro h1 { font-size: 38px; } }' +
                '@media only screen and (min-width: 1024px) { .cro h1 { font-size: 64px; } }' +
                '.cro .recipe-preamble { font-size: 20px; line-height: 1.4; }' +
                '.cro .recipe-header__difficulty { color: #808283; font-size: 18px; }' +
                '.cro .recipe-header__comments { display: none; }' +
                '.cro .js-recipe-save,' +
                '.cro .js-open-shoppinglist-modal:not(.button--secondary),' +
                '.cro .comments__header .button,' +
                '.cro .comments__form .button { background-color: #6B3250; }' +
                '.cro .comments__header .button:hover,' +
                '.cro .comments__form .button:hover,' +
                '.cro .js-open-shoppinglist-modal:not(.button--secondary):hover { background-color: #DC438C; }' +
                // Struntar i att färga ratingstjärnor
                // '.cro .rating-stars[data-rating^=\'5\'] g,' +
                // '.cro .rating-stars[data-rating^=\'4\'] .rating-stars__five ~ g,' +
                // '.cro .rating-stars[data-rating^=\'3\'] .rating-stars__four ~ g,' +
                // '.cro .rating-stars[data-rating^=\'2\'] .rating-stars__three ~ g,' +
                // '.cro .rating-stars[data-rating^=\'1\'] .rating-stars__two ~ g { fill: #6B3250; }' +
                '.cro .custom-select select { font-size: 12px; padding: 9px 32px 6px 11px; }' +
                '.cro .ingredients ul { list-style-type: none; padding: 0; }' +
                '.cro .ingredients li:first-child { border-top: solid 1px #D5D7DA; }' +
                '.cro .ingredients li { border-bottom: solid 1px #D5D7DA; padding: 10px 0; font-size: 20px; line-height: 1.4; }' +
                '.cro .ingredients strong { font-size: 20px; margin-top: 20px; display: inline-block; }' +
                '.cro .coachmark-arrow { font-family: \'icahand\', arial , sans-serif; font-size: 2.4rem; font-weight: normal; position: relative; text-align: left; margin: 10px 0 0 25px; }' +
                '.cro .ingredients .coachmark-arrow--left-up svg { left: -30px; top: -10px; -webkit-transform: scale(-1, -1) rotate(-20deg); transform: scale(-1, -1) rotate(-20deg); }' +
                '.cro .ingredients .coachmark-arrow svg { content: \'\'; height: 35px; position: absolute; width: 20px; }' +
                '.cro .cooking-step__content__instruction { font-size: 20px; line-height: 1.4; }' +

                // css för autostart av laga läge ( saxad från tidigare test)
                'html.force-no-scroll {overflow: auto!important;}' +
                '.force-no-scroll.mobile-device body.cro{overflow: auto!important;}' +
                '.cro.ta-hideModal .modal-container {display: none!important;}' +
                '.cro .js-start-cooking-mode  {display: none!important;}' +
                '.cro .pl .checkbox__input:checked+.checkbox__label::before {background: #90b400;border-color: #90b400;}' +
                '.cro .pl .checkbox:hover .checkbox__label {color: #90b400;}' +
                '.cro .pl .checkbox:hover .checkbox__label::before {border-color: #90b400;}' +
                '.cro .cooking-step .checkbox:focus .checkbox__label::before {border-color: #90b400;}' +
                '.cro .cooking-step.completed .cooking-step__content__instruction {text-decoration: line-through;}' +
                '.cro .cooking-step.ta-next:not(.completed) {font-weight: bold;margin: 30px 0;}' +

                '.cro #recipe-howto .howto-steps > h2,' +
                '.cro #recipe-howto .howto-steps > h3,' +
                '.cro #recipe-howto .howto-steps > p{display: none!important;}' +
                '.cro .js-track-cookmode-timeropen, .cro .js-track-cookmode-timeropen:hover, .cro .js-track-cookmode-timeropen:active { color: #d91463; background-color: #fbe7ef; }' +

                '.cro .servings-warning.active{margin-bottom: 30px;}' +
                '.cro #recipe-howto > h3{margin-top: 20px;}' +

                // kommentarer
                '.cro .comments { background-color: transparent; }' +
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
                '.cro .rating-stars svg  { width: 83px; }' +
                '.cro .rating-stars .recipe-meta  { font-size: 12px; font-weight: normal; }' +
                '.cro .comments__form { max-width: none; }' +
                '.cro .comments__form .cro-input-wrapper { display: flex; }' +
                '.cro .comments__form .input-text--textarea { flex-grow: 1; margin: 0; }' +
                '.cro .comments__form .cro-input-wrapper .input-text__input-wrapper {  font-size: 0; display: block; border: solid 1px #808283; border-top-left-radius: 4px; border-bottom-left-radius: 4px; }' +
                '.cro .comments__form textarea { height: 71px; padding: 5px 30px 5px 5px !important; width: 100%; margin: 0; border: none !important; font-family: icatext, sans-serif; font-size: 14px; font-style: italic; }' +
                '@media only screen and (min-width: 768px) { .cro .comments__form textarea { height: 51px; } }' +
                '@media only screen and (min-width: 1024px) { .cro .comments__form textarea { height: 41px; } }' +
                '.cro .input-text.input-text--textarea .input-text__icon { right: 1rem; }' +
                '.cro .comments__form .cro-input-wrapper { display: flex; }' +
                '.cro .comments__form .cro-input-wrapper .button { line-height: 73px; border-bottom-left-radius: 0; border-top-left-radius: 0; border-bottom-right-radius: 4px; height: auto; border-top-right-radius: 4px; margin: 0; }' +
                '@media only screen and (min-width: 768px) { .cro .comments__form .cro-input-wrapper .button { line-height: 53px; } }' +
                '@media only screen and (min-width: 1024px) { .cro .comments__form .cro-input-wrapper .button { line-height: 43px; } }' +
                '.cro .comments__form .input-text__label { display: none; }' +
                '.cro .comments__form .button--link { display: none; }' +
                '.cro .comments__list { padding: 0 20px; border-radius: 4px; background-color: #fefefe; border: solid 1px #d5d7da; }' +
                '.cro .comments__list__item-wrapper:first-child { border: none; }' +
                '.cro .comments__list__header { display: flex; }' +
                '.cro .comments__list__body, .cro .comments__list__date { color: #808283; }' +
                '.cro .comments__list__name, .cro .comments__list__date { margin: 0; }' +
                '.cro .comments__list__name { flex-grow: 1; text-transform: none; }' +
                '.cro .comments__list__date { margin-right: 2rem; }' +
                '.cro .comments__list__report { display: block; order: 3; float: none; }' +
                '.cro .comments__list__report--right { display: none; }' +
                '.cro .comments__list__report a { padding: 0; }' +
                '.cro .cro-close-icon { fill: #d5d7da !important; pointer-events: none; }' +
                '.cro .comments__list__show-more { border: none; }' +
                '.cro .comments__list__show-more .button { padding: 0; font-weight: normal; height: auto; line-height: inherit; margin: 0; min-width: 19rem; }' +
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
                '</style>';

            $('head').append(styles);
        },
        triggerCookingMode: function () {
            var body = $('body');

            body.addClass('ta-hideModal');

            $('.js-start-cooking-mode').trigger('click');
            if ($('.servings-picker-modal').length) {
                $('.servings-picker-modal > .button')[0].click();
            }

            var cook = $('.cooking-mode-modal .howto-timers-wrapper');
            if (cook.length) {
                $('#recipe-howto > ol').hide();
                $('.close-button-cookie-mode')[0].click();
                body.removeClass('ta-hideModal');
				$('#recipe-howto').find('>ol:first').after(cook);
                $($('.cooking-step:not(.completed)')[0]).addClass('ta-next');
            }
            $('html').removeClass('force-no-scroll');
        },
        addEventListeners: function () {
            $(document).on('click', '.cooking-step__check', function () {
                $('.ta-next').removeClass('ta-next');
                $($('.cooking-step:not(.completed)')[0]).addClass('ta-next');
            });

            $(document).on('click', '.comments__list__show-more .button', function () {
                var closeIcon = '<svg class="cro-close-icon" viewBox="0 0 12 12" width="12px" height="12px">' +
                    '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/Assets/icons/sprite.svg#close"></use>' +
                    '</svg>';
                $('.comments__list__report a').html(closeIcon);
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

            // byt plats på gör så här och ingredienser
            var divider = $('.recipe-column-divider');
            var ingredients = $('.recipe-content #ingredients-section');
            var howto = $('.recipe-content #recipe-howto');
            divider.before(howto);
            divider.after(ingredients);

            // ändra hover-färg på timerknappar
            howto.find('.js-track-cookmode-timeropen').removeClass('green blue');

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

            var closeIcon = '<svg class="cro-close-icon" viewBox="0 0 12 12" width="12px" height="12px">' +
                '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/Assets/icons/sprite.svg#close"></use>' +
                '</svg>';
            $('.comments__list__report a').html(closeIcon);

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
                $('.comments__form').prepend($('.recipe-rating-wrapper'));
                $('.comments__form .button:last-child').after($('.recipe-rating-wrapper .rating-stars'));

                // Lägg textarea och skicka-knapp i en flex-wrapper
                var wrapper = $('<div class="cro-input-wrapper"></div>');
                wrapper.append($('.comments__form .input-text--textarea'), $('.comments__form .button:not(.button--link)'));
                $('.recipe-rating-wrapper').after(wrapper);

                $('.cro-input-wrapper').after($('.input-text--textarea .input__error'));

                $('.comments__form .input-text__input').attr('placeholder', 'Har du något bra tips eller bara vill uttrycka din nöjdhet eller missnöjdhet med ord.');
                $('.comments__form .input-text__input').attr('placeholder', 'Har du något bra tips eller bara vill uttrycka din nöjdhet eller missnöjdhet med ord.');
            }, 0);

            // Flytta kupong
            $('#ingredients-section').append($('.recipe-ad'));

            this.triggerCookingMode();
        }
    };

    cro.addStyles();

    $(document).ready(function (){
        cro.manipulateDom();
        cro.addEventListeners();
    });
})(jQuery);