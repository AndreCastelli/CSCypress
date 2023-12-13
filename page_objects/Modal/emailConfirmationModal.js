export default {
  shouldBe(id, should, value, options) {
    cy.get(`[data-testid=${id}]`, options).should(should, value);
  },

  resendEmail() {
    cy.get('[data-testid=emailValidationModal] [data-testid=resendBtn]').click();
  },

  veritySucessResendEmailMessage() {
    cy.contains('Email reenviado com sucesso');
  },

  clearEmail() {
    cy.get('[data-testid=emailValidationModal] [data-testid=emailInput]').type('teste').clear().blur();
    cy.get('[data-testid=emailValidationModal] [data-testid=emailInput]').invoke('val').should('eq', '');
  },

  typeEmail(text) {
    cy.get('[data-testid=emailValidationModal] [data-testid=emailInput]').type(text);
  },

  verifyRequiredFieldMessage() {
    cy.contains(/O campo é obrigatório|O valor é obrigatório/g);
  },

  verifyInvalidEmailMessage() {
    cy.contains('Informe um e-mail válido');
  },

  verifyEmailValidationModalIsVisible() {
    this.shouldBe('emailValidationModal', 'be.visible');
  },

};
