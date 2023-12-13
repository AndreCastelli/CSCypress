import { camelCase } from 'lodash';

const filters = {
  Status: 'status',
  Assunto: 'kind',
  'E-mail do signatário': 'recipient',
};
const filtersOptions = {
  Status: {
    'Processando envio': 'processing',
    Enviado: 'delivery',
    Spam: 'spam',
    'Não recebido': 'bounce',
  },
  Assunto: {
    'Assinar documento': 'signatureRequest',
    Token: 'token',
    'Documento cancelado': 'documentCanceled',
    'Preencher formulário': 'secondForm',
    'Documento assinado': 'signedDocument',
    'Prazo para expirar': 'expiring',
    'Comprovante de assinatura': 'receipt',
  },
};

export default {
  trackingStatusList: ['default'],
  trackingRecipientList: ['default'],
  trackingKindList: ['default'],
  trackingMenuOption: ['clickable'],
  trackingEmailFilterSubmitBtn: ['clickable'],
  trackingEmailInputFilter: ['typeable'],
  trackingDropdownFiltersBtn: ['clickable'],
  trackingFilterClean: ['clickable'],
  trackingFilterApplyButton: ['clickable'],
  handleFilterMenu(option, filter) {
    const optionDataTestId = camelCase(
      `${filters[filter]} select ${filtersOptions[filter][option]} option`,
    );
    cy.get('[data-testid="trackingDropdownFiltersBtn"]', { timeout: 15000 }).click();
    cy.get(`[data-testid="${filters[filter]}Select"]`).click();
    cy.get(`[data-testid="${optionDataTestId}"]`).click();
    cy.get(`[data-testid="${filters[filter]}Select"]`).click();
    cy.get('[data-testid="trackingFilterApplyButton"]').click();
  },
  checkFilteredTableText(column, text) {
    const columnDataTestId = camelCase(`tracking ${filters[column]}List`);
    cy.get(`[data-testid="${columnDataTestId}"]`, { timeout: 15000 })
      .each(($el) => {
        cy.wrap($el).contains(text);
      });
  },
};
