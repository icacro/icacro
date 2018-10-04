'use strict';

import { CROUTIL, ELM } from '../util/main';
import { gaPush } from '../util/utils';

const pageWrapper = ELM.get('#page-wrapper');

const recipe = {

  initRecipe(currentPageEl,currentUrl,prevPage,pageCount,originalUrl) {

    recipe.addGradient(currentPageEl,currentUrl,originalUrl);

    //update page id's and set attributes data-count + data-id
    currentPageEl.id = 'page';
    currentPageEl.setAttribute('data-count',pageCount);
    const urlParts = currentUrl.split('/');
    const nameParts = urlParts[2].split('-');
    const recipeId = nameParts[nameParts.length - 1];
    currentPageEl.setAttribute('data-id',recipeId);
    console.log('current = page');
    prevPage.id = 'page-' + prevPage.getAttribute('data-count');

    // recipe.styleInstructions(currentPageEl);
    //
    // recipe.styleServingsPicker(currentPageEl, originalUrl);
    //
    // recipe.editButtons(currentPageEl, originalUrl);

  },


  addGradient(currentPageEl,currentUrl,originalUrl) {
    //fade out effect for fixed height ingredients/instructions
    // const gradient = ELM.create('a gradient').attr('href',currentUrl + '#recept');
    // const gradientBtn = ELM.create('span').css('button').html('Visa hela receptet');

    const gradient = document.createElement('a');
    gradient.classList.add('gradient');
    gradient.href = currentUrl + '#recept';
    const gradientBtn = document.createElement('span');
    gradientBtn.classList.add('button');
    gradientBtn.innerHTML = 'Visa hela receptet';

    gradient.appendChild(gradientBtn);
    if (currentPageEl.querySelector('.recipe-content')) {
      currentPageEl.querySelector('.recipe-content').appendChild(gradient);
    } else {
      console.log('no recipe-content');
    }
    // gradient.click((e) => {
    //   e.preventDefault();
    //   const targetPage = e.target.closest('.page').getAttribute('data-href') + '#recept';
    //   recipe.relocate(targetPage, originalUrl);
    // })
  },


  styleInstructions(currentPageEl) {
    //styling of instructions
    const howtoSection = currentPageEl.querySelector('howto-steps');
    if (howtoSection) {
      const howTo = ELM.create('div howto-steps');
      const howtoItems = document.querySelectorAll('.recipe-howto-steps ol > li');
      for (var i = 0; i < howtoItems.length; i++) {
        const cookingStepCheck = ELM.create('div cooking-step__check').append(ELM.create('label checkbox checkbox--circle').attr('tabindex','0').append(ELM.create('input checkbox__input js-track-cookmode-stepcompleted').attr('type','checkbox').attr('tabindex','-1').attr('data-tracking','{&quot;step&quot;:' + (i+1) + '}')).append(ELM.create('span checkbox__label')));
        const cookingStepContent = ELM.create('div cooking-step__content').append(ELM.create('div cooking-step__content__instruction').append(howtoItems[i].innerHTML));
        howTo.append(ELM.create('div cooking-step').append(cookingStepCheck).append(cookingStepContent));
        let completed = 0;
        cookingStepCheck.click(() => {
          if (completed === 0) {
            cookingStepCheck.parent().css('completed');
            window.setTimeout(function () {
              completed = 1;
            },20);
          } else {
            cookingStepCheck.parent().removeClass('completed');
            window.setTimeout(function () {
              completed = 0;
            },30);
          }
        })
      }
      howtoSection.parent().append(howTo.append(howtoSection));
      if(howtoSection.find('ol').exist()) {
        howtoSection.find('ol').remove();
      }
      const wrapper = document.querySelector('howto-steps');
      wrapper.outerHTML = wrapper.innerHTML;
    }
  },


  styleServingsPicker(currentPageElm, originalUrl) {
    //styling of servings picker
    const servingsPicker = currentPageElm.find('.servings-picker--static');
    if (servingsPicker.exist() && currentPageElm.find('.ingredients--dynamic').exist()) {
      servingsPicker.html(' ');
      const servingsWrapper = servingsPicker.parent();
      const servingsPickerNew = ELM.create('select js-servingspicker').attr('name','portions').attr('id','currentPortions');
      const currentPortions = parseInt(servingsPicker.attr('data-current-portions'));
      for (var i = 1; i < 7; i++) {
        const portions=i*2;
        const options = ELM.create('option servings-picker__servings');
        options.attr('value',portions);
        options.html(portions + ' portioner');
        if(currentPortions === portions) {
          options.attr('selected','selected');
        }
        servingsPickerNew.append(options);
      }
      const customServings = ELM.create('div custom-select').append(servingsPickerNew);
      servingsPicker.css('servings-picker--dynamic').removeClass('servings-picker--static').append(customServings);
      const ingredientsHeader = ELM.create('div ingredients__header').append(currentPageElm.find('.ingredients--dynamic h2'));
      const ingredientsContent = ELM.create('div ingredients__content');
      currentPageElm.find('.ingredients--dynamic').append(servingsPicker).append(ingredientsHeader).append(ingredientsContent);
      const ingredientList = currentPageElm.find('.ingredients--dynamic').children('ul, strong');
      for (var i = 0; i < ingredientList.length; i++) {
        ingredientsContent.append(ingredientList[i]);
      }
      servingsPicker.change((e) => {
        const goToPage = e.target.closest('.page');
        recipe.relocate(goToPage.getAttribute('data-href') + '#portioner=' + e.target.value, originalUrl);
      })
    }
  },


  editButtons(currentPageElm, originalUrl) {

    //edit ratings button
    const ratingsBtn = currentPageElm.find('.js-recipe-ratings-modal');
    if(ratingsBtn.exist()) {
      ratingsBtn.attr('href', '#betyg');
      ratingsBtn.click((e) => {
        e.preventDefault();
        const targetPage = e.target.closest('.page').getAttribute('data-href') + '#betyg';
        recipe.relocate(targetPage, originalUrl);
      })
    }

    //edit print button
    const printBtn = currentPageElm.find('.button--print');
    if(printBtn.exist()) {
      printBtn.attr('href', '#skriv-ut');
      printBtn.click((e) => {
        e.preventDefault();
        const targetPage = e.target.closest('.page').getAttribute('data-href') + '#skriv-ut';
        recipe.relocate(targetPage, originalUrl);
      })
    }

    //edit save button
    const saveBtn = currentPageElm.find('.button--heart');
    if(saveBtn.exist()) {
      if (saveBtn.attr('href') === '#') {
        saveBtn.attr('href', '#spara');
      }
      saveBtn.click((e) => {
        e.preventDefault();
        const targetPage = e.target.closest('.page').getAttribute('data-href') + '#spara';
        recipe.relocate(targetPage, originalUrl);
      })
    }

  },


  relocate(targetPage, originalUrl) {
    //prepare for clean back button functionality
    sessionStorage.prevPage = originalUrl;
    sessionStorage.prevPageWrapper = pageWrapper.html();
    history.replaceState(null, '', originalUrl);
    console.log('prevPage set: ' + sessionStorage.prevPage);
    setTimeout(function () {
      window.location.href = targetPage;
    }, 500);
  },


  triggerAction(type,action,el) {
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
        const currentUrl = window.location.href.split(action)[0];
        history.replaceState(null, null, currentUrl);
      }, 500);

    } else {
      const currentUrl = window.location.href.split(action)[0];
      history.replaceState(null, null, currentUrl);
    }
  },

};

export default recipe;
