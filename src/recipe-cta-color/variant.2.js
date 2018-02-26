// ==UserScript==
// @name         Receptsidan CTA-färger
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.ica.se/recept/*
// @grant        none
// ==/UserScript==


(function($) {
    'use strict';

    var test = {
        addStyles: function () {
            var styles = '<style type="text/css">' +

`.cro-hidetransition * {
    -o-transition: none !important;
    -moz-transition: none !important;
    -ms-transition: none !important;
    -webkit-transition: none !important;
    transition: none !important;
}
.cro .pl.button {
  visibility: visible;
}

.cro main .button,
.cro main .timer-modal .button.button--secondary,
.cro .modal-container .button.js-deactivate-add-new-shoppinglist,
.cro main .button--secondary.js-open-shoppinglist-modal {
  box-shadow: inset 0 0 0 0.2rem #E6420F;
  background:#FFFFFF;
  color:#E6420F;
}

.cro main .servings-warning,
.cro .hse-campaign .hse-campaign__offer__content-section {
  background: #FCECE7;
}

.cro main .button:hover,
.cro main .circle-icon--small,
.cro main .related-recipe-tags .button,
.cro main .timer-modal .button.button--secondary:hover,
.cro .modal-container .button.js-deactivate-add-new-shoppinglist:hover {
  background: #FCECE7;
  color:#E6420F;
}

.cro main .related-recipe-tags .button:hover {
  background: #F37C67;
  color:#FFFFFF;
}

.cro main .button.button--heart,
.cro main .comments .button,
.cro main .timer-modal .js-timerstart,
.cro .modal-container .button {
  background: #E6420F;
  color:#FFFFFF;
}


.cro main .button.button--heart:hover,
.cro main .comments .button:hover,
.cro main .timer-modal .button:hover,
.cro .modal-container .button:hover {
  background: #EB1F07;
  color:#FFFFFF;
}

.cro main a,
.custom-select select,
.cro main .button,
.cro main .rating-stars svg,
.cro .rating-modal .button--link,
.cro .modal-container a,
.cro main .comments__show-more .button {
  color: #E6420F;
}

.cro main a:hover,
.cro main .button:hover,
.cro .rating-modal .button--link:hover,
.cro .modal-container a:hover,
.cro main .comments__show-more .button:hover {
  color: #EB1F07;
}

.cro main .recipe-meta {
  color: #3F3F40;
}

.cro main .circle-icon--small svg,
.cro main .button svg,
.cro main .button:hover svg,
.cro .pl-modal .pl-modal__close-button svg,
.cro main .timer-modal .pl-modal .pl-modal__close-button svg,
.cro main .servings-warning__close svg,
.cro main .rating-stars svg,
.cro main .rating-stars[data-rating^=\'5\'] g,
.cro main .rating-stars[data-rating^=\'4\'] .rating-stars__five ~ g,
.cro main .rating-stars[data-rating^=\'3\'] .rating-stars__four ~ g,
.cro main .rating-stars[data-rating^=\'2\'] .rating-stars__three ~ g,
.cro main .rating-stars[data-rating^=\'1\'] .rating-stars__two ~ g {
  fill: #E6420F;
}

.cro .pl-modal .pl-modal__close-button:hover svg,
.cro main .servings-warning__close:hover svg,
.cro main .button.button--link:hover svg {
  fill: #EB1F07;
}

.cro main .button.button--heart svg,
.cro main .button.button--heart:hover svg,
.cro .pul-content + .pl-modal__close-button svg,
.cro .pul-content + .pl-modal__close-button:hover svg {
  fill: #FFFFFF;
}

.cro .custom-select:after {
  border-top: 7px solid #E6420F;
}

.cro main .pl-modal__close-button.button,
.cro main .related-recipe-tags .button,
.cro main .recipe-details .button,
.cro main .comments__show-more .button {
  box-shadow: none;
}

.cro .pl-modal .pl-modal__window {
  border-color: #FCECE7;
}

.cro main .button.button-round svg {
  -webkit-transition: all .2s ease-in,box-shadow .2s ease-in,color .2s ease-in; transition: all .2s ease-in,box-shadow .2s ease-in,color .2s ease-in;
}

.cro main #IcaOnlineBuyButton button {
  background: #7FC17A; color: #FFFFFF;
}

.cro main #IcaOnlineBuyButton button:hover {
  background: #00A14B;
}` +

                '</style>';
            $('head').append(styles);
            setTimeout(function(){
              $('body').removeClass('cro-hidetransition');
            },500);
        }
    };

    $(document).ready(function (){
        test.addStyles();
        $('body').addClass('cro').addClass('cro-hidetransition');
    });

})(jQuery);
