// ==UserScript==
// @name         Framad inloggning
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
                '@media (max-width: 767px) { .cro .cro-iframe-container { padding-bottom: 135% !important; } }' +
                '.cro > .cro-iframe-container { display: none; }' +
                '.cro .modal-copntainer .cro-iframe-container { display: initial; }' +
                '.cro .cro-iframe-container {' +
                    'position: relative;' +
                    'height: 0;' +
                    'overflow: hidden;' +
                    'padding-bottom: 85%;' +
                    'background-color: #F3F0EB;' +
                '}' +
                '.cro .cro-iframe-container iframe {' +
                    'opacity: 0;' +
                    'position: absolute;' +
                    'top: 0;' +
                    'left: 0;' +
                    'width: 100%;' +
                    'height: 100%;' +
                '}' +
                '</style>';
            $('head').append(styles);
        },
        loaderIsActive: false,
        buttonHandlerPollTimeout: null,
        showLoader: function() {
            var container = $('.cro-iframe-container');
            container.find('.loader').show();
            container.find('iframe').css('opacity', '0');
            this.loaderIsActive = true;
        },
        hideLoader: function() {
            var container = $('.cro-iframe-container');
            container.find('.loader').hide();
            container.find('iframe').css('opacity', '1');
            this.loaderIsActive = false;
        },
        addButtonHandlerPoll: function () {
            var self = this;
            var iframe = $('.cro-iframe-container iframe');
            var e = iframe.contents().find('.remodal-wrapper #grey-card-btn, .remodal-wrapper .pink-card-btn');

            if (e.length) {
                e.click(function () {
                    self.showLoader();
                });
                window.clearTimeout(self.buttonHandlerPollTimeout);
            } else {
                self.buttonHandlerPollTimeout = window.setTimeout(self.addButtonHandlerPoll.bind(self), 1000);
            }
        },
        addEventListeners: function () {
            var self = this;

            $('a.js-login-return-function').on('click', function(e) {
                e.preventDefault();

                var action = $(this).hasClass('button--heart') ? 'SPARA' : 'KOMMENTERA';
                self.createModal(action);
            });

            $(window).on("message onmessage", function(e) {
                if (e.originalEvent.origin === 'https://www.ica.se' && /mobilebankdid/i.test(e.originalEvent.data) {
                    self.showLoader();
                }
            });
        },
        getIframeStyles: function () {
            var styles = '<style type="text/css">' +
                '@media  (max-width: 767px) {' +
                'h3.greeting, h3.card-heading { font-size: 18px; }' +
                'img.card-icon { width: 50px; }' +
                '.select-card-modal { border: 0; padding: 0; margin: 0; }' +
                '.remodal-wrapper { padding: 0; }' +
                '}' +
                '</style>';
            return styles;
        },
        addRecipePageTracking: function () {
            // Spara
            $('body').on('click', '.recipe-action-buttons .button.js-login-return-function', function () {
                ga('send', 'event', 'A/B', 'Klick på spara');
            });

            // Skriv din egen kommentar
            $('body').on('click', '.comments__header .button.js-login-return-function', function () {
                ga('send', 'event', 'A/B', 'Klick på kommentera');
            });

            // Skicka kommentar
            $('body').on('click', '.comments__form .button:not(.button--link)', function () {
                ga('send', 'event', 'A/B', 'Klick på kommentera', 'Skicka kommentar');
            });
        },
        createModal: function (action) {
            var self = this;

            var modal = new coreComponents.modal({
                tpl: $('.cro-iframe-container').get(0),
                size: 'md',
                container: $('.modal-container').get(0)
            });

            setTimeout(function () {
                self.showLoader();
                
                var iframe = $('.cro-iframe-container iframe');

                iframe.on('load', function () {
                    var regex = new RegExp(window.location.href, 'gi');
                    if(regex.test(this.contentWindow.location)) {
                        window.location.reload(true);
                    }

                    if(this.contentWindow.location.href.indexOf('logga-in') !== -1) {
                        var headerBarTimeout = window.setTimeout(hideHeaderBar, 10);
                        var appendHeaderTimeout =  window.setTimeout(appendHeader, 10);
                        var addStylesTimeout = window.setTimeout(addStyles, 10);
                        var addIframeTrackingTimeout = window.setTimeout(addIframeTracking, 10);
                        var hideHeaderBarDeferred = $.Deferred();
                        var appendHeaderDeferred = $.Deferred();
                        var addStylesDeferred = $.Deferred();
                        var addIframeTrackingDeferred = $.Deferred();

                        $.when(hideHeaderBarDeferred,
                               appendHeaderDeferred,
                               addStylesDeferred,
                               addIframeTrackingDeferred).done(function() {
                            self.hideLoader();
                        });

                        function hideHeaderBar() {
                            var e = $('.cro-iframe-container iframe').contents().find('.header-bar');
                            if (e.length) {
                                e.hide();
                                window.clearTimeout(headerBarTimeout);
                                hideHeaderBarDeferred.resolve();
                            } else {
                                headerBarTimeout = window.setTimeout(hideHeaderBar, 0);
                            }
                        }

                        function appendHeader() {
                            var text = (action === 'SPARA')
                                ? ' för att spara receptet'
                                : ' för att kommentera';

                            var e = $('.cro-iframe-container iframe').contents().find('h1');
                            if (e.length) {
                                e.append(text);

                                if (window.screen.width < 768) {
                                    e.css('font-size', '18px');
                                    e.parent().css('margin', '0');
                                }
                                window.clearTimeout(appendHeaderTimeout);
                                appendHeaderDeferred.resolve();
                            } else {
                                appendHeaderTimeout = window.setTimeout(appendHeader, 0);
                            }
                        }

                        function addStyles() {
                            var e = $('.cro-iframe-container iframe').contents().find('body');
                            if (e.length) {
                                e.append(self.getIframeStyles());
                                window.clearTimeout(addStylesTimeout);
                                addStylesDeferred.resolve();
                            } else {
                                addStylesTimeout = window.setTimeout(addStyles, 0);
                            }
                        }

                        function addIframeTracking() {
                            var e = $('.cro-iframe-container iframe').contents();
                            if (e.length) {
                                var eventAction = action == 'SPARA' ? 'Klick på spara' : 'Klick på kommentera';

                                // Fortsätt (Mobilt BankId)
                                e.find('#submit-login-mobile-bank-id').on('click', function () {
                                    ga('send', 'event', 'A/B', eventAction, 'Logga in - Mobilt BankId');
                                });

                                // Behöver du hjälp (Mobilt BankId)
                                e.find('.login-support-bank-id-link').on('click', function () {
                                    ga('send', 'event', 'A/B', eventAction, 'Behöver du hjälp');
                                });

                                // Skapa konto (Mobilt BankId)
                                e.find('.get-mobile-bank-id-link').on('click', function () {
                                    ga('send', 'event', 'A/B', eventAction, 'Skapa konto - Mobilt BankId');
                                });

                                // Logga in (Lösenord)
                                e.find('#log-in-submit').on('click', function () {
                                    ga('send', 'event', 'A/B', eventAction, 'Logga in - Lösenord');
                                });

                                // Glömt lösenord (Lösenord)
                                e.find('.login-support-password-link').on('click', function () {
                                    ga('send', 'event', 'A/B', eventAction, 'Glömt lösenord');
                                });

                                // Skapa konto (Lösenord)
                                e.find('.create-account-link').on('click', function () {
                                    ga('send', 'event', 'A/B', eventAction, 'Skapa konto - Lösenord');
                                });

                                window.clearTimeout(addIframeTrackingTimeout);
                                addIframeTrackingDeferred.resolve();
                            } else {
                                addIframeTrackingTimeout = window.setTimeout(addIframeTracking, 0);
                            }
                        }
                    }

                    $('.cro-iframe-container iframe').contents().find('form').on('submit', function(e) {
                        if (!$(this).find('input.error').length) {
                            self.showLoader();
                        }
                    });

                    $('.cro-iframe-container iframe').contents().find('#submit-login-mobile-bank-id').on('click', function() {
                        if (!$(this).find('input.error').length) {
                            self.buttonHandlerPollTimeout = setTimeout(self.addButtonHandlerPoll.bind(self), 1000);
                        }
                    });

                    $('.cro-iframe-container iframe').contents().find('a[href*="www.ica.se"]').each(function () {
                        $(this).attr('href', $(this).attr('href').replace('http://', 'https://'));
                    }).click(function (e) {
                        window.location.href = $(this).attr('href');
                        e.preventDefault();
                    });
                });
            }, 50);
        },
        manipulateDom: function () {
            var self = this;

            $('body').addClass('cro');

            // fäll ut kommentarsformuläret ifall man är inloggad
            if ($('#hdnIcaState').val()) {
                $('.comments__header .button').click();
            }

            self.addRecipePageTracking();

            var returnUrl = encodeURIComponent(window.location.href);
            var iframeContainer = $('<div class="cro-iframe-container"><span class="loader"></span><iframe src="//www.ica.se/logga-in/?returnurl=' + returnUrl + '" frameborder="0"></iframe></div>');
            $('body').append(iframeContainer);
        }
    };

    test.addStyles();

    $(document).ready(function (){
        test.manipulateDom();
        test.addEventListeners();
    });
})(jQuery);