const url = Cypress.config('baseUrl');
const user = Cypress.config('user');
const loginBusiness = Cypress.config('loginBusiness');

export default {

  // autenticando no sistema
  authenticatedLogin() {
    cy.login(url, user.email, user.password);
  },

  loginAccount() {
    cy.login(url, loginBusiness.email, loginBusiness.password);
  },

  clickSubmitLogin() {
    cy.get('[data-testid="submitButton"]').click();
  },

};
