import { lowerFirst, camelCase } from 'lodash';

export default {
  formsMenuOption: ['clickable'],
  flowsMenuOption: ['clickable'],
  createFlowButton: ['clickable'],
  createFormButton: ['clickable'],
  formNameField: ['typeable'],
  documentUploadModalButton: ['clickable'],
  modeloComEmailTemplateOption: ['clickable'],
  nextStepButton: ['clickable'],
  settingNextStepButton: ['clickable'],
  messageNextStepButton: ['clickable'],
  editFormExample1EditButton: ['clickable'],

  createForm(formName, type) {
    cy.get('[data-testid=createFormButton]').click();
    cy.get('[data-testid=formNameField]').clear().type(formName);
    cy.get(`[data-type=${type}]`).click();
    cy.get('[data-testid=saveFormSettingsButton]').click();
    cy.get('[class=link]').click();
  },

  createTwoForms(formName) {
    this.createForm(`${formName}1`, 'email');
    this.createForm(`${formName}2`, 'tel');
  },

  flowName(flowName) {
    cy.get('[data-testid=nameField]').clear().type(flowName);
    cy.get('[data-testid=nextStepButton]').filter(':visible').click();
  },

  fillSecondForm(emailName) {
    cy.get('[data-testid=emailField]').type(emailName);
    cy.get('[data-testid=nextStepButton]').filter(':visible').click();
  },

  selectForm(flowName) {
    cy.get(`[data-testid=${`${lowerFirst(camelCase(flowName))}1`}FormOption]`).first().click();
    cy.get('[data-testid=nextStepButton]').filter(':visible').click();
    cy.get('[data-testid=secondFormOptionModal]').click();
    cy.get('[data-testid=modalNextStepButton]').click();
    cy.wait(3000);
    cy.get(`[data-testid=${`${lowerFirst(camelCase(flowName))}2`}FormOption]`).first().click();
    cy.get('[data-testid=secondFormNextButton]').click();
  },

  contentDocs() {
    cy.wait(3000);
    cy.get('#select-0').select('E-mail do signatário');
    cy.get('#select-1').select('E-mail do signatário');
    cy.get('#select-2').select('E-mail do signatário');
    cy.get('#select-3').select('E-mail do signatário');
    cy.get('[data-testid=nextStepButton]').filter(':visible').click();
  },

  nameDocs() {
    cy.get('[data-testid=tagInputDropdownButton]').click();
    cy.wait(2000);
    cy.get('[tagifysuggestionidx=0]').click();
    cy.get('[data-testid=nextStepButton]').filter(':visible').click();
  },

  flowSigner(singerEmail, signerName) {
    cy.get('[data-testid=addSignerButton]').click();
    cy.get('[data-testid=signerEmailField]').first().type(singerEmail);
    cy.get('[data-testid=signerNameField]').first().type(signerName);
    cy.get('[data-testid=hasDocumentationCheckbox]').first().click({ force: true });
    cy.get('[data-testid=signerAuthFieldSelect]').first().click();
    cy.get('[data-testid=selectFieldTokenViaEMailOption]').first().click();
    cy.get('[data-testid=nextStepAddSignerModalButton]').first().click();
    cy.get('[data-testid=signerSignAsSelect]').click();
    cy.get('[data-testid=signerSignAsSelectSignOption]').click();
    cy.get('[data-testid=nextStepAddSignerModalButton]').first().click();
    cy.get('[data-testid=nextStepButton]').filter(':visible').click();
    cy.get('[data-testid=skipAddSignerFormButton]').click();
  },

  createFlow(flowNameExample, singerEmail, signerName, formName) {
    this.flowName(flowNameExample);
    this.selectForm(formName);
    this.fillSecondForm(singerEmail);
    cy.get('[data-testid=modeloComEmailTemplateOption]').click();
    cy.get('[data-testid=nextStepButton]').filter(':visible').click();
    this.contentDocs();
    this.nameDocs();
    this.flowSigner(singerEmail, signerName);
    cy.get('[data-testid=settingNextStepButton]').click();
    cy.get('[data-testid=messageNextStepButton]').click();
    cy.get('[data-testid=activeNextStepButton]').click();
    cy.get('[class=link]').click();
  },
};
