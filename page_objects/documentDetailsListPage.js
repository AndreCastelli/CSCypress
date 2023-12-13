import showDocumentPage from './showDocumentPage';

const date = new Date();
const today = date.getDate();

export default {
  clickButton(id) {
    cy.get(`[data-testid=${id}]`).click();
  },

  clickFirstLink(id) {
    cy.get(`[data-testid=${id}]`).first().click();
  },

  shouldBe(id, should, value, options) {
    cy.get(`[data-testid=${id}]`, options).should(should, value);
  },

  typeInput(id, value) {
    cy.get(`[data-testid=${id}]`).type(value);
  },

  checkText(id, value) {
    cy.get(`[data-testid=${id}]`).contains(value);
  },

  acessdDocumentDetails() {
    this.clickButton('dashboardDetailsLink');
    this.verifyPageTitleIsVisible();
  },

  verifyPageTitleIsVisible() {
    this.shouldBe('pageTitle', 'be.visible');
  },

  checkDocumentDetail(page) {
    switch (page['Valor do detalhe']) {
      case 'Today':

        this.shouldBe('documentContratoPdfItem', 'be.visible');
        this.checkText('documentContratoPdfDate', showDocumentPage.getDateString());
        this.checkText('documentContratoPdfDetail', page.Detalhes);
        break;

      case 'Yesterday':

        this.shouldBe('documentContratoPdfItem', 'be.visible');
        this.checkText('documentContratoPdfDate', showDocumentPage.getDateString(true));
        this.checkText('documentContratoPdfDetail', page.Detalhes);
        this.clickFirstLink('documentContratoPdfLink');
        this.shouldBe('documentDetailsTab', 'be.visible');
        break;
      default:
        cy.log('Verificar o valor do detalhe não corresponde com feature DocumentDetailsList');
    }
  },

  filterDateDetail() {
    this.clickButton('DetailsDateRangeFilterInput');
    showDocumentPage.selectDate(today - 1);
    this.clickButton('filterDetailButton');
  },
};
