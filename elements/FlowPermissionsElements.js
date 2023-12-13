import formEditElements from './FormEditElements';

export default {
  formsMenuOption: ['clickable'],
  flowsMenuOption: ['clickable'],
  createFlowButton: ['clickable'],
  createFormButton: ['clickable'],
  editDropdownButton: ['clickable'],

  createTwoForms(formName) {
    formEditElements.createTwoForms(formName, 'email');
  },

  createFlow(flowNameExample, singerEmail, signerName, formName) {
    formEditElements.createFlow(flowNameExample, singerEmail, signerName, formName);
  },
  clickMemberCheckbox(member) {
    cy.get(`[data-testid=${member}]`).click();
  },

  clickFormFlowPermissionsOption() {
    cy.get('[data-testid=formFlowPrivacyOption]', { timeout: 5000 }).filter(':visible').contains('Permissões').click();
  },
};
