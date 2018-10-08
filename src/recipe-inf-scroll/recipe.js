'use strict';

import { CROUTIL } from '../util/main';
import { gaPush } from '../util/utils';

const pageWrapper = document.getElementById('page-wrapper');

const recipe = {

  initRecipe(currentPageEl,currentUrl,prevPage,pageCount,originalUrl) {

    currentPageEl.id = 'page-' + pageCount;
    recipe.addGradient(currentPageEl,currentUrl,originalUrl);
    recipe.styleInstructions(currentPageEl);
    recipe.styleServingsPicker(currentPageEl, originalUrl);
    recipe.editButtons(currentPageEl, originalUrl);

    gaPush({ eventAction: 'Inf-scroll: nytt recept', eventLabel: currentUrl });

  },


  addGradient(currentPageEl,currentUrl,originalUrl) {
    //fade out effect for fixed height ingredients/instructions
    const gradient = document.createElement('a');
    gradient.classList.add('gradient');
    gradient.href = currentUrl + '#recept';
    const gradientBtn = document.createElement('span');
    gradientBtn.classList.add('button');
    gradientBtn.innerHTML = 'Visa hela receptet';
    gradient.append(gradientBtn);
    if (currentPageEl.querySelector('.recipe-content')) {
      currentPageEl.querySelector('.recipe-content').appendChild(gradient);
    }
    gradient.addEventListener("click", function(e) {
      e.preventDefault();
      const targetPage = e.target.closest('.page').getAttribute('data-href') + '#recept';
      recipe.relocate(targetPage, originalUrl);
    });
  },


  styleInstructions(currentPageEl) {
    //styling of instructions
    const howtoSection = currentPageEl.querySelector('howto-steps');
    if (howtoSection) {
      const howTo = document.createElement('div');
      howTo.classList.add('howto-steps','new-howto');
      const howtoItems = document.querySelectorAll('.recipe-howto-steps ol > li');
      let cookingSteps = '';
      for (var i = 0; i < howtoItems.length; i++) {
        cookingSteps = cookingSteps + '<div class="cooking-step"><div class="cooking-step__check"><label class="checkbox checkbox--circle" tabindex="0">' +
          '<input class="checkbox__input js-track-cookmode-stepcompleted" type="checkbox" tabindex="-1" data-tracking="{&quot;step&quot;:' + (i+1) + '}">' +
          '<span class="checkbox__label"></span></label></div>' +
          '<div class="cooking-step__content"><div class="cooking-step__content__instruction">' + howtoItems[i].innerHTML + '</div></div></div>';
      }
      howTo.innerHTML = cookingSteps;
      howtoSection.parentNode.prepend(howTo);
      if(howtoSection.querySelector('ol')) {
        howtoSection.querySelector('ol').remove();
      }
      const wrapper = document.querySelector('howto-steps');
      wrapper.outerHTML = wrapper.innerHTML;
    }
  },


  styleServingsPicker(currentPageEl, originalUrl) {
    //styling of servings picker
    const servingsPicker = currentPageEl.querySelector('.servings-picker--static');
    if (servingsPicker && currentPageEl.querySelector('.ingredients--dynamic')) {
      servingsPicker.innerHTML = '';
      const servingsWrapper = servingsPicker.parentNode;
      const servingsPickerNew = document.createElement('select');
      servingsPickerNew.classList.add('js-servingspicker');
      servingsPickerNew.name = 'portions';
      servingsPickerNew.id = 'currentPortions';
      const currentPortions = parseInt(servingsPicker.getAttribute('data-current-portions'));
      for (var i = 1; i < 7; i++) {
        const portions=i*2;
        const options = document.createElement('option');
        options.classList.add('servings-picker__servings');
        options.value = portions;
        options.innerHTML = portions + ' portioner';
        if(currentPortions === portions) {
          options.selected = 'selected';
        }
        servingsPickerNew.appendChild(options);
      }
      const customServings = document.createElement('div')
      customServings.classList.add('custom-select');
      customServings.appendChild(servingsPickerNew);
      servingsPicker.classList.add('servings-picker--dynamic');
      servingsPicker.classList.remove('servings-picker--static');
      servingsPicker.appendChild(customServings);

      const ingredientsHeader = document.createElement('div');
      ingredientsHeader.classList.add('ingredients__header')
      ingredientsHeader.appendChild(currentPageEl.querySelector('.ingredients--dynamic h2'));

      const ingredientsContent = document.createElement('div');
      ingredientsContent.classList.add('ingredients__content');

      currentPageEl.querySelector('.ingredients--dynamic').prepend(ingredientsHeader);
      currentPageEl.querySelector('.ingredients--dynamic').prepend(servingsPicker);

      servingsPicker.addEventListener("change", function(e) {
        const goToPage = e.target.closest('.page');
        recipe.relocate(goToPage.getAttribute('data-href') + '#portioner=' + e.target.value, originalUrl);
      })
    }
  },


  editButtons(currentPageEl, originalUrl) {

    //edit ratings button
    const ratingsBtn = currentPageEl.querySelector('.js-recipe-ratings-modal');
    if(ratingsBtn) {
      ratingsBtn.href = '#betyg';
      ratingsBtn.addEventListener("click", function(e) {
        e.preventDefault();
        const targetPage = e.target.closest('.page').getAttribute('data-href') + '#betyg';
        recipe.relocate(targetPage, originalUrl);
      })
    }

    //edit print button
    const printBtn = currentPageEl.querySelector('.button--print');
    if(printBtn) {
      printBtn.href = '#skriv-ut';
      printBtn.addEventListener("click", function(e) {
        e.preventDefault();
        const targetPage = e.target.closest('.page').getAttribute('data-href') + '#skriv-ut';
        recipe.relocate(targetPage, originalUrl);
      })
    }

    //edit save button
    const saveBtn = currentPageEl.querySelector('.button--heart');
    if(saveBtn) {
      const newSave = document.createElement('a');
      const newHref = saveBtn.closest('.page').getAttribute('data-href') + '#spara';
      newSave.href = newHref;
      newSave.classList.add('button','button--heart','button--auto-width');
      if (saveBtn.classList.contains('button--active')) {
        newSave.classList.add('button--active');
      }
      newSave.innerHTML = '<svg><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/Assets/icons/sprite.svg#heart"></use></svg><span class="recipe-save-text">Spara</span>';
      saveBtn.parentNode.replaceChild(newSave, saveBtn);
      newSave.addEventListener("click", function(e) {
        e.preventDefault();
        const targetPage = newHref;
        recipe.relocate(targetPage, originalUrl);
      })
    }

  },


  relocate(targetPage, originalUrl) {
    //prepare for clean back button functionality
    sessionStorage.prevPage = originalUrl;
    sessionStorage.prevPageWrapper = pageWrapper.innerHTML;
    history.replaceState(null, '', originalUrl);
    setTimeout(function () {
      window.location.href = targetPage;
    }, 500);
  },


  triggerAction(type,action,el) {
    const currentUrl = window.location.href.split(action)[0];
    if(document.referrer !== '') {
      //when original page has one of these params: recept, skriv-ut, betyg, spara, portioner
      const elPosition = el.getBoundingClientRect();
      window.scrollTo(0, elPosition.top - 200);

      setTimeout(function () {
        if(type==='click') {
          el.click();
        } else if (type==='select') {
          const portions = action.split('#portioner=')[1];
          el.value = portions;
          el.dispatchEvent(new Event('change'));
        }
        //Remove param from URL once triggered
        history.replaceState(null, null, currentUrl);
      }, 500);

    } else {
      history.replaceState(null, null, currentUrl);
    }

    gaPush({ eventAction: 'Inf-scroll: interaktion', eventLabel: action });

  },

};

export default recipe;
