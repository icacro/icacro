'use strict';

import { CROUTIL, ELM } from '../util/main';
import { gaPush } from '../util/utils';

const pageWrapper = ELM.get('#page-wrapper');

const recipe = {

  initRecipe(currentPage,currentUrl,prevPage,pageCount,originalTitle,originalUrl) {

    //fade out effect for fixed height ingredients/instructions
    const gradient = ELM.create('a gradient').attr('href',currentUrl + '?recept');
    const gradientBtn = ELM.create('span').css('button').html('Visa hela receptet');
    gradient.append(gradientBtn);
    currentPage.find('.recipe-content').append(gradient);
    gradient.click((e) => {
      //prepare for clean back button functionality
      history.replaceState(null, originalTitle, originalUrl);
    })

    //update page id's and set attributes data-count + data-id
    currentPage.attr('id','page');
    prevPage.attr('id','page-' + prevPage.attr('data-count'));
    currentPage.attr('data-count',pageCount);
    const urlParts = currentUrl.split('/');
    const nameParts = urlParts[2].split('-');
    const recipeId = nameParts[nameParts.length - 1];
    currentPage.attr('data-id',recipeId);

    //styling of instructions
    const howtoSection = currentPage.find('howto-steps');
    if (howtoSection.exist()) {
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
      howtoSection.find('ol').remove();
      const wrapper = document.querySelector('howto-steps');
      wrapper.outerHTML = wrapper.innerHTML;
    }

    //styling of servings picker
    const servingsPicker = currentPage.find('.servings-picker--static');
    if (servingsPicker.exist() && currentPage.find('.ingredients--dynamic').exist()) {
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
      const ingredientsHeader = ELM.create('div ingredients__header').append(currentPage.find('.ingredients--dynamic h2'));
      const ingredientsContent = ELM.create('div ingredients__content');
      currentPage.find('.ingredients--dynamic').append(servingsPicker).append(ingredientsHeader).append(ingredientsContent);
      const ingredientList = currentPage.find('.ingredients--dynamic').children('ul, strong');
      for (var i = 0; i < ingredientList.length; i++) {
        ingredientsContent.append(ingredientList[i]);
      }
      servingsPicker.change((e) => {
        const goToPage = e.target.closest('.page');
        window.location.href = goToPage.getAttribute('data-href') + '?portioner=' + e.target.value;
      })
    }

    //edit ratings button
    const ratingsBtn = currentPage.find('.js-recipe-ratings-modal');
    if(ratingsBtn) {
      ratingsBtn.attr('href', '?betyg');
      ratingsBtn.click((e) => {
        e.preventDefault();
        const targetPage = e.target.closest('.page').getAttribute('data-href') + '?betyg';
        recipe.relocate(targetPage, originalTitle, originalUrl);
      })
    }

    //edit print button
    const printBtn = currentPage.find('.button--print');
    if(printBtn) {
      printBtn.attr('href', '?skriv-ut');
      printBtn.click((e) => {
        e.preventDefault();
        const targetPage = e.target.closest('.page').getAttribute('data-href') + '?skriv-ut';
        recipe.relocate(targetPage, originalTitle, originalUrl);
      })
    }

    //edit save button
    const saveBtn = currentPage.find('.js-recipe-save');
    // if(saveBtn) {
    //   if (saveBtn.attr('href') === '#') {
    //     saveBtn.attr('href', '?spara');
    //   }
    //   saveBtn.click((e) => {
    //     e.preventDefault();
    //     const targetPage = e.target.closest('.page').getAttribute('data-href') + '?spara';
    //     recipe.relocate(targetPage, originalTitle, originalUrl);
    //   })
    // }

  },


  relocate(targetPage, originalTitle, originalUrl) {
    //prepare for clean back button functionality
    history.replaceState(null, originalTitle, originalUrl);
    document.location.href = targetPage;
  },


  triggerAction(type,action,el) {
    //when original page has one of these params: recept, skriv-ut, betyg, spara, portioner
    const elPosition = el.getBoundingClientRect();
    window.scrollTo(0, elPosition.top - 200);

    setTimeout(function () {
      if(type==='click') {
        el.click();
      } else if (type==='select') {
        const portions = action.split('?portioner=')[1];
        el.value = portions;
      }
      //Remove param from URL once triggered
      const currentUrl = window.location.href.split(action)[0];
      history.replaceState(null, null, currentUrl);
    }, 500);
  },


  hideComments(page) {
    //only on first/full page
    const commentsSection = page.find('section.comments');
    if (commentsSection.exist()) {
      let commentsText;
      const commentsCount = page.find('.comments__header__text--votes');
      if (commentsCount.exist()) {
        commentsText = 'Kommentarer '+ commentsCount.text();
      } else {
        commentsText = 'Kommentarer (0)';
      }
      const commentsBtn = ELM.create('div comments-toggle button--link').append(commentsText).css('button');
      commentsSection.append(commentsBtn);
      commentsBtn.click(() => {
        commentsBtn.parent().find('.comments__inner-wrapper').toggle('open');
      })
    }
  },


  hideNutrientsClimate(page) {
    //only on first/full page
    const nutrientsSection = page.find('.recipe-details .nutrients');
    const climateSection = page.find('.recipe-details .climate');
    if (nutrientsSection.exist() || climateSection.exist()) {
      let detailsText;
      if (nutrientsSection.exist() && climateSection.exist()) {
        detailsText = 'Näringsvärde och klimatguide';
      } else if (nutrientsSection.exist()) {
        detailsText = 'Näringsvärde';
      } else if (climateSection.exist()) {
        detailsText = 'Klimatguide';
      }
      const detailsBtn = ELM.create('div details-toggle button--link').append(detailsText).css('button');
      page.find('.recipe-details').append(detailsBtn);
      detailsBtn.click(() => {
        if (climateSection.exist()) {
          document.querySelector('.climate .button--link').click();
        }
        if (nutrientsSection.exist()) {
          document.querySelector('.nutrients .button--link').click();
        }
        detailsBtn.parent().find('.row').toggle('open');
      });
    }
  },

};

export default recipe;
