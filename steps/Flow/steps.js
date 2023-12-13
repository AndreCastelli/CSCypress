import {
  When as Quando,
  Then as Então,
  And as E,
} from 'cypress-cucumber-preprocessor/steps';

import { camelCase } from 'lodash';
import { faker } from '@faker-js/faker';
import { TEXTS } from '../../../utils/constants';
import FlowElements from '../../elements/FlowElements';
import Page from '../../page_objects/Page';
import { arrayToObject } from '../../../utils/util';
import FlowApprovalsElements from '../../elements/FlowApprovalsElements';
import FlowPermissionsElements from '../../elements/FlowPermissionsElements';
import commonComponents from '../../page_objects/commonComponents';

import flowsPage from '../../page_objects/flowsPage';

const FlowPermissionsPage = new Page(FlowPermissionsElements);
const flowApprovals = new Page(FlowApprovalsElements);
const flowPage = new Page(FlowElements);
const user = Cypress.config('user');
const FlowName = faker.commerce.productName();
const member = Cypress.config('member');

E('seleciono o segundo formulário', (params) => {
  const page = arrayToObject(params.rawTable);
  cy.contains(TEXTS.FLOW.STEPS_TITLES.SECOND_FORM_SELECT, { timeout: 10000 }).should('be.visible');
  flowPage.clickForm(page['Nome do fluxo']);
  flowPage.secondFormNextButton.click();
});

E('preencho o email para envio do segundo formulario', () => {
  flowPage.emailField.type(user.email);
  flowPage.messageField.type('Preencha o formulário dois');
  flowPage.clickNextStepButton();
});

E('vejo que possuo {int} signatários adicionados na lista de signatários', (qntsigners) => {
  flowPage.signerListInfo.get().should('have.length', qntsigners);
});

E('vejo as opções do fluxo', (params) => {
  const items = arrayToObject(params.rawTable);
  flowsPage.checkPresenceOptions(items);
});

E('clico nas opções do fluxo criado', () => {
  flowPage.clickFormOptions(FlowName);
});

E('clico na opção {string} do fluxo criado', (option) => {
  flowPage.clickFlowFormOption(FlowName, option);
});

E('clico na opção desativar do fluxo criado', () => {
  flowPage.clickFlowDisableOption();
});

E('clico na opção excluir do fluxo criado', () => {
  flowPage.clickFlowDeleteOption();
});

E('vejo o alerta de {string}', (option) => {
  if (option === 'Desativar') {
    flowPage.seeWarning('Se você desativar o fluxo ele não poderá ser utilizado, mas você poderá ativá-lo a qualquer momento.');
  } else if (option === 'Excluir') {
    flowPage.seeWarning('O relatório e as aprovações pendentes deste fluxo também serão excluídos. Para salvar uma cópia das respostas do fluxo, acesse o relatório e baixe-o antes de excluir.');
  }
});

E('clico definitivamente em {string}', (option) => {
  if (option === 'Desativar') {
    flowPage.clickOptionModal('Disable');
  } else if (option === 'Excluir') {
    flowPage.clickOptionModal('Delete');
  }
});

E('eu preencho os dados do signatário com autenticação adicional: {string}', (addictional) => {
  commonComponents.clickAddSignerButton();
  const signerData = {
    Email: 'clicksigncypress@gmail.com',
    'Nome completo': 'Clicksign Cypress',
    'Autenticação obrigatória': 'Token Via EMail',
    'Autenticação adicional': addictional,
  };
  commonComponents.addSignerDetails(signerData);
  commonComponents.clickNextStepAddSignerModalButton();
  commonComponents.saveSelectSignAs(['Assinar como testemunha']);
  commonComponents.clickNextStepButton();
});

E('concluo configuração ativando a aprovação do fluxo pelo operador', () => {
  flowPage.sectionTitle.contains(TEXTS.FLOW.STEPS_TITLES.SETTINGS);
  flowApprovals.activateApprovalRadio.click({ force: true });
  flowPage.settingNextStepButton.click();
  flowPage.messageNextStepButton.click();
  flowPage.activeNextStepButton.click();
  flowPage.closeButton.click();
});

Quando('clico em aprovar', () => {
  flowApprovals.approveFlow();
});

Quando('clico em reprovar', () => {
  flowApprovals.disapproveFlow();
});

E('estou na página de fluxos', () => {
  FlowPermissionsPage.flowsMenuOption.click();
  cy.contains('Criar fluxo', { timeout: 5000 }).should('be.visible');
});

E('seleciono a opção {string}', (text) => {
  cy.wait(3000);
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

E('clico em avançar', () => {
  cy.wait(2000);
  flowPage.clickNextStepButton();
});
