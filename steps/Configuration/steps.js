import {
  When as Quando,
  Then as Então,
  And as E,
} from 'cypress-cucumber-preprocessor/steps';

import { arrayToObject } from '../../../utils/util';
import Page from '../../page_objects/Page';
import ConfigurationElements from '../../elements/ConfigurationElements';

const configurationPage = new Page(ConfigurationElements);

/* STEPS */

E('preencho os dados do formulário com', (params) => {
  configurationPage.fillConfigurationData(arrayToObject(params.rawTable));
});

E('clico no botão Salvar alterações', () => {
  configurationPage.submitButton.get().should('be.visible');
  configurationPage.submitButton.click();
});

E('apago o nome digitado', () => {
  configurationPage.nameField.get().should('be.visible');
  configurationPage.nameField.get().first().clear({ force: true });
});

E('o botão de Salvar alterações fica desabilitado', () => {
  configurationPage.submitButton.get().should('be.visible');
  configurationPage.submitButton.get().should('be.disabled');
});

Quando('clico em {string}', (text) => {
  cy.contains(text).click();
});

Então('vejo uma modal para confirmar a alteração de tipo de conta', () => {
  configurationPage.entityTypeWarnModal.get().should('be.visible');
  configurationPage.confirmSaveButton.get().should('be.visible');
  configurationPage.cancelButton.click();
});

Então('vejo a mensagem de valor é obrigatório no campo', () => {
  cy.contains(/O campo é obrigatório|O valor é obrigatório/g);
});
