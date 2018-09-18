'use strict';

import { CROUTIL, ELM } from '../util/main';
import { gaPush } from '../util/utils';

//bugg tom loadingarea? tillbaka till 1 och fram igen?
//---(ev) förflytta sig i historiken - hamna högst upp på aktuellt recept

//OK____skriv ut
//OK____görsåhär-styling
//OK____ingredienser-styling
//OK???____e-handla nja....
//OK____"För alla" m.m. (kvarvarande ol ok?)
//lägg i inköpslista (primär om ingen varukorgknapp)
//portionsomräknaren
//timers
//ladda kupong
//spara recept
//betygsätt

//näring --- använd __recipeData /OK____klimatguide
//kommentarer --- använd __recipeData

//mutationObserver????

const recipe = {

  buyBtn(buyBtnId,recipeId) {
    if(recipeId) {
      ICA_online.recipeToCart.init({
        scriptTagId: "IcaOnlineBuyScript",
        domHookId: buyBtnId,
        recipeId: recipeId,
        theme: 'icaSe2017'
      });
    }
  },

  initRecipe(currentPage) {

    const shoppingListBtn = currentPage.find('.js-open-shoppinglist-modal');
    if (shoppingListBtn.exist()) {
      shoppingListBtn.click(() => {
        console.log('shoppingListBtn');
        // isWindowModalOpen((element) => {
        //   this.modal(element);
        // });
      });
    }

    const printBtn = currentPage.find('.button--print');
    if (printBtn.exist()) {
      printBtn.removeAttr('href');
      printBtn.click(() => {
        window.print();
      })
    }

    setTimeout(function () {
      const saveBtn = currentPage.find('.button--heart');
      if (saveBtn.exist()) {
        saveBtn.removeAttr('href');
        console.log(saveBtn.closest('.recipepage').attr('data-id'));
        saveBtn.click((e) => {
          e.preventDefault();
          ICA.legacy.savedRecipes.add(saveBtn.closest('.recipepage').attr('data-id'), function (data) {
            icadatalayer.add('recipe-save'); // Add info to datalayer for analytics
            saveBtn.css('active');
            saveBtn.css('icon-heart-filled');
          });
        })
      }
    }, 500);

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

    //sällanfel bör vara fixat iom .ingredients--dynamic-koll

    const servingsPicker = currentPage.find('.servings-picker--static');
    if (servingsPicker.exist() && currentPage.find('.ingredients--dynamic').exist()) {
      const servingsWrapper = servingsPicker.parent();
      document.querySelector('.servings-picker--static').innerHTML='';
      const customServings = ELM.create('div custom-select').append('<select name="portions" id="currentPortions" class="js-servingspicker"><option class="servings-picker__servings" value="2">2 portioner</option><option class="servings-picker__servings" value="4">4 portioner</option><option class="servings-picker__servings" value="6">6 portioner</option><option class="servings-picker__servings" value="8">8 portioner</option><option class="servings-picker__servings" value="10">10 portioner</option><option class="servings-picker__servings" value="12">12 portioner</option></select>');
      servingsPicker.css('servings-picker--dynamic').removeClass('servings-picker--static').append(customServings);
      const ingredientsHeader = ELM.create('div ingredients__header').append(currentPage.find('.ingredients--dynamic h2'));
      const ingredientsContent = ELM.create('div ingredients__content');
      currentPage.find('.ingredients--dynamic').append(servingsPicker).append(ingredientsHeader).append(ingredientsContent);
      const ingredientList = currentPage.find('.ingredients--dynamic').children('ul, strong');
      for (var i = 0; i < ingredientList.length; i++) {
        ingredientsContent.append(ingredientList[i]);
      }
    }

    const commentsSection = currentPage.find('section.comments');
    if (commentsSection.exist()) {
      let commentsText;
      const commentsCount = currentPage.find('.comments__header__text--votes');
      if (commentsCount.exist()) {
        commentsText = 'Kommentarer '+ commentsCount.text();
      } else {
        commentsText = 'Kommentarer (0)';
      }
      const commentsBtn = ELM.create('div comments-toggle button--link').append(commentsText).css('button');
      commentsSection.append(commentsBtn);
      commentsBtn.click(() => {
        //commentsBtn.parent().find('.comments__inner-wrapper').toggle('open');
        console.log(commentsText);
      })
    }

    const nutrientsSection = currentPage.find('.recipe-details .nutrients');
    const climateSection = currentPage.find('.recipe-details .climate');
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
      currentPage.find('.recipe-details').append(detailsBtn);
      detailsBtn.click(() => {
        console.log(detailsText);
        // detailsBtn.parent().find('.row').toggle('open');
        // if (detailsBtn.parent().find('show-more[v-cloak]').exist()) {
        //   detailsBtn.parent().find('show-more').removeAttr('v-cloak');
        // }
      });
      // if (nutrientsSection.exist()) {
      //
      //   const recipeinfo = pageWrapper.find('.page:last-child > script').html();
      //   let nutrientsInfo = recipeinfo.substring(recipeinfo.indexOf('nutrition:'),recipeinfo.indexOf('comments:')).replace(/(\r\n|\n|\r)/gm,"");
      //   nutrientsInfo = nutrientsInfo.substring(nutrientsInfo.indexOf('{') + 1,nutrientsInfo.indexOf('}'));
      //   nutrientsInfo = nutrientsInfo.split(',');
      //
      //   let nutrArr = [];
      //   for (var i = 0; i < nutrientsInfo.length; i++) {
      //     let value = nutrientsInfo[i].split(':');
      //     value = value[1].trim();
      //     nutrArr.push(value);
      //   }
      //
      //   const y = Math.max(...nutrArr) / 80;
      //
      //   let nutrHtml = '<div id="nutrient-graphic" class="nutrient__graphic"><span data-v-39be5b5b=""><div data-v-39be5b5b="" class="nutrients-chart">';
      //       nutrHtml += createNutrient('Fett','fat',nutrArr[0],y);
      //       nutrHtml += createNutrient('Salt','salt',nutrArr[1],y);
      //       nutrHtml += createNutrient('Kolhydrater','carbs',nutrArr[2],y);
      //       nutrHtml += createNutrient('Protein','protein',nutrArr[3],y);
      //       nutrHtml += '</div><a data-v-39be5b5b="" href="/halsa/artikel/naringslara/" class="block-link">Läs mer om näringsvärden</a></span></div>'
      //
      //   if (currentPage.find('#nutrient-graphic').exist()) {
      //     currentPage.find('#nutrient-graphic').html(nutrHtml);
      //   }
      //
      //   function createNutrient(name,type,value,y) {
      //     const width = value / y;
      //     if (value < 0) {
      //       console.log(0 + ' / ' + y);
      //       return '<div data-v-39be5b5b="" class="nutrient"><div data-v-39be5b5b="" class="nutrient__category">' + name + '</div><div data-v-39be5b5b="" class="nutrient__bar nutrient__bar--' + type + '" style="width: ' + 0 + '%"></div><div data-v-39be5b5b="" class="nutrient__value">' + 0 + '&nbsp;g</div></div>';
      //     } else {
      //       console.log(value + ' / ' + y);
      //       return '<div data-v-39be5b5b="" class="nutrient"><div data-v-39be5b5b="" class="nutrient__category">' + name + '</div><div data-v-39be5b5b="" class="nutrient__bar nutrient__bar--' + type + '" style="width: ' + width + '%"></div><div data-v-39be5b5b="" class="nutrient__value">' + value + '&nbsp;g</div></div>';
      //     }
      //   }
      // }
    }

  }

};

export default recipe;
