export default {
  addSignerWithAddictionalAuth(addictional) {
    cy.get('[data-testid=signerAuthField]').select('Enviar token por E-mail');
    cy.get('[data-testid=signerEmailField]').click().type('clicksigncypress@gmail.com');
    cy.get('[data-testid=signerNameField').type('John Example');
    cy.get('[data-testid=signerHasNotDocumentationField').check({ force: true });
    cy.get('[data-testid=additionalAuthsSelect]:first').click();
    switch (addictional) {
      case addictional.includes('Selfie'):
        cy.get('[data-testid=selfieRequiredOption]:first').click();
        break;
      case addictional.includes('Assinatura manuscrita'):
        cy.get('[data-testid=handwrittenRequiredOption]:first').click();
        break;
      case addictional.includes('Documento oficial'):
        cy.get('[data-testid=handwrittenRequiredOption]:first').click();
        break;
      case addictional.includes('Reconhecimento facial'):
        cy.get('[data-testid=livenessRequiredOption]:first').click();
        break;
      default:
    }
  },
};
