// ==UserScript==
// @name         Desktop-nav
// @path         //./src/desktop-nav/variant.js
// @namespace    http://tampermonkey.net/
// @version      0.1
// @match        https://www.ica.se/*
// @grant        none
// ==/UserScript==

import { CROUTIL, ELM } from '../util/main';
import './style.search.css';
import commonf from './commonfunctions.js';

(function ($) {
  'use strict';

  const test = {

    checkResponsive(isDesktop) {
      let searchLink=$('#js-toggle-dropdown-search');
      const elementVisible = commonf.elementIsVisible('.top-bar__left nav');
      const morewidth = $('.top-bar__sub-menu-trunc li.trunc__nav').outerWidth(true) + 40;
      let hasSubmenu = $('body.submenu-header').length;
      if(elementVisible === true && isDesktop === 0) {
        if(hasSubmenu === 0) {
          if($('.static-search').length === 0) {
            searchLink.children('div').addClass('static-search');
          }
        }
        test.hideNavItems()
        isDesktop = 1;
      } else if (elementVisible !== true && isDesktop === 1) {
        if(hasSubmenu === 0) {
          searchLink.children('div').removeClass('static-search');
        }
        isDesktop = 0;
      }
      if (isDesktop === 1 && hasSubmenu) {
        $('.truncated').removeClass('truncated').find('li').removeClass('hidden');
        $('.trunc__nav').remove();
        commonf.placeEllipsis('.cro .top-bar__sub-menu-trunc .top-bar-sub-menu','subnav');
      }
      return isDesktop;
    },

    hideNavItems() {
      let navwidth = 0;
      const navContainer = $('.top-bar__left .navigation__inner');
      const navVisible = $('.top-bar__left .navigation__inner li:visible');
      const availablespace = navContainer.outerWidth(true);
      navVisible.each(function() {
        navwidth += $(this).outerWidth( true );
        if (navwidth > availablespace) {
          return false;
        }
        $(this).addClass('item-visible');
      });
      let visibleItems = navContainer.find('li.item-visible').length;
      $('.offcanvas__body .navigation__inner li:nth-child(-n+' + visibleItems + ')').addClass('hide-desktop');
    },

    createTopmenu() {
      const navMenu=$('.offcanvas__body nav');
      const navInner=$('.cro header nav .navigation__inner');
      navMenu.clone().prependTo($('.top-bar__left'));
      navInner.find('li').addClass('visible');
      const pageurl=$('#aspnetForm').attr('action');
      const pagebase = '/' + pageurl.split("/")[1] + '/';
      $('.top-bar__left .navigation__inner').find('a[href=\''+ pagebase +'\'], a[href=\''+ pageurl +'\']').parent().addClass('active');
      const closeOffcanvas = '<svg id="close-offcanvas"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/Assets/icons/v2-symbols.svg#close"></use></svg>';
      $('#js-open-toggle-offcanvas-left').append(closeOffcanvas);
      commonf.showMenus();
    },

    manipulateDom() {

      $('body').addClass('cro-search');
      if ($('.sticky-header.submenu-header').length === 0) {
        $('body').addClass('cro-nosub');
      }
      $('.top-bar-sub-menu').wrap('<div class="top-bar-sub-menu-container"></div>');

      $('html').click(function(e) {
        if (e.target.id !== 'js-toggle-dropdown-search' && $(e.target).parents('#js-toggle-dropdown-search').length === 0) {
          $('#js-toggle-dropdown-search .offcanvas-typeahead').hide();
          $('.search-zero-case').hide();
        }
        if (e.target.id !== 'js-toggle-subnav' && $(e.target).parents('#dropdown-subnav').length === 0) {
          $('#dropdown-subnav').removeClass('dropdown--active');
        }
        if (e.target.id !== 'js-open-toggle-offcanvas-left' && $(e.target).parents('.offcanvas').length === 0) {
          $('#js-open-toggle-offcanvas-left').removeClass('active');
        }
      });

      $('.main-search-bar__input').focus(function() {
        if(!$('#dropdown-search').hasClass('dropdown--active')) {
          $('#js-toggle-dropdown-search').click();
        }
        $('#js-toggle-dropdown-search .offcanvas-typeahead, .search-zero-case').show();
      });

      $('form').submit(function() {
        $('.main-search-bar__input').blur();
      });

      $('.top-bar__sub-menu-trunc').on('click','#js-toggle-subnav', function(e){
        e.preventDefault();
        let nav=$('.top-bar__sub-menu-trunc');
        if(nav.find('.trunc__nav ul li').length === 0) {
          nav.find('.trunc__nav').nextAll().clone().appendTo(nav.find('.dropdown__body ul')).removeClass('hidden');
        }
        $('#js-open-toggle-offcanvas-left').removeClass('active');
        $('#js-toggle-avatar, #js-toggle-dropdown-search').removeClass('dropdown--active');
        $('#dropdown-subnav').toggleClass('dropdown--active');
      });

      $('#js-open-toggle-offcanvas-left').on('click', function(e){
        $(this).toggleClass('active');
      });

      $('#js-toggle-dropdown-search').on('click', '.typeahead-list-item--suggestion', function(e) {
        $('.offcanvas-typeahead').hide();
      });

    },

  };

  $(document).ready(() => {
    Object.assign(test, CROUTIL());
    if($('header.top-bar').length) {
      test.createTopmenu();
      commonf.createSubmenu();
      test.manipulateDom();

      let isDesktop = 0;
      isDesktop = test.checkResponsive(isDesktop);
      var resizeTimer;
      $(window).on('resize', function(e) {
        $('.top-bar').find('.dropdown').removeClass('dropdown--active');
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
          isDesktop=test.checkResponsive(isDesktop);
        }, 250);
      });
    }
    //$('#dropdown-search').addClass('dropdown--active');
  });

})(jQuery);
