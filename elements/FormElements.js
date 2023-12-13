import { lowerFirst, camelCase } from 'lodash';

export default {
  formsMenuOption: ['clickable'],
  createFormButton: ['clickable'],
  formNameField: ['typeable', 'clearable'],
  submitAnswersButton: ['clickable'],
  searchCepButton: ['clickable'],
  confirmationModalConfirm: ['clickable'],
  selectFields(params) {
    cy.get('li.input-control').contains(params).click();
  },
  selectLinkedField(params) {
    cy.get('button[data-link-label]').contains(params).first().click();
  },
  verifyTitletWithFormCreated(params) {
    cy.get('h5').should('be.visible').and('contain', params);
  },
  clickSaveFormButton() {
    cy.get('span').contains('Salvar').click();
  },
  clickBackFormListButton() {
    cy.get('span').contains('Voltar').click();
  },
  clickPreviewFormButton(formName) {
    const formattedFormName = lowerFirst(camelCase(formName));
    const formPreviewOption = `[data-testid="${formattedFormName}FormPreviewOption"]`;
    cy.get(`[data-testid="${formattedFormName}Options"]`).click();
    cy.get(formPreviewOption).invoke('attr', 'target').should('eq', '_blank');
    cy.get(formPreviewOption).invoke('removeAttr', 'target').click();
  },
  fillWithInvalidData() {
    cy.get(':nth-child(1) > [data-testid="emailInputField"] ').type('poi');
    cy.get('[data-testid=cpfInputField]').type('000');
    cy.get('[data-testid=cnpjInputField]').type('000');
    cy.get('[data-testid=cepInputField]').type('000');
    cy.get('[data-testid=searchCepButton]').click();
    cy.get('[data-testid=phoneInputField]').type('000');
  },
  fillCepWithValidData() {
    cy.intercept('/fluxia/search_addresses?zipcode=12345-123', {
      statusCode: 200,
      body: {
        address: {
          street: 'rua',
          neighborhood: 'bairro',
          city: 'cidade',
          federal_unit: 'al',
          zipcode: '12345123',
        },
      },
    });
    cy.get('[data-testid=cepInputField]').type('12345123');
    cy.get('[data-testid=searchCepButton]').click();
  },
  assertErrorInfoMessage(params) {
    cy.get('.error').contains(params);
  },
  assertInvalidCepMessage() {
    cy.get('[data-testid=invalidCepMessageError').contains('CEP não é válido');
  },
  clickDeleteFormButton(name, option) {
    cy.get(`[data-testid="${camelCase(name)}Options"]`).click();
    cy.get(`[data-testid="${option}Option"]:visible`).click();
  },
  assertModalErrorMessage(message) {
    cy.get('[data-testid="formFlowAlertModal"]').contains(message);
  },
  assertFormDontExists(name) {
    cy.get(`[data-testid="${camelCase(name)}Options"]`).should('not.exist');
  },
};
