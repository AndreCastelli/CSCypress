import { faker } from '@faker-js/faker';
import { upperFirst, camelCase } from 'lodash';
import Page from '../page_objects/Page';
import CommonElements from './CommonElements';

const commonPage = new Page(CommonElements);

export default {
  templatesLink: ['clickable'],
  createTemplateButton: ['clickable'],
  saveTemplateConfirmButton: ['clickable'],
  deleteTemplateConfirmButton: ['clickable'],
  nextStepCreateDocumentButton: ['clickable'],
  documentFileNameField: ['clickable'],
  documentVarJsonField: ['clickable'],
  sendDocumentButton: ['clickable'],
  getNewRandomTemplateName() {
    return faker.random.word();
  },
  clickCreateTemplateButton() {
    cy.get('[data-testid=createTemplateButton]').should('be.visible');
    cy.get('[data-testid=createTemplateButton]').contains('Criar Modelo').click();
  },
  clickEditTemplateButton(templateName) {
    const itemId = upperFirst(camelCase(templateName));
    cy.get(`[data-testid="template${itemId}OptionsDropdown"]`).first().click();
    cy.get('[data-testid="edit-template"]').filter(':visible').click();
  },
  clickDeleteTemplateButton(templateName) {
    const itemId = upperFirst(camelCase(templateName));
    cy.get(`[data-testid="template${itemId}OptionsDropdown"]`).first().click();
    cy.get('[data-testid="delete-template"]').filter(':visible').click();
  },
  clickGenerateDocumentButton(templateName) {
    const itemId = upperFirst(camelCase(templateName));
    cy.get(`[data-testid="template${itemId}OptionsDropdown"]`).first().click();
    cy.get('[data-testid="generate-document"]').filter(':visible').click();
  },
  clickSaveTemplateButton() {
    cy.wait(3000);
    cy.get('[data-testid=saveTemplateConfirmButton]').should('be.visible');
    cy.get('[data-testid=saveTemplateConfirmButton]').contains('Salvar').click();
  },
  clickConfirmDeleteTemplateButton(text) {
    cy.get('[data-testid=confirmationModalConfirm]').should('be.visible');
    cy.get('[data-testid=confirmationModalConfirm]').contains(text).click();
  },
  fillTemplateNameField(templateName) {
    cy.get('[data-testid=templateNameField]').clear().type(templateName);
  },
  attachFile(filePath, fileName) {
    commonPage.documentUpload(filePath, fileName);
    cy.get('[data-testid=documentFileNameField]').should('contain', fileName);
    cy.wait(300);
  },
  checkTemplateExists(templateName) {
    const itemId = upperFirst(camelCase(templateName));
    cy.get(`[data-testid="nodeTemplate${itemId}Card"]`, { timeout: 15000 }).should('be.visible');
  },
  checkDocumentCreated(templateName) {
    const itemId = upperFirst(camelCase(templateName));
    cy.get(`[data-testid="nodeDocument${itemId}DocxItem"]`, { timeout: 15000 }).should('be.visible');
  },
  checkTemplateNotExists(templateName) {
    const itemId = upperFirst(camelCase(templateName));
    cy.get(`[data-testid="nodeTemplate${itemId}Card"]`, { timeout: 15000 }).should('not.exist');
  },
  createSingleTemplate(templateName, filePath, fileName) {
    this.clickCreateTemplateButton();
    this.fillTemplateNameField(templateName);
    this.attachFile(filePath, fileName);
    this.clickSaveTemplateButton();
    cy.contains('Modelo criado com sucesso.', { timeout: 20000 }).click();
  },
  clickNextStepCreateDocumentButton() {
    cy.get('[data-testid=nextStepCreateDocumentButton]').should('be.visible');
    cy.get('[data-testid=nextStepCreateDocumentButton]', { timeout: 15000 }).should('be.enabled');
    cy.get('[data-testid=nextStepCreateDocumentButton]').click();
  },
};
