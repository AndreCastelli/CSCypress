export default {
  nameField: ['typeable', 'clearable'],
  configurationMenuOption: ['clickable'],
  submitButton: ['clickable'],
  editOperatorButton: ['clickable'],
  changeSenderButton: ['clickable'],
  cancelButton: ['clickable'],
  confirmSaveButton: ['clickable'],
  cnpjField: ['typeable', 'clearable'],
  cpfField: ['typeable', 'clearable'],
  tradingNameField: ['typeable', 'clearable'],
  emailField: ['typeable', 'clearable'],
  phoneNumberField: ['typeable', 'clearable'],
  whatsappField: ['typeable', 'clearable'],
  employeesAmountSelect: ['clickable'],
  segmentSelect: ['clickable'],
  entityTypeWarnModal: ['containerable'],
  settingsContainerModal: ['containerable'],
  fillConfigurationData(params) {
    if (params['Nome da empresa']) cy.get('[data-testid=nameField]').clear({ force: true }).first().type(params['Nome da empresa'], { force: true });
    if (params['Número de funcionários']) {
      cy.get('[data-testid=employeesAmountSelect]').click({ force: true });
      cy.contains(params['Número de funcionários'], { timeout: 2000 }).click({ force: true });
    }
    if (params.CNPJ) cy.get('[data-testid=cnpjField]').clear({ force: true }).first().type(params.CNPJ, { force: true });
    if (params['Razão social']) cy.get('[data-testid=tradingNameField]').clear({ force: true }).first().type(params['Razão social'], { force: true });
    if (params['Segmento de atuação']) {
      cy.get('[data-testid=segmentSelect]').click({ force: true });
      cy.contains(params['Segmento de atuação'], { timeout: 2000 }).click({ force: true });
    }
    if (params.Email) cy.get('[data-testid=emailField]').clear({ force: true }).first().type(params.Email, { force: true });
    if (params.Telefone) cy.get('[data-testid=phoneNumberField]').clear({ force: true }).first().type(params.Telefone, { force: true });
    if (params.WhatsApp) cy.get('[data-testid=whatsappField]').clear({ force: true }).first().type(params.WhatsApp, { force: true });
  },
};
