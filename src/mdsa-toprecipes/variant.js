// ==UserScript==
// @name         recipe-toggle-ingredients
// @path         //./src/mdsa-cleanup/variant.js
// @namespace    http://tampermonkey.net/
// @version      0.1
// @match        https://www.ica.se/recept/*
// @grant        none
// ==/UserScript==

'use strict';

import { CROUTIL, ELM } from '../util/main';
import { ajax, gaPush } from '../util/utils';
import './style.css';

//spara recept - end om se om recept redan är sparat?
//ev ikoner
//---göm vid sök
//gömma dubbletter?

const test = {

  manipulateDom() {

    const recipeHeader = ELM.get('#recipe-header');

    //OBS! Gör sidkollen i optimize i stället!!!
    if ((/^https:\/\/www.ica.se\/recept\/vardag\/$/.test(window.location)) ||
    (/^https:\/\/www.ica.se\/recept\/potatis\/sallad\/$/.test(window.location)) ||
    (/^https:\/\/www.ica.se\/recept\/billiga-veckan\/$/.test(window.location)) ||
    (/^https:\/\/www.ica.se\/recept\/lax\/i-ugn\/$/.test(window.location)) ||
    (/^https:\/\/www.ica.se\/recept\/rabarber\/paj\/$/.test(window.location)) ||
    (/^https:\/\/www.ica.se\/recept\/rabarber\/$/.test(window.location)) ||
    (/^https:\/\/www.ica.se\/recept\/middag\/$/.test(window.location)) ||
    (/^https:\/\/www.ica.se\/recept\/grill\/$/.test(window.location))) {

      if (recipeHeader.exist()) {
        const toprecipesList = ELM.create('div toprecipes-list column size20of20 white-bg mdsa loaded');
        let recipe1,recipe2,recipe3;

        const topHeader = '<h3>ICA Köket rekommenderar</h3>';

        recipe1 = '<article class="recipe grid_fluid with-background" id="toprecipe-1"><div class="column size8of20 lg_size5of20"><figure class="sprite2-p" style=""><a href="" class="  lazyloaded" data-noscript=""><img src="" alt="" class="lazyNoscriptActive"></a></figure></div><div class="column size12of20 lg_size15of20"><header><h2 class="title"><a href=""></a></h2></header><div class="content sm_hidden"><a class="block"><p></p></a></div><div id="" class="yellow-stars" itemprop="aggregateRating" itemscope="" itemtype="http://schema.org/AggregateRating"><section class="rate-recipe"><div class="content"><dl class="inline rate" data-avg-rating=""><dt>Betyg:</dt><dd class="rating" style="z-index: 0"><meter class="hidden" value="" min="1" max="5"></meter><div class="grade grade-5" title="5 av 5" data-rating="5"><span class="sprite2 icon icon-star"></span></div><div class="grade grade-4" title="4 av 5" data-rating="4"><span class="sprite2 icon icon-star"></span></div><div class="grade grade-3" title="3 av 5" data-rating="3"><span class="sprite2 icon icon-star"></span></div><div class="grade grade-2" title="2 av 5" data-rating="2"><span class="sprite2 icon icon-star"></span></div><div class="grade grade-1" title="1 av 5" data-rating="1"><span class="sprite2 icon icon-star"></span></div><input type="hidden" id="hdnRecipeId" value=""></dd><dd class="small votes"><span itemprop="reviewCount"></span> röst<span class="plural-postfix">er</span></dd></dl></div></section></div><footer><ul class="recipe-info"><li class="md_lte_hidden"><span title="" class="ingredients"></span></li></ul></footer><div class="save-recipe-button"><a href="#" data-name="" data-link="" data-recipeid="" class="sprite2-p icon-heart save-recipe js-track-recipe-save " title="Spara">Spara</a></div></div></article>';
        recipe2 = '<article class="recipe grid_fluid with-background" id="toprecipe-2"><div class="column size8of20 lg_size5of20"><figure class="sprite2-p" style=""><a href="" class="  lazyloaded" data-noscript=""><img src="" alt="" class="lazyNoscriptActive"></a></figure></div><div class="column size12of20 lg_size15of20"><header><h2 class="title"><a href=""></a></h2></header><div class="content sm_hidden"><a class="block"><p></p></a></div><div id="" class="yellow-stars" itemprop="aggregateRating" itemscope="" itemtype="http://schema.org/AggregateRating"><section class="rate-recipe"><div class="content"><dl class="inline rate" data-avg-rating=""><dt>Betyg:</dt><dd class="rating" style="z-index: 0"><meter class="hidden" value="" min="1" max="5"></meter><div class="grade grade-5" title="5 av 5" data-rating="5"><span class="sprite2 icon icon-star"></span></div><div class="grade grade-4" title="4 av 5" data-rating="4"><span class="sprite2 icon icon-star"></span></div><div class="grade grade-3" title="3 av 5" data-rating="3"><span class="sprite2 icon icon-star"></span></div><div class="grade grade-2" title="2 av 5" data-rating="2"><span class="sprite2 icon icon-star"></span></div><div class="grade grade-1" title="1 av 5" data-rating="1"><span class="sprite2 icon icon-star"></span></div><input type="hidden" id="hdnRecipeId" value=""></dd><dd class="small votes"><span itemprop="reviewCount"></span> röst<span class="plural-postfix">er</span></dd></dl></div></section></div><footer><ul class="recipe-info"><li class="md_lte_hidden"><span title="" class="ingredients"></span></li></ul></footer><div class="save-recipe-button"><a href="#" data-name="" data-link="" data-recipeid="" class="sprite2-p icon-heart save-recipe js-track-recipe-save " title="Spara">Spara</a></div></div></article>';
        recipe3 = '<article class="recipe grid_fluid with-background" id="toprecipe-3"><div class="column size8of20 lg_size5of20"><figure class="sprite2-p" style=""><a href="" class="  lazyloaded" data-noscript=""><img src="" alt="" class="lazyNoscriptActive"></a></figure></div><div class="column size12of20 lg_size15of20"><header><h2 class="title"><a href=""></a></h2></header><div class="content sm_hidden"><a class="block"><p></p></a></div><div id="" class="yellow-stars" itemprop="aggregateRating" itemscope="" itemtype="http://schema.org/AggregateRating"><section class="rate-recipe"><div class="content"><dl class="inline rate" data-avg-rating=""><dt>Betyg:</dt><dd class="rating" style="z-index: 0"><meter class="hidden" value="" min="1" max="5"></meter><div class="grade grade-5" title="5 av 5" data-rating="5"><span class="sprite2 icon icon-star"></span></div><div class="grade grade-4" title="4 av 5" data-rating="4"><span class="sprite2 icon icon-star"></span></div><div class="grade grade-3" title="3 av 5" data-rating="3"><span class="sprite2 icon icon-star"></span></div><div class="grade grade-2" title="2 av 5" data-rating="2"><span class="sprite2 icon icon-star"></span></div><div class="grade grade-1" title="1 av 5" data-rating="1"><span class="sprite2 icon icon-star"></span></div><input type="hidden" id="hdnRecipeId" value=""></dd><dd class="small votes"><span itemprop="reviewCount"></span> röst<span class="plural-postfix">er</span></dd></dl></div></section></div><footer><ul class="recipe-info"><li class="md_lte_hidden"><span title="" class="ingredients"></span></li></ul></footer><div class="save-recipe-button"><a href="#" data-name="" data-link="" data-recipeid="" class="sprite2-p icon-heart save-recipe js-track-recipe-save " title="Spara">Spara</a></div></div></article>';

        toprecipesList.append(topHeader + recipe1 + recipe2 + recipe3);
        //toprecipesList.insertAfter(recipeHeader);
        ELM.get('.recipes').appendFirst(toprecipesList);


        if (/^https:\/\/www.ica.se\/recept\/vardag\/$/.test(window.location)) {
          // Chili con carne - https://www.ica.se/recept/chili-con-carne-424/
          // Krämig carbonara - https://www.ica.se/recept/kramig-carbonara-722780/
          // Busenkel broccolisoppa - https://www.ica.se/recept/busenkel-broccolisoppa-712859/

          test.modifyRecipe('toprecipe-1',
            424,
            'Chili con carne',
            'https://www.ica.se/recept/chili-con-carne-424/',
            '//www.ica.se/imagevaultfiles/id_182604/cf_5291/chili_con_carne.jpg',
            '4.2',
            '95',
            '15',
            'gul lök\nnötfärs\nolja\nchili\npaprikapulver\nsvartpeppar\nsalt\nsoja\ntomat\nböna\njalapeñopeppar\nbrytbröd\nsalladskål\npersilja\nvinägrett',
            'Chili con carne är en mustig och het gryta med köttfärs, chili, vita bönor, paprika och tomater. Detta klassiska mexikanska recept är både lättlagat och uppskattat av dina middagsgäster.'
          );

          test.modifyRecipe('toprecipe-2',
            722780,
            'Krämig carbonara',
            'https://www.ica.se/recept/kramig-carbonara-722780/',
            '//www.ica.se/imagevaultfiles/id_168478/cf_5291/kramig_carbonara.jpg',
            '3.9',
            '82',
            '9',
            'spaghetti\nbacon\nägg\nvispgrädde\nparmesanost\nsalt\nsvartpeppar\nruccola\näggula',
            'En klassisk, krämig carbonara med parmesanost, ruccola och den finaste svartpepparn – Tellicherry! Lika god en fredagkväll tillsammans med ett gott glas vin som till lyxlunch på helgen.'
          );

          test.modifyRecipe('toprecipe-3',
            712859,
            'Busenkel broccolisoppa',
            'https://www.ica.se/recept/busenkel-broccolisoppa-712859/',
            '//www.ica.se/imagevaultfiles/id_79915/cf_5291/busenkel_broccolisoppa.jpg',
            '4.2',
            '99',
            '8',
            'lök\npotatis\nbroccoli\ngrönsaksbuljong\nmatlagningsgrädde\nsalt och peppar\nbröd\nkräftstjärt',
            'En riktigt smarrig soppa av broccoli som dessutom är lätt som en plätt att laga till! Servera den varma broccolisoppan tillsammans med en brödbit och njut!'
          );

        } else if (/^https:\/\/www.ica.se\/recept\/potatis\/sallad\/$/.test(window.location)) {
          // Enkel - https://www.ica.se/recept/enkel-potatissallad-723665/
          // Fransk - https://www.ica.se/recept/fransk-potatissallad-165198/
          // Med pepparrot och äpple - https://www.ica.se/recept/potatissallad-med-pepparrot-och-apple-722108/

          test.modifyRecipe('toprecipe-1',
            723665,
            'Enkel potatissallad',
            'https://www.ica.se/recept/enkel-potatissallad-723665/',
            '//www.ica.se/imagevaultfiles/id_180652/cf_5291/enkel_potatissallad.jpg',
            '3.7',
            '3',
            '8',
            'potatis\nsalladslök\nbostongurka\ngräddfil\nmajonnäs\ndijonsenap\nsalt\nsvartpeppar',
            'Sommarens bästa potatissallad? Perfekt för midsommar eller middagen med det där lilla extra. Klassiska ingredienser men nu med adderad dijonsenap vilket ger ett extra sting!'
          );

          test.modifyRecipe('toprecipe-2',
            165198,
            'Fransk potatissallad',
            'https://www.ica.se/recept/fransk-potatissallad-165198/',
            '//www.ica.se/imagevaultfiles/id_44923/cf_5291/fransk_potatissallad.jpg',
            '4.6',
            '38',
            '11',
            'potatis\nschalottenlök\ndill\nkapris\nvinäger\nsenap\nsalt\nsvartpeppar\nsocker\nolivolja\nvatten',
            'Denna fantastiskt goda, franska potatissallad passar utmärkt med det mesta. Sin karaktäristiska, mumsiga smak får potatissalladen när den blandas ihop med den lena senaps- och vinägersåsen. Strö över lite kapris och servera ihop med mört kött.'
          );

          test.modifyRecipe('toprecipe-3',
            722108,
            'Potatissallad med pepparrot och äpple',
            'https://www.ica.se/recept/potatissallad-med-pepparrot-och-apple-722108/',
            '//www.ica.se/imagevaultfiles/id_160299/cf_5291/potatissallad_med_pepparrot_och_apple.jpg',
            '5.0',
            '6',
            '12',
            'potatis\nsalladslök\ngräslök\nrädisa\npepparrot\nsaltgurka\näpple\ngräddfil\nmajonnäs\ndijonsenap\nkapris\nsalt och svartpeppar',
            'Äpple, pepparrot, gräslök och skivade rädisor ger din krämiga potatissallad en fräsch krispighet. Perfekt på buffébordet eller att ta med på picknick. Måste testas!'
          );

        } else if (/^https:\/\/www.ica.se\/recept\/billiga-veckan\/$/.test(window.location)) {
          // Pasta - https://www.ica.se/recept/pasta-med-tomatsas-och-linser-723155/
          // Chili - https://www.ica.se/recept/chili-con-carne-med-ris-723146/
          // Kyckling - https://www.ica.se/recept/kyckling-teriyaki-med-ris-och-minimajs-723152/

          test.modifyRecipe('toprecipe-1',
            723155,
            'Pasta med tomatsås och linser',
            'https://www.ica.se/recept/pasta-med-tomatsas-och-linser-723155/',
            '//www.ica.se/imagevaultfiles/id_176291/cf_5291/pasta_med_tomatsas_och_linser.jpg',
            '4.6',
            '16',
            '9',
            'morot\krossad tomat\krossad tomat\röd lins\spaghetti\olivolja\vatten\salt\peppar',
            'Pasta är en riktig vardagshjälte när tiden är knapp och familjen är hungrig. Men för att höja näringsvärdet på måltiden är röda linser och morötter två smarta ingredienser att ha i såsen. Detta recept är superenkelt och såsen kan mixas om det passar barnen bättre. Toppa med riven ost.'
          );

          test.modifyRecipe('toprecipe-2',
            723146,
            'Chili con carne med ris',
            'https://www.ica.se/recept/chili-con-carne-med-ris-723146/',
            '//www.ica.se/imagevaultfiles/id_176253/cf_5291/chili_con_carne_med_ris.jpg',
            '3.7',
            '18',
            '12',
            'ris\nlök\nkidneyböna\nnötfärs\npastasås\npaprika\nolja\ntomatpuré\npaprikapulver\nvatten\nsalt\npeppar',
            'Med färdig pastasås, en burk kidneybönor och köttfärs har du grunden till en riktigt snabb och enkel chili con carne. Tillsammans med paprika och ris blir måltiden komplett och passar hela familjen. Perfekt att frysa in i matlådor om det blir mat över.'
          );

          test.modifyRecipe('toprecipe-3',
            723152,
            'Kyckling teriyaki med ris och minimajs',
            'https://www.ica.se/recept/kyckling-teriyaki-med-ris-och-minimajs-723152/',
            '//www.ica.se/imagevaultfiles/id_176288/cf_5291/kyckling_teriyaki_med_ris_och_minimajs.jpg',
            '4.0',
            '19',
            '7',
            'ris\nkycklingfilé\nminimajs\nteriyakisås\nbabyspenat\nolja\nvatten',
            'Teriyaki kyckling gör du enkelt själv med färdig teriyakisås och kycklingfilé. Slänger du dessutom ner lite söt minimajs i pannan blir barnen extra glada. Servera kycklingen med ris och babyspenat och kanske lite rostade sesamfrön, om du har tid.'
          );

        } else if (/^https:\/\/www.ica.se\/recept\/lax\/i-ugn\/$/.test(window.location)) {
          // Limelax i ugn - https://www.ica.se/recept/limelax-i-ugn-med-chilicreme-722771/
          // Lax i ugn med romsås - https://www.ica.se/recept/ugnsstekt-lax-med-romsas-723067/
          // Saltinbakad med citronsås - https://www.ica.se/recept/saltbakad-lax-med-citronsas-laktosfri-676720/

          test.modifyRecipe('toprecipe-1',
            722771,
            'Limelax i ugn med chilicrème',
            'https://www.ica.se/recept/limelax-i-ugn-med-chilicreme-722771/',
            '//www.ica.se/imagevaultfiles/id_169738/cf_5291/limelax_i_ugn_med_chilicrème_.jpg',
            '4.4',
            '19',
            '19',
            'laxfilé\nolivolja\nlimeskal\nsalt\nsvartpeppar\ncrème fraiche\nlimejuice\nsrirachasås\nsalt\npeppar\nbroccoli\nvitlöksklyfta\nmajskorn\nsmör\nsalt\npeppar\nkoriander\ngurka\ntortillabröd',
            'Lax i ugn ger fin fredagsfeeling med goda tillbehör som smörstekt majs, broccoli och chilicréme. Bjud limelaxen och tillbehören plockigt och låt var och en fylla sitt bröd efter egen smak.'
          );

          test.modifyRecipe('toprecipe-2',
            722771,
            'Ugnsstekt lax med romsås',
            'https://www.ica.se/recept/limelax-i-ugn-med-chilicreme-722771/',
            '//www.ica.se/imagevaultfiles/id_172037/cf_5291/ugnsstekt_lax_med_romsas.jpg',
            '4.5',
            '26',
            '7',
            'potatis\nlaxfilé\nsalt\npeppar\ngräddfil\ncaviarmix\nbroccoli',
            'Ugnsstekt lax som tillagas tills den blir underbart mör passar utmärkt ihop med en krämig romsås. Ät fisken tillsammans med nykokt potatis och krispig broccoli och du har en vardagsmiddag som passar hela familjen.'
          );

          test.modifyRecipe('toprecipe-3',
            676720,
            'Saltbakad lax med citronsås - laktosfri',
            'https://www.ica.se/recept/saltbakad-lax-med-citronsas-laktosfri-676720/',
            '//www.ica.se/imagevaultfiles/id_19462/cf_5291/saltbakad_lax_med_citronsas_-_laktosfri.jpg',
            '4.6',
            '18',
            '11',
            'lax\nsalt\nlätt crème fraiche\nmatlagningsgrädde\nfiskbuljongtärning\ncitron\nsalt\ngräslök\npotatis\nsockerärta\ncitronklyfta',
            'Denna himmelska, saltbakade lax med smakfull, laktosfri citronsås kommer bli mycket uppskattad på middagsbordet. Koka ihop din härliga sås under tiden laxen tillagas och servera den sedan ihop med pressad potatis, citron och krispiga sockerärter.'
          );

        } else if (/^https:\/\/www.ica.se\/recept\/rabarber\/paj\/$/.test(window.location)) {
          // Knäckig rabarberpaj - https://www.ica.se/recept/knackig-rabarberpaj-715053/
          // Nyttigare rabarberpaj - https://www.ica.se/recept/nyttigare-rabarberpaj-721996/
          // Rabarberkladdkaka - https://www.ica.se/recept/rabarberkladdkaka-med-vit-choklad-och-kardemumma-721994/

          test.modifyRecipe('toprecipe-1',
            715053,
            'Knäckig rabarberpaj',
            'https://www.ica.se/recept/knackig-rabarberpaj-715053/',
            '//www.ica.se/imagevaultfiles/id_63250/cf_5291/knackig_rabarberpaj.jpg',
            '4.4',
            '205',
            '11',
            'rabarber\nhavregryn\nsocker\nvetemjöl\nbakpulver\nvaniljsocker\nsmör\nvispgrädde\nsirap\nsmör\nvaniljglass',
            'Syrlig rabarber under knäckigt havretäcke med kolasmak. Läckrare rabarberpaj får man leta efter. Servera gärna med vaniljglass.'
          );

          test.modifyRecipe('toprecipe-2',
            721996,
            'Nyttigare rabarberpaj',
            'https://www.ica.se/recept/nyttigare-rabarberpaj-721996/',
            '//www.ica.se/imagevaultfiles/id_161155/cf_5291/nyttigare_rabarberpaj.jpg',
            '4.5',
            '8',
            '10',
            'rabarber\njordgubbe\nkardemummakärna\nkokossocker\npotatismjöl\nhavregryn\nhonung\nvaniljsocker\nsmör\nvatten',
            'Klassisk smulpaj med syrliga rabarber och söta jordgubbar. Pajen är sötad med honung och kokossocker. Vi har valt havregryn som tillför nyttiga fibrer istället för vetemjöl och den innehåller mindre smör. Smakar som en sommardag!'
          );

          test.modifyRecipe('toprecipe-3',
            721994,
            'Rabarberkladdkaka med vit choklad och kardemumma',
            'https://www.ica.se/recept/rabarberkladdkaka-med-vit-choklad-och-kardemumma-721994/',
            '//www.ica.se/imagevaultfiles/id_161146/cf_5291/rabarberkladdkaka_med_vit_choklad_och_kardemumma.jpg',
            '3.9',
            '65',
            '10',
            'smör\nvit choklad\nströsocker\nsalt\nägg\nkardemummakärna\nvetemjöl\nrabarber\npotatismjöl\nflorsocker',
            'Smarrig kladdkaka med rabarber, vit choklad och kardemumma. Ett lättlagat och somrigt recept där rabarberns syrliga strävhet balanseras av den söta och mjuka kladdkakan. Här hittar du fler härliga kladdkakerecept.'
          );

        } else if (/^https:\/\/www.ica.se\/recept\/rabarber\/$/.test(window.location)) {
          // Knäckig rabarberpaj med brynt smör - https://www.ica.se/recept/rabarberpaj-med-brynt-smor-718995/
          // Rabarberkräm - https://www.ica.se/recept/len-rabarberkram-med-kardemumma-713752/
          // Rabarberkladdkaka - https://www.ica.se/recept/rabarberkladdkaka-med-vit-choklad-och-kardemumma-721994/

          test.modifyRecipe('toprecipe-1',
            718995,
            'Knäckig rabarberpaj med brynt smör',
            'https://www.ica.se/recept/rabarberpaj-med-brynt-smor-718995/',
            '//www.ica.se/imagevaultfiles/id_116224/cf_5291/rabarberpaj_med_brynt_smor.jpg',
            '4.3',
            '23',
            '9',
            'rabarber\nsmör\nhavregryn\nströsocker\nvetemjöl\nbakpulver\nsirap\nmjölk\nsalt',
            'Lyxa till rabarberpajen med brynt smör. Det ger en fantastisk nötig touch som passar perfekt till den sötsyrliga fyllningen. En glutenfri variant? Välj ren havre och byt ut vetemjöl mot potatismjöl. Servera pajen ljummen med vaniljglass eller fluffig vaniljsås.'
          );

          test.modifyRecipe('toprecipe-2',
            713752,
            'Len rabarberkräm med kardemumma',
            'https://www.ica.se/recept/len-rabarberkram-med-kardemumma-713752/',
            '//www.ica.se/imagevaultfiles/id_36643/cf_5291/len_rabarberkram_med_kardemumma_.jpg',
            '4.1',
            '13',
            '7',
            'vatten\nsocker\nkardemumma\nrabarber\npotatismjöl\nsocker\nmjölk',
            'Recept på en utsökt och somrig efterrätt gjord på rabarber. Rabarberkräm med kardemumma fixar du snabbt av bland annat socker, kardemumma, rabarber och potatismjöl. Servera den lena krämen med mjölk till dessert.'
          );

          test.modifyRecipe('toprecipe-3',
            721994,
            'Rabarberkladdkaka med vit choklad och kardemumma',
            'https://www.ica.se/recept/rabarberkladdkaka-med-vit-choklad-och-kardemumma-721994/',
            '//www.ica.se/imagevaultfiles/id_161146/cf_5291/rabarberkladdkaka_med_vit_choklad_och_kardemumma.jpg',
            '3.9',
            '65',
            '10',
            'smör\nvit choklad\nströsocker\nsalt\nägg\nkardemummakärna\nvetemjöl\nrabarber\npotatismjöl\nflorsocker',
            'Smarrig kladdkaka med rabarber, vit choklad och kardemumma. Ett lättlagat och somrigt recept där rabarberns syrliga strävhet balanseras av den söta och mjuka kladdkakan. Här hittar du fler härliga kladdkakerecept.'
          );

        } else if (/^https:\/\/www.ica.se\/recept\/middag\/$/.test(window.location)) {
          // Klassisk lasagne - https://www.ica.se/recept/klassisk-lasagne-679675/
          // Risotto med svamp - https://www.ica.se/recept/risotto-med-skogschampinjoner-716952/
          // Foliepaket med torsk - https://www.ica.se/recept/foliepaket-med-torskrygg-sparris-potatis-orter-och-citron-714922/

          test.modifyRecipe('toprecipe-1',
            679675,
            'Klassisk lasagne',
            'https://www.ica.se/recept/klassisk-lasagne-679675/',
            '//www.ica.se/imagevaultfiles/id_76171/cf_5291/klassisk_lasagne.jpg',
            '4.2',
            '217',
            '17',
            'lök\nvitlöksklyfta\nnötfärs\nolja\ntomatpuré\ntimjan\nrosmarin\nkrossad tomat\nköttbuljongtärning\nsalt och peppar\nlasagneplatta\nmatfett\nvetemjöl\nmjölk\nsalt och peppar\nparmesanost\nsallad',
            'Klassisk lasagne är väl en rätt man aldrig tröttnar på? Med det här receptet blir din lasagne perfekt med en mjuk och härlig konsistens och dessutom har den en ljuv och exemplarisk smak. Parmesanosten är pricken över i!'
          );

          test.modifyRecipe('toprecipe-2',
            716952,
            'Risotto med skogschampinjoner',
            'https://www.ica.se/recept/risotto-med-skogschampinjoner-716952/',
            '//www.ica.se/imagevaultfiles/id_89399/cf_5291/risotto_med_skogschampinjoner.jpg',
            '4.8',
            '106',
            '11',
            'schalottenlök\nvitlöksklyfta\nsvampbuljong\nolivolja\narborioris\nvin\nkastanjechampinjon\nsmör\nparmesanost\nsalt\nruccola',
            'En perfekt kokt risotto är krämig och riset har kvar lite tuggmotstånd. Följ det här grundreceptet på svamprisotto och du har alla chanser att lyckas. Kastanjechampinjonerna i risotton går utmärkt att byta ut mot andra goda svampar som kantareller, karljohansvamp eller portabella till en ännu lyxigare vegetarisk festrätt.'
          );

          test.modifyRecipe('toprecipe-3',
            714922,
            'Foliepaket med torskrygg, sparris, potatis, örter och citron',
            'https://www.ica.se/recept/foliepaket-med-torskrygg-sparris-potatis-orter-och-citron-714922/',
            '//www.ica.se/imagevaultfiles/id_63758/cf_5291/foliepaket_med_torskrygg__sparris__potatis__orter_och_citron.jpg',
            '4.8',
            '23',
            '12',
            'färskpotatis\nrödlök\nchili\nrädisa\ngrön sparris\nsmör\nört\ncitron\nflingsalt\npeppar\ngrillfolie\ntorskfilé',
            'Enklaste sättet att grilla är i folie! Gärna primörer med gräslök, persilja, citron, lite chili och smör. Riktigt gott till grillad fisk som torsk eller lax. En sommarfräsch middag till både vardag och fest.'
          );

        } else if (/^https:\/\/www.ica.se\/recept\/grill\/$/.test(window.location)) {
          // Grillad lax i folie - https://www.ica.se/recept/grillad-lax-i-folie-720557/
          // Grillade grönsaksspett med sting - https://www.ica.se/recept/grillade-gronsaksspett-med-sting-720369/
          // Karréspett - https://www.ica.se/recept/karrespett-med-tahinisas-och-grillad-hjartsallad-723893/

          test.modifyRecipe('toprecipe-1',
            720557,
            'Grillad lax i folie',
            'https://www.ica.se/recept/grillad-lax-i-folie-720557/',
            '//www.ica.se/imagevaultfiles/id_138072/cf_5291/grillad_lax_i_folie.jpg',
            '4.0',
            '5',
            '5',
            'laxfilé\nfolieark\nsalt och svartpeppar\nsmör\nört',
            'Grillad lax i folie som trängs med härliga kryddor blir verkligen en smaksensation i sig. Lägg till en god sås, härliga tillbehör och en solig eftermiddag och du har garanterat en sommardag att minnas tillbaka till.'
          );

          test.modifyRecipe('toprecipe-2',
            720369,
            'Grillade grönsaksspett med sting',
            'https://www.ica.se/recept/grillade-gronsaksspett-med-sting-720369/',
            '//www.ica.se/imagevaultfiles/id_137108/cf_5291/grillade_gronsaksspett_med_sting_____.jpg',
            '3.0',
            '112',
            '9',
            'grillspett\npaprikapulver\nsambal oelek\nolja\nzucchini\nröd paprika\naubergine\nchampinjon\nsalt och svartpeppar',
            'Grillade grönsaksspett piffar upp vilken grilltallrik som helst och med den röda paprikan i fokus blir det en härlig färgklick. I receptet som presenteras nedan oljas grönsakerna in med både parikapulver och sambal oelek, som i sin tur förhöjer smakerna i denna fina grönsaksblandning.'
          );

          test.modifyRecipe('toprecipe-3',
            723893,
            'Karréspett med tahinisås och grillad hjärtsallad',
            'https://www.ica.se/recept/karrespett-med-tahinisas-och-grillad-hjartsallad-723893/',
            '//www.ica.se/imagevaultfiles/id_180838/cf_5291/karréspett_med_tahinisas_och_grillad_hjartsallad.jpg',
            '5.0',
            '1',
            '14',
            'kokosmjölk\ningefära\ntahini\nhonung\nlime\nsrirachasås\nsalt\nkarré\npeppar\nhjärtsalladshuvud\nbroccoli\nris\nsesamfrö\nlime',
            'Gör premiär på grillen med dessa saftiga och möra karréspett och grillad hjärtsallad. Den karaktäristiska tahinisåsen som du serverar till, får sin smak från tahini, ingefära, kokosmjölk, lime och sriracha. Lägg upp det grillade på ett stort fat och strö över rostade sesamfrön. Voìla!'
          );

        }

        window.onpopstate = function(event) {
          if (/^https:\/\/www.ica.se\/recept\/.*:search=.*$/.test(window.location)) {
            toprecipesList.css('cro-search');
          } else {
            toprecipesList.removeClass('cro-search');
          }
        };

      }

    }

  },

  modifyRecipe(recipe,recipeId,recipeName,recipeUrl,recipeImg,recipeAvg,recipeVotes,recipeIngredients,recipeIngredientsList,recipeDesc) {
    const recipeEl = ELM.get('#'+recipe);
    const saveBtn = recipeEl.find('.save-recipe-button a');
    recipeEl.find('header a').text(recipeName).attr('href',recipeUrl);
    recipeEl.find('figure a').attr('href',recipeUrl);
    recipeEl.find('figure img').attr('src',recipeImg).attr('alt',recipeName);
    recipeEl.find('.content a.block').attr('href',recipeUrl);
    recipeEl.find('.content p').text(recipeDesc);
    recipeEl.find('.yellow-stars').attr('id','recipeRating' + recipeId);
    recipeEl.find('.rate-recipe .rate').attr('data-avg-rating',recipeAvg);
    recipeEl.find('.rate-recipe meter').attr('value',recipeAvg).text(recipeAvg + '/5');
    recipeEl.find('footer .ingredients').attr('title',recipeIngredientsList).text(recipeIngredients + ' ingredienser');
    recipeEl.find('dd.votes span').text(recipeVotes);
    recipeEl.find('#hdnRecipeId').attr('value',recipeId);

    saveBtn.attr('data-name',recipeName).attr('data-link',recipeUrl).attr('data-recipeid',recipeId);

    saveBtn.click((e) => {
      e.preventDefault();
      ICA.legacy.savedRecipes.add(recipeId, function (data) {
          icadatalayer.add('recipe-save'); // Add info to datalayer for analytics
          saveBtn.css('active');
          saveBtn.css('icon-heart-filled');
      });
    });
  },

};

$(document).ready(() => {
  Object.assign(test, CROUTIL());
  test.manipulateDom();
});
