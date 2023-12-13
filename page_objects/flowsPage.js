import { faker } from '@faker-js/faker';
import { lowerFirst, camelCase } from 'lodash';

let FlowName = '';

export default {

  clickFlowsMenu() {
    cy.get('[data-testid=flowsMenuOption]').click();
    cy.contains('Criar fluxo', { timeout: 6000 }).should('be.visible');
  },

  createDefaultFlow() {
    this.clickFlowsMenu();
    this.createDefaultFlowWithForm();
  },

  createDefaultFlowWithForm() {
    const signer = {
      Email: 'clicksigncypress@gmail.com',
      Name: 'Cypress name',
    };
    FlowName = faker.commerce.productName();
    const paramsDoc = ['E-mail', 'Telefone', 'CPF', 'CNPJ'];
    this.createFlow(FlowName, 'Formulário 2', 'Modelo com email', paramsDoc, signer);
  },

  createFlow(flowName, formName, templateName, paramsContentDoc, signer) {
    cy.get('[data-testid=createFlowButton]').click();
    this.typeFlowName(flowName);
    this.selectForm(formName);
    this.selectNextToTemplateChoice();
    this.selectTemplate(templateName);
    this.contentDocs(paramsContentDoc);
    this.nameDocs();
    this.flowSigner(signer.Email, signer.Name);
    cy.get('[data-testid=settingNextStepButton]').filter(':visible').click();
    cy.get('[data-testid=messageNextStepButton]').filter(':visible').click();
    cy.get('[data-testid=activeNextStepButton]').filter(':visible').click();
    cy.get('[data-testid=closeButton]').click();
  },

  typeFlowName(flowName) {
    cy.wait(2000);
    cy.get('[data-testid=nameField]').clear().type(flowName);
    cy.get('[data-testid=nextStepButton]').filter(':visible').click();
  },

  selectForm(formName) {
    cy.get(`[data-testid=${`${lowerFirst(camelCase(formName))}`}FormOption]`).first().click();
    cy.get('[data-testid=nextStepButton]').filter(':visible').click();
  },

  selectNextToTemplateChoice() {
    cy.get('[data-testid=templateOptionModal]').click();
    cy.get('[data-testid=modalNextStepButton]').filter(':visible').click();
  },

  selectTemplate(templateName) {
    cy.get(`[data-testid=${`${lowerFirst(camelCase(templateName))}`}TemplateOption]`).first().click();
    cy.get('[data-testid=nextStepButton]').filter(':visible').click();
  },

  contentDocs(params) {
    params.forEach((item, index) => {
      cy.get(`#select-${index}`, { timeout: 15000 }).select(item);
    });
    cy.get('[data-testid=nextStepButton]').filter(':visible').click();
  },

  nameDocs() {
    cy.get('[data-testid=tagInputDropdownButton]').click();
    cy.wait(2000);
    cy.get('[tagifysuggestionidx=0]').click();
    cy.getByTestid('openFolderTagInputDropdownButton').click();
    cy.wait(500);
    cy.get('[tagifysuggestionidx=0]').click();
    cy.get('[data-testid=nextStepButton]').filter(':visible').click();
  },

  flowSigner(singerEmail, signerName) {
    cy.get('[data-testid=addSignerButton]').click();
    cy.get('[data-testid="signerCommunicateByFieldSelect"] ').first().click();
    cy.get('[data-testid="selectFieldEmailOption"]').filter(':visible').click();
    cy.get('[data-testid=saveAsContactSwitch]:visible').click();
    cy.get('[data-testid=signerEmailField]').first().type(singerEmail);
    cy.get('[data-testid=signerNameField]').first().type(signerName);
    cy.get('[data-testid=hasDocumentationCheckbox]').first().click({ force: true });
    cy.get('[data-testid=signerAuthFieldSelect]').first().click();
    cy.get('[data-testid=selectFieldEmailOption]').filter(':visible').first().click();
    cy.get('[data-testid=nextStepAddSignerModalButton]').first().click();
    cy.get('[data-testid=signerSignAsSelect]').click();
    cy.get('[data-testid=selectFieldSignOption]').click();
    cy.get('[data-testid=nextStepAddSignerModalButton]').first().click();
    cy.get('[data-testid=nextStepButton]').filter(':visible').click();
    cy.get('[data-testid=skipAddSignerFormButton]').click();
  },

  accessFlowOptions() {
    cy.get(`[data-testid=${camelCase(FlowName)}Dropdown]`, { timeout: 5000 }).click();
  },

  createFlowFakeName() {
    FlowName = faker.name.firstName();
    return FlowName;
  },

  checkPresenceOptions(items) {
    this.accessFlowOptions();
    Object.keys(items).forEach((key) => {
      cy.get(`[data-testid="${`${key}Option`}"]`, { timeout: 1000 }).filter(':visible').contains(items[key]);
    });
  },

};
