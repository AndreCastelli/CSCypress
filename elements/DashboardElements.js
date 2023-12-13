export default {
  dashboardLayout: ['containerable'],
  dashboardLink: ['clickable'],
  sendDocumentButton: ['clickable'],
  downloadSampleLink: ['clickable'],
  sendDocumentModal: ['containerable'],
  helpModal: ['containerable'],
  helpButton: ['clickable'],
  supportButton: ['clickable'],
  salesButton: ['clickable'],
  unreadMessagesLabel: ['containerable'],
  notificationLoaderIcon: ['containerable'],
  notificationModal: ['containerable'],
  documentReports: ['containerable'],
  documentsReportButton: ['clickable'],
  allDocumentsButton: ['clickable'],
  runningDocumentsButton: ['clickable'],
  closedDocumentsButton: ['clickable'],
  canceledDocumentsButton: ['clickable'],
  documentsRefusedCountNotEmpty() {
    cy.get('[data-testid=documentsRefusedCount]').invoke('text').then((text) => {
      expect(text.trim()).to.not.equal('0');
    });
  },
};
