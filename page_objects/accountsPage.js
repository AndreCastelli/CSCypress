const url = Cypress.config('baseUrl');
const user = Cypress.config('user');

export default {

  shouldAccountsSignerVisible() {
    cy.contains('Área de assinatura');
    cy.get('[data-testid="signerAreaLink"]').should('be.visible');
  },

  shouldAccountsSignerNotVisible() {
    cy.contains('Área de assinatura').should('not.exist');
    cy.get('[data-testid="signerAreaLink"]').should(('not.exist'));
  },
  clickLinkSignerArea() {
    // toggle_onboarding_new_account_enabled
    // TODO: Remove 'getToggle' wrapper, conditionals and keep only 'isEnabled' inner code
    cy.getToggle('toggle_onboarding_new_account_enabled').then((isEnabled) => {
      if (isEnabled) {
        cy.get('[data-testid="accessSignerAreabutton"]').click();
      } else {
        cy.get('[data-testid="signerAreaLink"]').click();
      }
    });
  },

  clickAccountsOperator() {
    cy.window().then((win) => {
      if (win.location.href === `${url}/accounts`) {
        // TOGGLE_ONBOARDING_NEW_ACCOUNT_ENABLED
        // TODO: Remove 'getToggle' wrapper, conditionals and keep only 'isEnabled' inner code
        cy.getToggle('toggle_onboarding_new_account_enabled').then((isEnabled) => {
          if (isEnabled) {
            cy.get('[data-testid="accountLink"]').last().click();
          } else {
            cy.get('[data-testid="accountLink"]').first().click();
          }
        });
      }
    });
  },

  authenticatorAndAcessOperatorArea() {
    cy.login(url, user.email, user.password).then(() => {
      this.clickAccountsOperator();
    });
  },
};
