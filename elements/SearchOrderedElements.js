export default {
  nodesOrderFieldSelect: ['clickable'],
  selectFieldOrdemAlfabeticaOption: ['clickable'],
  selectFieldEnviadosMaisAntigosOption: ['clickable'],
  selectFieldEnviadosMaisRecentesOption: ['clickable'],
  selectOrderList(text) {
    this.nodesOrderFieldSelect.click();
    cy.get(`[data-testid=selectField${text}Option]`).click();
  },
  checkFirstDocument(text) {
    cy.get('[data-testid=documentsRowList] > li').first().contains(text);
  },
};
