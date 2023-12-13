import { faker } from '@faker-js/faker';

export default {
  signinModal: ['containerable'],
  emailField: ['typeable', 'clearable'],
  passwordField: ['typeable', 'clearable'],
  submitButton: ['clickable'],
  forgotPasswordLink: ['clickable'],
  signupLink: ['clickable'],
  loginMicrosoftButton: ['clickable'],
  getUserName() {
    return `${faker.name.firstName()} ${faker.name.lastName()}`;
  },
  getUserEmail() {
    return faker.internet.email();
  },
  verifyOAuth2ButtonExist(buttonName) {
    cy.get(`[data-testid=login${buttonName}Button]`).should('be.visible');
    cy.get(`[data-testid=login${buttonName}Button]`).contains(buttonName);
  },
};
