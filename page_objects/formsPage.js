export default {
  clickFormsMenu() {
    cy.get('[data-testid=formsMenuOption]').click();
  },

  accessFormsMenuAndCreateDefaultForm(formName) {
    this.clickFormsMenu();
    this.createForm(formName);
  },

  createForm(formName) {
    cy.get('[data-testid=createFormButton]').click();
    cy.get('[data-testid=formNameField]').clear().type(formName);
    this.clickSaveFormButton();
    // cy.get('[class=link]').click();
  },

  createTwoForms(formName) {
    this.createForm(`${formName}1`);
    this.createForm(`${formName}2`);
  },

  clickSaveFormButton() {
    cy.get('[data-testid=saveFormSettingsButton]').click();
  },

};
