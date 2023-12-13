export default {

  clickButton(id) {
    cy.get(`[data-testid=${id}]`).click();
  },

  typeInput(id, value) {
    cy.get(`[data-testid=${id}]`).type(value);
  },

  shouldBe(id, should, value, options) {
    cy.get(`[data-testid=${id}]`, options).should(should, value);
  },

  containText(id, text) {
    cy.get(`[data-testid=${id}]`).contains(text);
  },

  checkPageCanceled() {
    cy.contains('Conta cancelada em');
  },

  reactivateAccount() {
    this.clickButton('accountReactivateButton');
  },

  verifyModalReactivateAccount() {
    this.containText('confirmationModal', 'Deseja reativar sua conta?');
  },

  confirmReactivateAccount() {
    this.clickButton('confirmationModalClose');
    this.clickButton('accountReactivateButton');
    this.clickButton('confirmationModalConfirm', { force: true });
  },

  redirectionDashboard() {
    this.containText('documentUploadModalButton', 'Adicionar documentos');
  },

  logoutAccount() {
    this.clickButton('profileMenu');
    this.clickButton('logoutButton');
    cy.wait(500);
  },
};
