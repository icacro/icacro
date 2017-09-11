(function($) {
	'use strict';

	if (/cro-fromlogin/.test(window.location.href)) {
		window.location.replace('https://www.ving.se/ica-erbjudanden?partner=icakort&utm_source=ica&utm_medium=partnership&utm_campaign=discount');
	}

	var styles = '<style type="text/css">' +
		'@media only screen and (min-width: 980px) { .cro .hero-with-main .main { margin-top: -22rem; } }' +
		'@media only screen and (min-width: 700px) and (max-width: 979px) { .cro .hero-with-main .main { margin-top: -20rem; } }' +
		'@media only screen and (max-width: 699px) { .cro .hero-with-main .main { margin-top: auto; } }' +
		'@media only screen and (max-width: 480px) {' +
            '.cro .skaffa-ica-kort img { float: left; }'+
            '.cro .skaffa-ica-kort p { display: block !important; }'+
            '.cro .skaffa-ica-kort .button { float: none !important; }'+
        '}' +
		'@media only screen and (min-width: 480px) { .cro .top-hero-header .logo-type { top: 90px; } }' +
        '@media only screen and (max-width: 400px) { .cro .top-hero-header .logo-type { top: 95px !important; } }' +
		'.cro .cro-hero-container { width: 100%; position: absolute; z-index: 1; }' +
        '.cro .top-hero-header .logo-type { top: 75px; }' +
		'.cro .bookning-container { background: none; }' +
		'.cro .bookning-container::before { display: none; }' +
		'.cro .category-bookning-section p { font-size: 1.4rem; }' +
		'.cro .category-bookning-section .ruler { margin-top: 3rem; border-bottom: 1px solid #d9d6d2; }' +
		'.cro .category-bookning-section .item-module { width: auto; }' +
		'.cro .ica-card-module { float: none; }' +
		'.cro .ica-card-module .heading-icatext { margin-bottom: 5px; }' +
		'.cro .ica-card-module a { color: #A02971; text-decoration: none; }' +
		'.cro .ica-card-module p { line-height: 1.3; margin-bottom: .5em; }' +
		'.cro .skaffa-ica-kort { margin: 0; background-color: #E9BED7; }' +
		'.cro .skaffa-ica-kort > div { display: block; max-width: 1220px; margin: 0 auto; padding: 0 20px; }' +
		'.cro .skaffa-ica-kort img { height: 4rem; display: inline-block; vertical-align: inherit; }' +
		'.cro .skaffa-ica-kort p { display: inline-block; margin: 10px 0 0 10px; font-size: 1.4rem; font-weight: bold; }' +
		'.cro .skaffa-ica-kort .button { float: right; margin: 6px 0 0 0; }' +
		'</style>';
	var returnUrl = encodeURIComponent('https://www.ica.se/erbjudanden/nojeserbjudanden/ving/?cro-fromlogin');
	var ctaTarget = 'https://www.ica.se/logga-in/?returnurl=' + returnUrl;
	var ctaHtml = '<div class="column size20of20 lg_size12of20 full-bleed-background pl" style="background-color: white;">' +
		'<h1>Spara alltid minst 600:- per resa</h1>' +
		'<p>' + $('.article-name').find('p').text() + '</p>' +
		'<a href="' + ctaTarget + '" class="button button--auto-width">Klicka här för resor och rabatter</a>' +
		'<div class="ruler"></div>' +
		'</div>';
	var getCardTarget = 'https://www.ica.se/ansokan/?returnurl='  + returnUrl;
	var getCardHtml = '<div class="cro-hero-container">' +
		'<div class="skaffa-ica-kort pl grid_fluid">' +
    	'<div class="column size20of20">' +
    	'<img src="/Templates/CardBank/Views/images/ica-card-big.png">' +
    	'<p>Skaffa ICA-kort och ta del av alla erbjudanden</p>' +
    	'<a href="' + getCardTarget +'" class="button button--small">Få rabatt</a>' +
		'</div>' +
		'</div>' +
		'</div>';
	var heroHtml = '<picture class="image-header">' +
		'<source srcset="/imagevaultfiles/id_167759/cf_259/header_ving_480x300.jpg?" media="(max-width: 479px)">' +
		'<source srcset="/imagevaultfiles/id_167760/cf_259/header_ving_980x430.jpg?" media="(max-width: 979px)">' +
		'<img src="/imagevaultfiles/id_167761/cf_259/header_ving_1900x480.jpg?" alt="Header image" class="lazyNoscriptActive">' +
		'</picture>';

	var main = $('.category-bookning-section .column:nth-child(1)');
	var side = $('.category-bookning-section .column:nth-child(2)');
	var saknarInloggning = $('.news-module-container .ica-card-module');
	var villkor = $('.text-module', $('.composition-modules .column:nth-child(1)'));
	var hero = $('.top-hero-header');
	var vingLogo = hero.find('.logo-type');


	addStyles();

	$(document).ready(function() {
		manipulateDom();
	});


	function manipulateDom() {
		$('body').addClass('cro');

		hero.prepend(getCardHtml);
        hero.find('.img-wrapper').html(heroHtml); // ersätt hero-bilder med motsvarande utan prisblobb
		hero.find('.cro-hero-container').append(vingLogo); // flytta vingloggan

		side.html('');
		side.addClass('news-module-container');

		var wrapper = $('<div class="item-module"></div>');
		wrapper.append(saknarInloggning);
		side.append(wrapper);

		$('.category-bookning-section').prepend(ctaHtml);

		main.html('');
		main.append(villkor);
	}

	function addStyles() {
		$('head').append(styles);
	}

})(jQuery);