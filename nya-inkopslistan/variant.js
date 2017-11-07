// ==UserScript==
// @name         Inköpslista
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.ica.se/mittica/*
// @grant        none
// ==/UserScript==

(function($) {
  'use strict';
  window.test = window.test || {};
  window.test = {
    addStyles: function () {
      var styles = '<style type="text/css">' +
          '.cro .controls .sort { margin-top: 56px !important; }' +
          '.cro .controls .searchfield { height: 41px !important; background-position: 100% -45px !important; }' +
          '.cro .searchfield input { font-size: 14px !important; height: 41px !important; background-position: 0 -45px !important; padding-left: 15px !important; }' +
          '.cro .searchfield button { top: 12px !important; background-position: -68px -761px !important; right: 13px !important; }' +
          '.cro .searchfield .autocomplete { top: 51px !important; }' +
          '.cro .peakHours { margin: 10px 0px 20px; display: flex; align-items: flex-end; min-height: 30px; }' +
          '.cro .peakHours .bar { color:#696969; border-bottom: 1px solid #696969; position: relative; flex-grow: 1; margin: 0 1px; }' +
          '.cro .loader { position: relative; margin: 0 auto; position: relative; margin: 20px auto 0; left: 0;}' +
          '.shoppinglist__storesort header { padding: 0; }' +
          '.shoppinglist__storesort .title { color: #3F3F40; font-size: 16px; font-weight: 400; font-family: icatext; margin: 15px 10px 0 15px; }' +
          '.shoppinglist__storesort .sort-by-modal > .content { background-color: white; margin: 0 10px 10px 10px; padding: 15px; border: solid 1px rgba(0,0,0,0.1); }' +
          '.shoppinglist__storesort .list-name { color: #a02971; text-transform: uppercase; font-weight: 600 !important; }' +
          '</style>';
      $('head').append(styles);
    },
    addEventListeners: function () {
      var self = this;

      $('.shoppinglist_choose a').on('click', function () {
        ga('send', 'event', 'Mitt ICA', 'Inköpslistor', 'Klick på val av inköpslista');
      });

      $('#inkopslistor').on('shoppinglist-updated tool-ready', function () {
        const txt = $('.sort').find('.active').text();
        window.test.load(txt);
      });

      $('#inkopslistor').on('tool-ready', function () {
        $(this).find('.shopping-items').addClass('variant');
        ICA.dashboard.shoppingList.isNewShoppingListVariant = true;

        var sortModal = $('.sort-by-modal').clone(true, true).removeClass('removed');
        var storeSort = $('<div class="shoppinglist__storesort"></div>')
        .append(sortModal);

        sortModal.find('h2').text('Sortera efter butik');
        sortModal.find('.header.red').remove();

        $('.shoppinglist_choose').before(storeSort);
      });

      $(document).ajaxComplete(function (event, xhr, settings) {
        if (!settings.url.includes('IngredientSearchHandler')) return;

        const $searchField = $('.searchfield input');
        const $autocompleteList = $('.searchfield .autocomplete');

        $autocompleteList.find('.current-input').remove();

        $autocompleteList.prepend(`<li class="current-input">${$searchField.val()}</li>`)
          .on('click', function () {
            self.addItem($searchField.val());
            $searchField.val('');
            $autocompleteList.children().remove();
          });
      });
    },
    addItem: function (item) {
      item = item.replace ? item.replace(/"/g, '') : item;

      var $newItem = $(`
<li class="item" data-categoryid="7">
  <span class="text">
    <span class="name">${$.trim(item)}</span>
    <span class="amount">
  </span>
  <span class="unit"></span></span><span class="checkbox"></span>
</li>
`);
      var $shoppingList = $('#inkopslistor');
      var $items = $('.list .shopping-items', $shoppingList);
      var $insertionPoint;

      //Update list
      ICA.dashboard.shoppingListItem.update($newItem);

      $newItem.addClass('new');

      // Clear all editing modes from items in list
      $items.children().removeClass('editing');

      // If list order is sorted find the right category/insertion point, otherwise put it on top
      if ($shoppingList.is('.sorted')) {
        $insertionPoint = $($items.children('.label[data-categoryid=' + $newItem.data('categoryid') + ']')[0]);
        $insertionPoint.after($newItem);
        if ($insertionPoint.is('.removed')) {
          $insertionPoint.removeClass('removed');
        }
      } else {
        $insertionPoint = $($items.children('.item')[0]);
        $insertionPoint.before($newItem);
      }

      ICA.legacy.shoppingList.addRow({
        productName: $newItem.find('input.name').val(),
        shoppingListId: $('#selectedShoppinglistId', $shoppingList).val(),
        shoppingListSecureId: $('#selectedShoppinglistSecureId', $shoppingList).val()
      }, function (data) {
        if (data.isNewList) {
          $('#selectedShoppinglistId', $shoppingList).val(data.shoppingListId).trigger('update');
          $('#selectedShoppinglistSecureId', $shoppingList).val(data.shoppingListSecureId).trigger('update');
        }
        $shoppingList.trigger('reload');
      });

      // Update regular items list and dynamic amount labels
      $shoppingList.trigger('shoppinglist-updated');
      $shoppingList.trigger('updated');

      // For animation purposes
      setTimeout(() => $newItem.addClass('added'), 100);
      setTimeout(() => $newItem.removeClass('new'), 1000);

      // Add info to datalayer for analytics
      var productName = $newItem.find('input.name').val();
      icadatalayer.add('dashboard-grocery-lists', { 'dashboardGroceryLists': { 'action': 'add-item', 'addType': 'auto-complete', 'item': productName} });
    },
    manipulateDom: function () {
      $('body').addClass('cro');

      $('#inkopslistor')
        .removeClass('loaded')
        .data('url', '/templates/ajaxresponse.aspx?ajaxFunction=DashboardShoppinglistsVariant')
        .trigger('reload');
    },
    peakHours: [],
    load: function(store) {
      var self = this;

      if (/egen/gi.test(store)) {
        if ($('.sort').find('.pl').length) $('.sort').find('.pl').remove();
        return;
      }

      if (self.peakHours[store]) {
        if ($('.sort').find('.pl').length) {
          $('.sort').find('.pl').replaceWith(self.peakHours[store]);
        } else {
          $('.sort').append(self.peakHours[store]);
        }

        return;
      }

      var url = 'https://www.google.se/search?q=' + encodeURIComponent(store);
      var wrapper = $('<div class="peakHours pl"></div>');
      var loader = $('<div class="loader"></div>');
      let currentHr = (new Date()).getUTCHours() + 1;

        $(wrapper).append(loader);

      if ($('.sort').find('.pl').length) {
        $('.sort').find('.pl').replaceWith(wrapper);
      } else {
        $('.sort').append(wrapper);
      }

      $.getJSON('https://allorigins.us/get?url=' + encodeURIComponent(url) + '&callback=?', function(data){
        let xPos = 0;
        let timeIndex = 0;
        const timeArr = ['09','12','15','18', '21'];

        let hrCounter = 6;

        wrapper.children().remove();

        $(data.contents).find('.xpdopen').find('.lubh-bar').each(function(index){
            const style = $(this).attr('style');
            const height = style.slice(style.indexOf('height:'), style.indexOf('px'));
            const isActive = currentHr === hrCounter;
            const opacity = isActive ? '1' : '.2';
            const newStyle = `${height}px; background-color: rgba(235, 31, 7, ${opacity});`;

            const item = $('<div class="bar"></div>').attr('style', newStyle);
            const hr = timeArr[timeIndex];
            const time = document.createElement('div');
            const graph = document.createElement('div');

            Object.assign(graph.style, {
                width: '1px',
                height: '10px',
                'margin-left': '10px',
                'background-color': '#AAA'
            });

            Object.assign(time.style, {
                'font-size': '12px',
                'text-align': 'center',
                width: '20px',
                left: '-11px',
                position: 'absolute',
                bottom: '-25px'
            });

            hrCounter++;

            if (index!== 0 && (index % 3) === 0 && hr) {
                timeIndex++;
                time.appendChild(graph);
                time.appendChild(document.createTextNode(hr));
            } else if(index !== 0) {
                Object.assign(graph.style, {
                    height: '5px'
                });
                Object.assign(time.style, {
                    bottom: '-5px'
                });
                time.appendChild(graph);
            }

            item.append(time);
            wrapper.append(item);
        });

        // cacha grafen för återrendering
        self.peakHours[store] = wrapper;
      });
    },
  };

  window.test.addStyles();

  $(document).ready(function (){
    window.test.manipulateDom();
    window.test.addEventListeners();
  });
})(jQuery);
