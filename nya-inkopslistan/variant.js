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
          '</style>';
      $('head').append(styles);
    },
    addEventListeners: function () {
      $('.shoppinglist_choose a').on('click', function () {
        ga('send', 'event', 'Mitt ICA', 'Inköpslistor', 'Klick på val av inköpslista');
      });
    },
    searchList: function() {
      var self = this;

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
      $('#inkopslistor').on('shoppinglist-updated', function () {
        const txt = $('.sort').find('.active').text();
        window.test.load(txt);
      });
      $('#inkopslistor').on('tool-ready', function () {
        $(this).find('.shopping-items').addClass('variant');
        ICA.dashboard.shoppingList.isNewShoppingListVariant =true;

      })
        .removeClass('loaded')
        .data('url', '/templates/ajaxresponse.aspx?ajaxFunction=DashboardShoppinglistsVariant')
        .trigger('reload');
    },
    load: function(store) {
      var url = 'https://www.google.se/search?q=' + encodeURIComponent(store);
      var wrapper = document.createElement('div');

      var loader = document.createElement('div');
      wrapper.className = 'pl';
      loader.className = 'loader';

      Object.assign(wrapper.style, {
        position: 'relative',
        'margin': '10px 0 20px',
        'min-height': '70px',
        'text-align': 'center'
      });
      $(wrapper).append(loader);

      if ($('.sort').find('.pl').length) {
        $('.sort').find('.pl').replaceWith(wrapper);
      } else {
        $('.sort').append(wrapper);
      }


      $.getJSON('https://allorigins.us/get?url=' + encodeURIComponent(url) + '&callback=?', function(data){
        var xPos = 0;
        var timeIndex = 0;
        const timeArr = ['09','12','15','18', '21'];
        const container = document.createDocumentFragment();
        wrapper.innerHTML = '';

        $(data.contents).find('.xpdopen').find('.lubh-bar').each(function(index){
          const style = $(this).attr('style');
          const item = document.createElement('div');
          const hr = timeArr[timeIndex];
          item.style.cssText = style;

          Object.assign(item.style, {
            width: '10px',
            'background-color': '#EB1F07',
            left: xPos + 'px',
            position: 'absolute',
            bottom: '0'
          });
          xPos += 11;
          if ((index % 3) === 0 && hr) {
            var txt = document.createTextNode(hr);
            var time = document.createElement('div');
            var graph = document.createElement('div');
            Object.assign(time.style, {
              'font-size': '12px',
              'text-align': 'center',
              width: '21px',
              left: '11px',
              position: 'absolute',
              bottom: '-30px'
            });
            Object.assign(graph.style, {
              width: '1px',
              height: '10px',
              'margin-left': '10px',
              'background-color': '#000'
            });
            timeIndex++;
            time.appendChild(graph);
            time.appendChild(txt);
            item.appendChild(time);
          }

          wrapper.appendChild(item);


        });
      });
    },
  };

  window.test.addStyles();

  $(document).ready(function (){
    let tries = 1;
    const exist = setInterval(function() {
      if (tries === 60) clearInterval(exist);
      if ($('.sort').find('.active').length) {
        clearInterval(exist);
        const txt = $('.sort').find('.active').text();
        window.test.load(txt);
      }
      tries++;
    }, 100);
    window.test.manipulateDom();
    window.test.addEventListeners();
    window.test.searchList();
  });
})(jQuery);