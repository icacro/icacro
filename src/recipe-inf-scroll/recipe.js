'use strict';

import { CROUTIL, ELM } from '../util/main';
import { gaPush } from '../util/utils';

const pageWrapper = ELM.get('#page-wrapper');

const recipe = {

  initRecipe(currentPage,originalTitle,originalUrl) {

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

    const ratingsBtn = currentPage.find('.js-recipe-ratings-modal');
    ratingsBtn.attr('href', '?betyg');

    const printBtn = currentPage.find('.button--print');
    printBtn.attr('href', '?skriv-ut');

    const saveBtn = currentPage.find('.js-recipe-save');
    if (saveBtn.attr('href') === '#') {
      saveBtn.attr('href', '?spara');
    }

    ratingsBtn.click((e) => {
      e.preventDefault();
      const targetPage = e.target.closest('.page').getAttribute('data-href') + '?betyg';
      history.replaceState(null, originalTitle, originalUrl);
      document.location.href = targetPage;
    })
    printBtn.click((e) => {
      e.preventDefault();
      const targetPage = e.target.closest('.page').getAttribute('data-href') + '?skriv-ut';
      history.replaceState(null, originalTitle, originalUrl);
      document.location.href = targetPage;
    })
    saveBtn.click((e) => {
      e.preventDefault();
      const targetPage = e.target.closest('.page').getAttribute('data-href') + '?spara';
      history.replaceState(null, originalTitle, originalUrl);
      document.location.href = targetPage;
    })

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

  },

  initFirst(page) {

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

  }

};

export default recipe;
