import { VALIDATIONS, TEXTS } from '../../utils/constants';

import FlowElements from './FlowElements';
import Page from '../page_objects/Page';
import WidgetElements from './WidgetElements';

const flowPage = new Page(FlowElements);
const widgetPage = new Page(WidgetElements);

const { FORM_SELECT_STEP } = TEXTS.FLOW;

const user = Cypress.config('user');
const crypto = require('crypto');

export default {

  randomName() {
    return crypto.randomBytes(20).toString('hex');
  },
  secondForm() {
    cy.task('get-env', {}).then((enviroment) => {
      cy.wait(7000);
      if (enviroment === 'development' || enviroment === 'test') {
        cy.mhGetMailsBySubjectRegex(/.*/).mhFirst().mhGetBody().then((body) => {
          const bodyAux = String(body).replace(/(\r\n|\n|\r)/gm, '').replace('=/', '/');
          const secondFormUrl = bodyAux.match(/.*(http.*:\/\/.*\/fluxia\/+[0-9, a-z,-]{0,36}\/process\/[0-9, a-z,-]{0,36}).*/)[1];
          cy.visit(secondFormUrl);
        });
      } else {
        cy.task('gmail:check-inbox', {
          options: {
            subject: 'CLICKSIGN QA enviou um formulário para você preencher',
            include_body: true,
          },
        }).then((emails) => {
          const body = emails[0].body.text;
          const secondFormUrl = body.match(VALIDATIONS.SECOND_FORM_URL)[0];
          cy.visit(secondFormUrl);
        });
      }
    });
  },
  goToOption(option, page) {
    if (option === FORM_SELECT_STEP.MODAL.OPTIONS.SECOND_FORM.TITLE) {
      flowPage.secondFormOptionModal.get().should('be.visible');
      flowPage.secondFormOptionModal.click();
      flowPage.modalNextStepButton.click();
      flowPage.secondFormOptionModal.get().should('not.be.exist');
      cy.contains(TEXTS.FLOW.STEPS_TITLES.SECOND_FORM_SELECT, { timeout: 10000 }).should('be.visible');
      flowPage.clickForm(page['Seleciono o segundo formulário de nome']);
      cy.wait(1000);
      flowPage.secondFormNextButton.click();
      flowPage.emailField.type(user.email);
      flowPage.messageField.type('Preencha o formulário dois');
      flowPage.nextStepButton.click();
    } else if (option === FORM_SELECT_STEP.MODAL.OPTIONS.TEMPLATE.TITLE) {
      flowPage.templateOptionModal.get().should('be.visible');
      flowPage.templateOptionModal.click();
      flowPage.modalNextStepButton.click();
      flowPage.templateOptionModal.get().should('not.be.exist');
    }
  },
  setDocumentConfiguration(page) {
    if (page.Tipo === 'Default') {
      flowPage.sectionTitle.contains(TEXTS.FLOW.STEPS_TITLES.SETTINGS);
      flowPage.messageNextStepButton.click();
      flowPage.activeNextStepButton.click();
      flowPage.closeButton.click();
    } else if (page.Tipo === 'Personalizado') {
      // TODO
    }
  },
  advanceBySteps(page) {
    widgetPage.signDocumentButton.contains(page['Botão de assinar']);
    widgetPage.signDocumentButton.click();
    if (page['Botão de começar']) {
      widgetPage.nextStepInfoButton.contains(page['Botão de começar']);
      widgetPage.nextStepInfoButton.click();
    }
    widgetPage.nextStepInfoButton.contains(page['Botão de avançar']);
    widgetPage.nextStepInfoButton.click();
    widgetPage.nameInput.type(page.Nome);
    widgetPage.documentationInput.type(page.CPF);
    widgetPage.birthdayInput.type(page.Data);
    cy.contains(page['Botão de avançar']).click();
  },
};
