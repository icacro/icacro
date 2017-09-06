(function($) {
	'use strict';

	var styles = '<style type="text/css">' +
		'@media only screen and (min-width: 980px) { .cro .hero-with-main .main { margin-top: -35rem; } }' +
		'@media only screen and (min-width: 700px) and (max-width: 979px) { .cro .hero-with-main .main { margin-top: -25rem; } }' +
		'@media only screen and (max-width: 699px) { .cro .hero-with-main .main { margin-top: auto; } }' +
		'.cro .bookning-container { background: none; }' +
		'.cro .bookning-container::before { display: none; }' +
		'.cro .category-bookning-section p { font-size: 1.4rem; }' + 
		'.cro .category-bookning-section .ruler { margin-top: 3rem; border-bottom: 1px solid #d9d6d2; }' + 
		'.cro .news-module-container .item-module { width: auto; }' +
		'.cro .ica-card-module { float: none; }' +
		'.cro .ica-card-module .heading-icatext { margin-bottom: 5px; }' +
		'.cro .ica-card-module a { color: #A02971; text-decoration: none; }' +
		'.cro .ica-card-module p { line-height: 1.3; margin-bottom: .5em; }' +
		'.cro .skaffa-ica-kort { position: absolute; z-index: 1; background-color: #D1C1D9; width: 100%; }' +
		'.cro .skaffa-ica-kort > div { max-width: 1220px; margin: 0 auto; padding: 0 20px; }' +
		'.cro .skaffa-ica-kort img { float: left; height: 4rem; display: inline-block; }' +
		'.cro .skaffa-ica-kort p { display: inline-block; margin: 10px 0 0 10px; font-size: 1.4rem; font-weight: bold; }' + 
		'.cro .skaffa-ica-kort .button { float: right; margin: 6px 0 0 0; }' + 
		'</style>';
	var ctaTarget = 'https://www.ica.se/logga-in/?returnurl=https%3a%2f%2fwww.ica.se%2fErbjudanden%2fNojeserbjudanden%2fVing%2f';
	var ctaHtml = '<div class="column size20of20 lg_size12of20 full-bleed-background pl" style="background-color: white;">' +
		'<h1>Spara alltid minst 600:- per resa</h1>' +
		'<p>' + $('.article-name').find('p').text() + '</p>' +
		'<a href="' + ctaTarget + '" class="button button--auto-width">Klicka här för resor och rabatter</a>' +
		'<div class="ruler"></div>' +
		'</div>';
	var getCardTarget = 'https://www.ica.se/ansokan/?returnurl=https%3a%2f%2fwww.ica.se%2fErbjudanden%2fNojeserbjudanden%2fVing%2f'
	var getCardHtml = '<div class="skaffa-ica-kort pl grid_fluid">' +
    	'<div class="column size20of20">' +
    	'<img src="/Templates/CardBank/Views/images/ica-card-big.png">' +
    	'<p>Skaffa ICA-kort och ta del av alla erbjudanden</p>' +
    	'<a href="' + getCardTarget +'" class="button button--small">Få rabatt</a>' +
		'</div>' +
		'</div>'

	var main = $('.category-bookning-section .column:nth-child(1)');
	var side = $('.category-bookning-section .column:nth-child(2)');
	var saknarInloggning = $('.news-module-container .ica-card-module');
	var villkor = $('.text-module', $('.composition-modules .column:nth-child(1)'));
	var hero = $('.top-hero-header');


	addStyles();

	$(document).ready(function() {
		manipulateDom();
	});


	function manipulateDom() {
		$('body').addClass('cro');

		hero.prepend(getCardHtml);

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