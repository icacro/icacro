import { CROUTIL, ELM } from '../util/main';
import { isLoggedIn, storage, ajax, triggerHotJar, removeElements, elements } from '../util/utils';
'use strict';
const commonf = {

  elementIsVisible(checkElementVisibility) {
    if(document.querySelector(checkElementVisibility).offsetHeight > 0) {
      return true;
    }
  },

  placeEllipsis(navTarget, toggleId) {
    const element = document.querySelector(navTarget);
    if (element.offsetHeight < element.scrollHeight || element.offsetWidth < element.scrollWidth) {
      var truncLi = document.createElement('li');
      truncLi.classList.add('trunc__nav','navigation__item');
      truncLi.innerHTML = '<a href="#" class="navigation__link" id="js-toggle-' + toggleId + '"><svg width="25px" height="5px" viewBox="0 0 25 5" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g fill="#808283"><circle id="Oval" cx="2.5" cy="2.5" r="2.5"></circle><circle id="Oval" cx="12.5" cy="2.5" r="2.5"></circle><circle id="Oval" cx="22.5" cy="2.5" r="2.5"></circle></g></g></svg></a><div class="dropdown" id="dropdown-'+toggleId+'"><div class="dropdown__arrow"></div><div class="dropdown__body"><ul></ul></div></div>';
      for(let i=0; i<element.childElementCount; i++){
        if (element.children[i].offsetTop + element.children[i].offsetHeight >
        element.offsetTop + element.offsetHeight ||
        element.children[i].offsetLeft + element.children[i].offsetWidth >
        element.offsetLeft + element.offsetWidth ) {
          element.children[i].before(truncLi);
          $(navTarget).parent().addClass('truncated');
          break;
        }
      }
      $(truncLi).nextAll().addClass('hidden');
    }
  },

  showMenus() {
    $('.top-bar__wrapper, .offcanvas, .top-bar__left, .top-bar__middle, .top-bar__right, #js-toggle-dropdown-search, .top-bar__sub-menu').addClass('menu-loaded');
  },

  createSubmenu() {
    if($('body').hasClass('submenu-header')) {
      const submenu=$('.top-bar__sub-menu');
      submenu.clone().addClass('top-bar__sub-menu-trunc').insertAfter(submenu).find('.top-bar-sub-menu__arrow').remove();
    }
  },

};

export default commonf;
