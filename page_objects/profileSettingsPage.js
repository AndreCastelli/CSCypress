export default {

  verifySettingsPageTitle() {
    cy.get('[data-testid="pageTitle"]').contains('Configurações do perfil');
  },

  clickProfileSettings() {
    cy.get('[data-testid="operatorsLink"]').click();
  },

  clickOperatorAreaLink() {
    cy.get('[data-testid="accountLink"]').first().click();
  },

};
