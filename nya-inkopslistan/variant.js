// ==UserScript==
// @name         Inköpslistor
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.ica.se/mittica/
// @grant        none
// ==/UserScript==

(function($) {
    'use strict';

    var test = {
        addStyles: function () {
            var styles = '<style type="text/css">' +
                '.cro .controls .sort { margin-top: 56px !important; }' +
                '.cro .controls .searchfield { height: 41px !important; background-position: 100% -45px !important; }' +
                '.cro .searchfield input { font-size: 14px !important; height: 41px !important; background-position: 0 -45px !important; padding-left: 15px !important; }' +
                '.cro .searchfield button { top: 12px !important; background-position: -68px -761px !important; right: 13px !important; }' +
                '.cro .searchfield .autocomplete { top: 51px !important; }' +
                '</style>';
            $('head').append(styles);
        },
        addEventListeners: function () {
          $('.shoppinglist_choose a').on('click', function () {
            ga('send', 'event', 'Mitt ICA', 'Inköpslistor', 'Klick på val av inköpslista');
          });
        },
        manipulateDom: function () {
          $('body').addClass('cro');

          $('#inkopslistor').on('tool-ready', function () {
            $(this).find('.shopping-items').addClass('variant');
            ICA.dashboard.shoppingList.isNewShoppingListVariant =true;
          })
            .removeClass('loaded')
            .data('url', '/templates/ajaxresponse.aspx?ajaxFunction=DashboardShoppinglistsVariant')
            .trigger('reload');
        }
    };

    test.addStyles();

    $(document).ready(function (){
        test.manipulateDom();
        test.addEventListeners();
    });
})(jQuery);