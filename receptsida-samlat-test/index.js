(function($) {
    'use strict';

    var cro = {
        addStyles: function() {
            var styles = '<style type="text/css">' +
                '.cro h1 { font-size: 64px; margin-top: 20px; }' +
                '.cro .recipe-header__difficulty { color: #808283; font-size: 18px; }' +
                '.cro .recipe-header__comments { display: none; }' +
                '.cro .button { background-color: #6B3250; }' +
                '.cro .rating-stars[data-rating^=\'5\'] g,' +
                '.cro .rating-stars[data-rating^=\'4\'] .rating-stars__five ~ g,' +
                '.cro .rating-stars[data-rating^=\'3\'] .rating-stars__four ~ g,' +
                '.cro .rating-stars[data-rating^=\'2\'] .rating-stars__three ~ g,' +
                '.cro .rating-stars[data-rating^=\'1\'] .rating-stars__two ~ g { fill: #6B3250; }' +

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

                '.cro .servings-warning.active{margin-bottom: 30px;}' +
                '.cro #recipe-howto > h3{margin-top: 20px;}' +
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
        },
        manipulateDom: function () {
            $('body').addClass('cro');

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

            this.triggerCookingMode();
        }
    };

    cro.addStyles();

    $(document).ready(function (){
        cro.manipulateDom();
        cro.addEventListeners();
    });
})(jQuery);