const date = new Date();
const year = date.getFullYear();
const today = date.getDate();
const month = date.getMonth() + 1;

export default {

  clickButton(id) {
    cy.get(`[data-testid=${id}]`).click();
  },

  clickFirstButton(id) {
    cy.get(`[data-testid=${id}]`).first().click();
  },

  checkDownload(id) {
    cy.readFile(`cypress/downloads/${id}`).should('exist');
  },

  getDateString(isYesterday = false) {
    const monthStr = month < 10 ? `0${month}` : `${month}`;
    const newToday = isYesterday ? today - 1 : today;
    const todayStr = newToday < 10 ? `0${newToday}` : `${newToday}`;
    return `${todayStr}-${monthStr}-${year}`;
  },

  typeInput(id, value) {
    cy.get(`[data-testid=${id}]`).type(value);
  },

  clearTypeInput(id) {
    cy.get(`[data-testid=${id}]`).clear();
  },

  shouldBe(id, should, value, options) {
    cy.get(`[data-testid=${id}]`, options).should(should, value);
  },

  containText(id, text) {
    cy.get(`[data-testid=${id}]`).contains(text);
  },

  accessAuditAccount() {
    this.clickButton('reportsLink');
    this.clickButton('reportsLink');
    this.clickButton('accountAuditLink');
  },

  modalAuditAccount() {
    this.containText('blockedFunctionalityModal', 'Upgrade de plano');
    cy.get("[data-testid='blockedFunctionalityModal'] [data-testid='modal-close-icon']").first().click();
  },

  logoutAccount() {
    this.clickButton('profileMenu');
    this.clickButton('logoutButton');
    cy.wait(500);
  },

  downloadAudit() {
    this.clickFirstButton(`accountAudit${this.getDateString(today - 1)}Button`);
  },

  checkDownloadedFile() {
    this.checkDownload(`account-1155${this.formatDateString()}-fa606a4c-ac7d-4ab0-a487-6cfe6e4726ac.csv`);
  },
};
