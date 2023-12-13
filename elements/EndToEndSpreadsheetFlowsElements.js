import { camelCase } from 'lodash';

export default {
  flowName: [],
  spreadsheetFlowsMenuOption: ['clickable'],
  nameField: ['typeable', 'clearable'],
  nextStepButton: ['clickable'],
  folderNameField: ['typeable'],
  documentNameField: ['typeable'],
  SendFileButton: ['clickable'],
  newSignerFromSpreadsheetButton: ['clickable'],
  signerSignAsFieldSelect: ['selectable'],
  descriptionInput: ['typeable'],
  sendMessageTemplateButton: ['clickable'],
  signerError: ['containerable'],
  openFileSelection: ['clickable'],
  clickForm(formName) {
    cy.get(`[data-testid="${camelCase(formName)}FormOption"]`, { timeout: 15000 }).click();
  },
  clickTemplateOption(templateName) {
    cy.get(`[data-testid="${camelCase(templateName)}TemplateOption"]`, { timeout: 30000 }).click();
  },
  selectDataByFirstForm(index, params) {
    cy.get(`[data-testid=dataFieldSelect${index}]`, { timeout: 15000 }).select(params);
  },
  verifyTitletWithFlowCreated(params) {
    cy.get('[data-testid=flowName]', { timeout: 30000 }).should('be.visible').and('contain', params);
  },
  accessFlowFormPage(flowName) {
    cy.get(`[data-testid="${camelCase(flowName)}"] > [data-testid=copyLinkFormModal] [data-testid=urlFlowForm]`).then((a) => {
      const href = a.prop('href');
      cy.visit(href);
    });
  },
  clickCopyLink(flowName) {
    cy.get(`[data-testid="${camelCase(flowName)}"]:first > .actions > [data-testid=copyLinkButton]`).click();
  },
};
