const url = Cypress.config('baseUrl');

export default {
  openSignerAreaPage() {
    cy.visit(`${url}/signer/dashboard`);
  },
  shouldSignerTerms() {
    cy.url().should('include', '/signer/terms');
  },
  shouldSignerArea() {
    cy.url().should('include', '/signer/dashboard');
  },
  shouldSignerCompletArea() {
    cy.contains('Minha área de assinatura');
    cy.contains('Confira e assine seus documentos aqui');
    cy.contains('Assinável até');
    cy.contains('Ajuda');
  },
  acceptTermsCheckbox() {
    cy.get('[data-testid="signerTermsCheckbox"]').click({ force: true });
  },
  submitTermsButton() {
    cy.get('[data-testid="acceptTermsButton"]').click();
  },
  acceptSignerTerms() {
    this.acceptTermsCheckbox();
    this.submitTermsButton();
  },

  shouldTopBarSignerArea() {
    cy.contains('Minha área de assinatura');
    cy.contains('Beta');
    cy.get('[data-testid="signerAreaLink"]').contains('Documentos para assinar');
    cy.contains('Contas');
  },
};
