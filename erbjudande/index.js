(function($) {
	'use strict';

	var styles = '<style type="text/css">' +
		'@media only screen and (min-width: 980px) { .hero-with-main .main { margin-top: -35rem; } }' +
		'.bookning-container { background: none; }' +
		'.bookning-container::before { display: none; }' +
		'.category-bookning-section .ruler { margin-top: 3rem; border-bottom: 1px solid #d9d6d2; }' + 
		'.category-bookning-section p { font-size: 1.4rem; }' + 
		'.news-module-container .item-module { width: auto; }' +
		'.ica-card-module { float: none; }' +
		'.ica-card-module .heading-icatext { margin-bottom: 5px; }' +
		'.ica-card-module a { color: #A02971; }' +
		'.ica-card-module p { line-height: 1.3; margin-bottom: .5em; }' +
		'.ica-kort-icon { height: 4rem; display: inline-block; }' +
		'.skaffa-ica-kort { position: absolute; z-index: 1; background-color: #D1C1D9; /* width: 100%; */ display: flex; flex-wrap: wrap; }' +
		'.skaffa-ica-kort { display: inline-block; font-weight: bold; }' + 
		'</style>';
	var ctaTarget = 'https://';
	var ctaHtml = '<div class="column size20of20 lg_size12of20 full-bleed-background pl" style="background-color: white;">' +
		'<h1>Spara alltid minst 600:- per resa</h1>' +
		'<p>' + $('.article-name').find('p').text() + '</p>' +
		'<a href="' + ctaTarget + '" class="button button--auto-width">Klicka här för resor och rabatter</a>' +
		'<div class="ruler"></div>' +
		'</div>';
	var getCardHtml = '<div class="skaffa-ica-kort pl grid-fluid">' +
    	'<div class="column size20of20">' +
    	'<img src="/Templates/CardBank/Views/images/ica-card-big.png" class="ica-kort-icon">' +
    	'<p>Skaffa ICA-kort och ta del av alla erbjudanden</p>' +
    	'<a href="#" class="button button--small">Få rabatt</a>' +
		'</div>' +
		'</div>'

	var main = $('.category-bookning-section .column:nth-child(1)');
	var side = $('.category-bookning-section .column:nth-child(2)');
	var saknarInloggning = $('.news-module-container .ica-card-module');
	var villkor = $('.text-module', $('.composition-modules .column:nth-child(1)'));


	addStyles();

	$(document).ready(function() {
		manipulateDom();
	});


	function manipulateDom() {
		side.html('');
		side.addClass('news-module-container');

		var wrapper = $('<div class="item-module"></div>');
		wrapper.append(saknarInloggning);
		side.append(wrapper);
		// side.append(saknarInloggning);

		$('.category-bookning-section').prepend(ctaHtml);

		main.html('');
		main.append(villkor);
	}

	function addStyles() {
		$('head').append(styles);
	}

})(jQuery);