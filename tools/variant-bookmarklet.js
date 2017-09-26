(function(experiment, variant, test_segment, url) {
    'use strict';

    setTestSegment(test_segment);
    setVariant(experiment, variant);

    window.location.href = url;

    ///////////////

    function setVariant(experiment, variant) {
    	var name = '_gaexp';
    	var expiry = getExpiry();
    	var expires = addDays(new Date(), 90); // 90 dagar från nu
    	var value = 'GAX1.2.' + experiment + '.' + expiry + '.' +  variant;
    	setCookie(name, value, '.ica.se', expires);
	}

    function setTestSegment(test_segment) {
    	var expires = addDays(new Date(), 365); // Ett år från nu
    	setCookie('ica_test_segment', test_segment, 'www.ica.se', expires);
    }

    function setCookie(name, value, domain, expires) {
    	document.cookie = name + '=' + value + ';path=/;domain=' + domain + ';expires=' + expires.toGMTString() + ';'
    }

    function getExpiry() {
    	return getDaysSinceEpoch(addDays(new Date(), 90));
    }

    function addDays(date, days) {
	    var result = new Date(date);
	    result.setDate(result.getDate() + days);
	    return result;
	}

    function getDaysSinceEpoch(date) {
    	return Math.floor(date/8.64e7);
    }
})(experiment, variant, test_segment, url);