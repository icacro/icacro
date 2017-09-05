(function($) {

	var styles = '<style type="text/css">' +
		'@media only screen and (min-width: 980px) { .hero-with-main .main { margin-top: -35rem; } }' +
		'</style>';

	var main = $('.category-bookning-section .column:nth-child(1)');
	var side = $('.category-bookning-section .column:nth-child(2)');
	var saknarInloggning = $('.news-module-container .ica-card-module');
	var villkor = $('.text-module', $('.composition-modules colum:nth-child(1)'));


	addStyles();

	$(document).ready(function() {
		manipulateDom();
	});


	function manipulateDom() {
		side.html('');
		side.append(saknarInloggning);

		main.html('');
		main.append(villkor);
	}

	function addStyles() {
		$('head').append(styles);
	}

})(jQuery);