// ==UserScript==
// @name         Banner
// @path         //./src/banner/variant.js
// @namespace    http://tampermonkey.net/
// @version      0.1
// @match        https://www.ica.se/*
// @grant        none
// ==/UserScript==

'use strict';

//---------ICA.ajax-------------
window.ICA = window.ICA || {};
(function ($, window, document, ICA, undefined) {
    ICA.ajax = (function () {
        function _legacyAjax() {
            var $document = $(document),
            context = this;

            /**
             * Init call
             */
            context.init = function () {
                return context;
            };

			context.post = function (url, args, success, error, datatype, asyncPost) {
				if (!url) {
				    return '';//console.log('No url');
				}
				var params = $.extend({
					callerPageIsActivated: true
				}, args);

				context.xhr = $.ajax({
					url: url,
					type: 'post',
					cache: false,
					dataType: datatype ? datatype : 'json',
					data: params,
					success: success ? success : context.defaultSuccess,
					error: error ? error : context.defaultError,
	                async: typeof asyncPost !== 'boolean' ? true : asyncPost
				});

                return context.xhr;
			};

			context.getTraditional = function (url, args, success, error, datatype, asyncGet, useCache) {
			    context.get(url, args, success, error, datatype, asyncGet, true, useCache);
	        };

	        context.get = function (url, args, success, error, datatype, asyncGet, traditional, useCache) {
				if (!url) {
					return "No url";
				}
				var params = $.extend({
					callerPageIsActivated: true
				}, args);

				context.xhr = $.ajax({
					url: url,
					type: 'get',
					cache: useCache === true,
					data: params,
					dataType: datatype ? datatype : 'html',
					success: success ? success : context.defaultSuccess,
					error: error ? error : context.defaultError,
					async: typeof asyncGet !== 'boolean' ? true : asyncGet,
	                traditional: traditional ? traditional : false
				});

                return context.xhr;
			};

			context.defaultSuccess = function (data) {
				//console.log('AJAX success:', data);
			};

			context.defaultError = function (error) {
				//console.log('AJAX error:', error);
			};

            return context.init();
        }
        return new _legacyAjax();
    }());
}(jQuery, window, document, window.ICA));
//------------------------------

var style = document.createElement('style');
style.setAttribute('type', 'text/css');
style.innerHTML = '.async-hide{opacity:0;}';
document.querySelector('head').appendChild(style);
document.documentElement.className += ' async-hide';

var script = document.createElement('script');
script.setAttribute('async', '');
script.setAttribute('src', 'https://cdn.rawgit.com/Banzaci/ica/v1.0.67/src/checkboxes-to-list-v2/variant.blacklist.min.js');
document.querySelector('head').appendChild(script);

script.onload = function () {
  var d = document.documentElement;
  setTimeout(function(){
    d.className = d.className.replace(RegExp(' ?async-hide'), '');
  },40);
}

setTimeout(function(){
  window.hj=window.hj||function(){(hj.q=hj.q||[]).push(arguments);};
  hj('trigger', 'ingredientstoshoppinglistblacklist');
}, 500);
