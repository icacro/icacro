import commonf from './commonfunctions.js';

'use strict';

const common = {

  checkResponsive(isDesktop) {
    let searchLink=$('#js-toggle-dropdown-search');
    const elementVisible = commonf.elementIsVisible('.top-bar__left .top-bar__home-link');
    const morewidth = $('.cro .top-bar__wrapper nav > .navigation__inner li.trunc__nav').outerWidth(true);
    const morewidthSub = $('.top-bar__sub-menu-trunc li.trunc__nav').outerWidth(true) + 40;
    if(elementVisible === true && isDesktop === 0) {
      searchLink.insertAfter($('#js-toggle-avatar'));
      isDesktop = 1;
    } else if (elementVisible !== true && isDesktop === 1) {
      searchLink.insertAfter($('#js-open-toggle-offcanvas-left'));
      isDesktop = 0;
    }
    if(isDesktop===1) {
      $('.truncated').removeClass('truncated').find('li').removeClass('hidden');
      $('.trunc__nav').remove();
      commonf.placeEllipsis('.cro .top-bar__wrapper nav > .navigation__inner','trunc-nav');
      if($('body').hasClass('submenu-header')) {
        commonf.placeEllipsis('.cro .top-bar__sub-menu-trunc .top-bar-sub-menu','subnav');
      }
    }
    return isDesktop;
  },

  createStorelink() {
    if ($('.offcanvas__foot a').attr('href') === '#') {
      $('.cro').removeClass('cro-store');
    } else {
      $('.cro').addClass('cro-store');
      $('.cro .store-link__icon').find('use').attr('xlink:href','/Assets/icons/symbols.svg#arrow-right');
    }
    const storeLink=$('.offcanvas__foot .store-link');
    storeLink.clone().appendTo($('header.top-bar'));
    $('header.top-bar .store-link').wrap('<div class="top-bar__store-link"></div>');
  },

  createMenus() {
    const homeLink=$('.top-bar__home-link');
    homeLink.clone().prependTo($('.top-bar__left'));
    const navMenu=$('.offcanvas__body nav');
    navMenu.clone().prependTo($('.top-bar__middle'));

    const navInner=$('.cro header nav .navigation__inner');

    const pageurl=$('#aspnetForm').attr('action');
    const pagebase = '/' + pageurl.split("/")[1] + '/';
    navInner.find('li a[href=\''+ pagebase +'\']').addClass('active');

    commonf.createSubmenu();
    commonf.showMenus();
  },

  manipulateDom() {

    $('nav .navigation__inner').on('click','#js-toggle-trunc-nav', function(e){
      e.preventDefault();
      let nav=$('nav .navigation__inner');
      if(nav.find('.trunc__nav ul li').length === 0) {
        nav.find('.trunc__nav').nextAll().clone().appendTo(nav.find('.dropdown__body ul')).removeClass('hidden');
      }
      $('#js-toggle-avatar, #js-toggle-dropdown-search').removeClass('dropdown--active');
      $('#dropdown-trunc-nav').toggleClass('dropdown--active');
    });

    $('.top-bar__sub-menu-trunc').on('click','#js-toggle-subnav', function(e){
      e.preventDefault();
      let nav=$('.top-bar__sub-menu-trunc');
      if(nav.find('.trunc__nav ul li').length === 0) {
        nav.find('.trunc__nav').nextAll().clone().appendTo(nav.find('.dropdown__body ul')).removeClass('hidden');
      }
      $('#js-toggle-avatar, #js-toggle-dropdown-search').removeClass('dropdown--active');
      $('#dropdown-subnav').toggleClass('dropdown--active');
    });

    $('html').click(function(e) {
      if (e.target.id !== 'js-toggle-trunc-nav' && $(e.target).parents('#dropdown-trunc-nav').length === 0) {
        $('#dropdown-trunc-nav').removeClass('dropdown--active');
      }
      if (e.target.id !== 'js-toggle-subnav' && $(e.target).parents('#dropdown-subnav').length === 0) {
        $('#dropdown-subnav').removeClass('dropdown--active');
      }
    });

  },
};

export default common;
