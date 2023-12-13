import { faker } from '@faker-js/faker';
import LoginPage from './LoginPage';

const { email, password } = Cypress.config('loginBusiness');

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

  acceptTermsCheckbox() {
    cy.get('[data-testid=x-checkbox-input]').click({ force: true });
  },

  containText(id, text) {
    cy.get(`[data-testid=${id}]`).contains(text);
  },

  loginAccountBusiness() {
    LoginPage.loginAccount(email, password);
  },

  accessPayments() {
    this.clickButton('configurationMenuOption');
    cy.wait(500);
    this.clickButton('accountPaymentsTab');
    cy.wait(500);
  },

  clickRequestCancellation() {
    this.clickButton('cancelAccountLink');
  },

  reasonsOptions() {
    this.clickButton('cancellationReasonSelect');
    this.clickButton('selectFieldOsPlanosNaoAtendemMinhaDemandaOption');
  },

  clickConfirmCancellation() {
    this.clickButton('cancelAccountButton');
    cy.wait(500);
  },

  verifyConfirmModalCancellation() {
    this.containText('accountCancelModal', 'Tem certeza que deseja cancelar a conta?');
    cy.wait(400);
  },

  acceptTermsCancellationInModal() {
    this.clickButton('modalCheckbox');
    this.clickButton('modalConfirmButton');
  },

  verifyCancellationAccount() {
    cy.contains('Conta cancelada');
  },

  loginTrial() {
    const dateTime = new Date().getTime();
    const userFaker = {
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      email: faker.internet.email(dateTime),
    };
    cy.visit(`${Cypress.config('baseUrl')}/signup`);
    this.typeInput('nameField', userFaker.name);
    this.typeInput('emailField', userFaker.email);
    this.typeInput('passwordField', 'foobar123');
    this.acceptTermsCheckbox();
    this.shouldBe('submitButton', 'be.enabled', { force: true });
    cy.wait(5000);
    this.clickButton('submitButton');
    this.clickButton('accountTypePersonalButton');
    this.clickButton('reasonSelect');
    cy.contains('Sou pessoa desenvolvedora', { timeout: 2000 }).click();
    this.clickButton('segmentSelect');
    cy.contains('Consultoria', { timeout: 2000 }).click();
    this.clickButton('documentsAmountSelect');
    cy.contains('Até 5 documentos', { timeout: 2000 }).click();
    this.clickButton('submitButton');
    cy.contains('Reenviar', { timeout: 2000 });
    this.clickButton('resendBtn');
  },
};
