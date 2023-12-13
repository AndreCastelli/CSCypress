import { faker } from '@faker-js/faker';

export default {
  clickButton(id) {
    cy.get(`[data-testid=${id}]`).click();
  },

  typeField(datatestid, value) {
    cy.get(`[data-testid=${datatestid}]`).type(value);
  },

  shouldBe(id, should, value, options) {
    cy.get(`[data-testid=${id}]`, options).should(should, value);
  },

  checkText(id, value) {
    cy.get(`[data-testid=${id}]`).contains(value);
  },

  fillAccountInformationsOnboarding() {
    const userFaker = {
      phone: faker.phone.phoneNumber('(99) 99###-####'),
    };
    this.shouldBe('chooseAccountTypeModal', 'be.visible');
    this.shouldBe('accountTypePersonalButton', 'be.visible');
    this.clickButton('accountTypePersonalButton');
    this.clickButton('reasonSelect');
    cy.contains('Sou pessoa desenvolvedora', { timeout: 2000 }).click();
    this.clickButton('segmentSelect');
    cy.contains('Consultoria', { timeout: 2000 }).click();
    this.clickButton('documentsAmountSelect');
    cy.contains('Até 5 documentos', { timeout: 2000 }).click();
    this.typeField('phoneNumberField', userFaker.phone);
    this.clickButton('submitButton');
  },

  fillCredentialsInformationsOnboarding() {
    const dateTime = new Date().getTime();
    const userFaker = {
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      email: faker.internet.email(dateTime),
    };
    cy.visit(`${Cypress.config('baseUrl')}/signup`);
    this.typeField('nameField', userFaker.name);
    this.typeField('emailField', userFaker.email);
    this.typeField('passwordField', 'foobar123');
    this.acceptTermsCheckbox();
    this.shouldBe('submitButton', 'be.enabled');
    cy.wait(5000);
    this.clickButton('submitButton');
    // toggle_new_onboarding_account_default_enabled
    // TODO: Remove 'getToggle' wrapper, conditionals and keep only 'isEnabled' inner code
    cy.getToggle('toggle_new_onboarding_account_default_enabled').then((isEnabled) => {
      if (isEnabled) {
        cy.get('[data-testid="nextStepButton"]').click();
        cy.get('[data-testid="testOperatorAccountButton"]').click();
      }
    });
  },

  acceptTermsCheckbox() {
    cy.get('[data-testid=x-checkbox-input]').click({ force: true });
  },

  verifyAccountInformationsOnboardingModal() {
    this.shouldBe('onboardingModal', 'be.visible');
    cy.url().should('include', '/onboarding/account/new');
  },
};
