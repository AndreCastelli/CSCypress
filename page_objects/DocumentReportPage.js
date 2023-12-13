import accountsPage from './accountsPage';

export default {
  clickReportsLinkMenu() {
    cy.get('[data-testid=reportsLink]').click();
  },
  clickDocumentReportLink() {
    cy.get('[data-testid=documentReportLink]').click();
  },
  getColumnByText(column) {
    return cy.get('[data-testid=reportTable] .tabulator-header')
      .contains(column, { matchCase: false });
  },
  goDocumentsReportPage() {
    accountsPage.authenticatorAndAcessOperatorArea();
    this.clickReportsLinkMenu();
    this.clickDocumentReportLink();
  },
  columnIsVisible(column) {
    this.getColumnByText(column)
      .should('be.visible');
  },
};
