export default {
  formsMenuOption: ['clickable'],
  createFormButton: ['clickable'],
  formNameField: ['typeable'],
  saveFormSettingsButton: ['typeable'],

  createForm(formName) {
    cy.get('[data-testid=formNameField]', { timeout: 2000 }).type(formName);
    cy.get('[data-type=email]', { timeout: 2000 }).click();
    cy.get('[data-testid=saveFormSettingsButton]', { timeout: 2000 }).click();
  },
};
