import {
  And as E,
  When as Quando,
  Then as Então,
} from 'cypress-cucumber-preprocessor/steps';

import PixElements from '../../elements/PixElements';
import Page from '../../page_objects/Page';
import WidgetElements from '../../elements/WidgetElements';

import { arrayToObject } from '../../../utils/util';
import { TEXTS_PIX } from '../../../utils/constants';

const widgetPage = new Page(WidgetElements);
const pixPage = new Page(PixElements);

/* STEPS */

Quando('avanço pela step confirmar dados pix', (params) => {
  const page = arrayToObject(params.rawTable);
  widgetPage.signDocumentButton.contains(page['Botão de assinar']);
  widgetPage.signDocumentButton.click();
  if (page['Botão de começar']) {
    widgetPage.nextStepInfoButton.contains(page['Botão de começar']);
    widgetPage.nextStepInfoButton.click();
  }
});

E('avanço pela step pix {string}', (lang) => {
  if (lang === 'pt-BR') {
    TEXTS_PIX.PIX_TUTORIAL_STEP_PT_1.forEach((item) => {
      pixPage.sectionPixTutorial.contains(item);
    });
    pixPage.nextStepButton.click();
    TEXTS_PIX.PIX_TUTORIAL_STEP_PT_2.forEach((item) => {
      pixPage.sectionPixTutorial.contains(item);
    });
    pixPage.nextStepButton.click();
    TEXTS_PIX.PIX_TUTORIAL_STEP_PT_3.forEach((item) => {
      pixPage.sectionPixTutorial.contains(item);
    });
    pixPage.nextStepButton.click();
    TEXTS_PIX.PIX_TUTORIAL_STEP_PT_4.forEach((item) => {
      pixPage.sectionPixTutorial.contains(item);
    });
  } else if (lang === 'en-US') {
    TEXTS_PIX.PIX_TUTORIAL_STEP_EN_1.forEach((item) => {
      pixPage.sectionPixTutorial.contains(item);
    });
    pixPage.nextStepButton.click();
    TEXTS_PIX.PIX_TUTORIAL_STEP_EN_2.forEach((item) => {
      pixPage.sectionPixTutorial.contains(item);
    });
    pixPage.nextStepButton.click();
    TEXTS_PIX.PIX_TUTORIAL_STEP_EN_3.forEach((item) => {
      pixPage.sectionPixTutorial.contains(item);
    });
    pixPage.nextStepButton.click();
    TEXTS_PIX.PIX_TUTORIAL_STEP_EN_4.forEach((item) => {
      pixPage.sectionPixTutorial.contains(item);
    });
  }
});

Então('verifico o Por que Pix {string}', (lang) => {
  pixPage.helpLink.click();
  if (lang === 'pt-BR') {
    TEXTS_PIX.WHY_PIX_PT.forEach((item) => {
      pixPage.sectionPixTutorial.contains(item);
    });
  } else if (lang === 'en-US') {
    TEXTS_PIX.WHY_PIX_EN.forEach((item) => {
      pixPage.sectionPixTutorial.contains(item);
    });
  }
  pixPage.closeModalButton.click();
});

E('verifico Dificuldades com Pix {string}', (lang) => {
  pixPage.helpLink.click();
  if (lang === 'pt-BR') {
    TEXTS_PIX.DIFFICULTIES_WITH_PIX_PR.forEach((item) => {
      pixPage.sectionPixTutorial.contains(item);
    });
  } else if (lang === 'en-US') {
    TEXTS_PIX.DIFFICULTIES_WITH_PIX_EN.forEach((item) => {
      pixPage.sectionPixTutorial.contains(item);
    });
  }
  pixPage.sendFeedbackButtonDisabled();
  pixPage.pixFeedbackModalCheckOthers();
  pixPage.feedbackTextArea.type('Teste Cypress');
  pixPage.sendFeedbackButtonEnable();
  pixPage.cancelSendFeedbackButton.click();
});
