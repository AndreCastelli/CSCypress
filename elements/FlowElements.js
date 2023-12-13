import { camelCase } from 'lodash';

export default {
  sectionTitle: ['containerable'],
  flowName: [],
  createFlowButton: ['clickable'],
  flowsMenuOption: ['clickable'],
  nameField: ['typeable', 'clearable'],
  nextStepButton: ['clickable'],
  modalNextStepButton: ['clickable'],
  templateOptionModal: ['clickable'],
  secondFormOptionModal: ['clickable'],
  templateOptionRadio: ['clickable'],
  emailField: ['typeable'],
  messageField: ['typeable'],
  answersCheckbox: ['checkable'],
  secondFormNextButton: ['clickable'],
  documentNameField: ['typeable'],
  folderNameField: ['typeable'],
  addSignerButton: ['clickable'],
  settingNextStepButton: ['clickable'],
  messageNextStepButton: ['clickable'],
  activeNextStepButton: ['clickable'],
  closeButton: ['clickable'],
  modalTitle: ['containerable'],
  signerUnutilizedAlertDescription: ['containerable'],
  availableSignersText: ['containerable'],
  availableFieldsText: ['containerable'],
  skipAddSignerFormButton: ['clickable', 'containerable'],
  addSignerFormButtonModal: ['clickable', 'containerable'],
  signerByFormOption: ['selectable'],
  signerSignAsSelect: ['selectable', 'clickable'],
  addSignerByFormButton: ['clickable'],
  signerListInfo: ['default'],
  clickForm(formName) {
    cy.get(`[data-testid="${camelCase(formName)}FormOption"]`, { timeout: 15000 }).filter(':visible').click();
  },
  clickTemplateOption(templateName) {
    cy.get(`[data-testid="${camelCase(templateName)}TemplateOption"]`, { timeout: 30000 }).click();
  },
  selectDataByFirstForm(index, params) {
    cy.get(`[data-testid=dataFieldSelect${index}]`, { timeout: 15000 }).select(params);
  },
  verifyTitletWithFlowCreated(flowName) {
    cy.get('[data-testid=flowName]', { timeout: 30000 }).should('be.visible').and('contain', flowName);
  },
  accessFlowFormPage() {
    cy.get('[data-testid=urlFlowForm]').then((a) => {
      const href = a.prop('innerText').trim();
      cy.visit(href);
    });
  },
  clickCopyLink(flowName) {
    cy.get(`[data-testid="${camelCase(flowName)}FlowCard"]:first [data-testid=copyLinkButton]`).click();
  },
  clickFormOptions(flowName) {
    cy.get(`[data-testid=flowForm${flowName}OptionsButton`, { timeout: 5000 }).click();
  },
  clickFlowFormOption(flowName, option) {
    cy.get(`[data-testid=${option}Option`, { timeout: 5000 }).filter(':visible').contains(option).click();
  },
  clickFlowDisableOption() {
    cy.get('[data-testid=formFlowDisableOption]', { timeout: 5000 }).filter(':visible').contains('Desativar').click();
  },
  clickFlowDeleteOption() {
    cy.get('[data-testid=formFlowDeleteOption]', { timeout: 5000 }).filter(':visible').contains('Excluir').click();
  },
  seeWarning(message) {
    cy.contains(message);
  },
  clickOptionModal(option) {
    cy.get(`[data-testid="modal${option}ButtonSubmit"]`, { timeout: 5000 }).click();
  },
  verifyPageFlow() {
    cy.get('[data-testid=createFlowButton]', { timeout: 30000 }).should('be.visible');
  },
  clickNextStepButton() {
    cy.get('[data-testid=nextStepButton]', { timeout: 5000 }).filter(':visible').click();
  },
};
