import {
  When as Quando,
  Then as Então,
  And as E,
  Given as Dado,
} from 'cypress-cucumber-preprocessor/steps';

import { camelCase } from 'lodash';
import FlowPermissionsElements from '../../elements/FlowPermissionsElements';
import Page from '../../page_objects/Page';

import flowsPage from '../../page_objects/flowsPage';

const FlowPermissionsPage = new Page(FlowPermissionsElements);

const member = Cypress.config('member');

Dado('que tenho um fluxo ativo', () => {
  flowsPage.createDefaultFlow();
});

E('estou na página de fluxos', () => {
  flowsPage.clickFlowsMenu();
});

Quando('que clico em Opções', () => {
  flowsPage.accessFlowOptions();
});

E('seleciono a opção {string}', (text) => {
  cy.wait(5000);
  cy.get('[data-testid=selectPrivacyType]').select(text);
});

Então('vejo um alerta de sucesso', () => {
  cy.contains('Definições de permissões atualizadas com sucesso.').should('be.visible');
});

E('que clico em {string}', (text) => {
  cy.get(`[data-testid=${camelCase(text)}]`).click();
});

E('deseleciono um membro', () => {
  FlowPermissionsPage.clickMemberCheckbox(member);
});

E('clico na opção permissões do fluxo criado', () => {
  FlowPermissionsPage.clickFormFlowPermissionsOption();
});
