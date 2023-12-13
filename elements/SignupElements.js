import { faker } from '@faker-js/faker';

export default {
  nameField: ['typeable', 'clearable'],
  emailField: ['typeable', 'clearable'],
  passwordField: ['typeable', 'clearable'],
  submitButton: ['clickable'],
  signupModal: ['containerable'],
  getUserName() {
    return `${faker.name.firstName()} ${faker.name.lastName()}`;
  },
  getUserEmail() {
    return faker.internet.email();
  },
  acceptTermsCheckbox() {
    cy.get('[data-testid=acceptTermsCheckbox]').click({ force: true });
  },
  verifyOAuth2ButtonExist(buttonName) {
    cy.get(`[data-testid=login${buttonName}Button]`).should('be.visible');
    cy.get(`[data-testid=login${buttonName}Button]`).contains(buttonName);
  },
  visitLink(inbox, url) {
    cy.getLastEmail(inbox).then((email) => {
      const link = email.Content.Body.match(/href=3D"([^"]*)/)[1];
      cy.request({
        method: 'get',
        url: link,
        failOnStatusCode: false,
      }).then((resp) => {
        expect(resp.status).to.eq(410);
      });
      cy.visit(`${url}/onboarding/account/new`);
    });
  },
};
