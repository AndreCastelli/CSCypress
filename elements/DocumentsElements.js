import Page from '../page_objects/Page';
import FolderElements from './FolderElements';
import accountsPage from '../page_objects/accountsPage';

const folderPage = new Page(FolderElements);
const rootFolderCanceled = 'AutomationDocumentCanceled';
const rootFolderRunning = 'AutomationDocumentRunning';
const rootFolderFinished = 'AutomationDocumentFinished';

const getDocumentsByType = (type) => cy.get('[data-testid=nodeDocumentContratoPdfItem]').contains(type);
// const baseUrl = Cypress.config('baseUrl');

export default {
  deleteDocumentButtonModal: ['clickable'],
  nodesActionsDropdown: ['clickable'],
  nodeActionDeleteOption: ['clickable'],
  cancelDocumentButton: ['clickable'],
  cancelDocumentCheckbox: ['clickable'],
  cancelDocumentModalButton: ['clickable'],
  documentsLink: ['clickable'],
  runningDocumentsLink: ['clickable'],
  finishedDocumentsLink: ['clickable'],
  canceledDocumentsLink: ['clickable'],
  downloadsLink: ['clickable'],
  dropdownOptions: ['clickable', 'default'],
  pageTitle: ['shouldable', 'containerable'],
  nodeDownloadModal: ['shouldable'],
  downloadOriginalOption: ['shouldable'],
  downloadSignedOption: ['shouldable'],
  downloadOriginalandSignedOption: ['shouldable'],
  closeButton: ['clickable'],
  nodeFolderDownloadTestLink: ['clickable'],
  nodeFolderDownloadTestCheckbox: ['clickable', 'shouldable'],
  nodeActionDownloadOption: ['clickable', 'shouldable', 'containerable'],
  downloadOption: ['clickable'],
  acessPageDocument(namePage) {
    const urls = {
      'Em processo': this.runningDocumentsLink,
      Finalizados: this.finishedDocumentsLink,
      Cancelados: this.canceledDocumentsLink,
    };
    urls[namePage].click();
  },
  baixarMoreOption: ['clickable', 'containerable'],
  runningDocument() {
    cy.intercept('GET', '**/accounts/*/folders/*').as('ListRunningDocument');
    cy.wait('@ListRunningDocument', { requestTimeout: 10000 });
  },
  downloadDocument() {
    this.nodesActionsDropdown.click();
    cy.get('[data-testid=nodeActionDownloadOption]').click({ force: true, waitForAnimations: false, timeout: 6000 });
  },
  deleteDocument() {
    this.nodesActionsDropdown.click();
    this.nodeActionDeleteOption.click();
  },
  closedDocument() {
    cy.intercept('GET', '**/accounts/*/folders/*').as('ListClosedDocument');
    cy.wait('@ListClosedDocument', { requestTimeout: 10000 });
    cy.get('[data-testid=paginationActualPage]').last().click();
    cy.get('[data-status=closed]').first().click();
  },
  canceledDocument() {
    cy.intercept('GET', '**/accounts/*/folders/*').as('ListcanceledDocument');
    cy.wait('@ListcanceledDocument', { requestTimeout: 10000 });
    cy.get('[data-status=canceled]').first().click();
  },
  getDocumentLinkTestId() {
    cy.get('[data-testid=runningDocumentLink]').first().click();
  },
  documentLinkTestId() {
    cy.get('[data-testid=runningDocumentLink] > [data-testid=nodeDocumentLink]').first().click();
  },
  nodeDocumentContratoPdfCheckbox() {
    cy.get('[data-testid=nodeDocumentContratoPdfCheckbox]').first().click();
  },
  canceledDocumentInFolder(folderName) {
    this.assertTitleInPage();
    folderPage.nodeFolderLink(folderName);
    this.documentLinkTestId();
    this.cancelDocumentButton.click();
    this.cancelDocumentCheckbox.click();
    this.cancelDocumentModalButton.click();
  },
  verifyStatusDocumentAndDelete(statusDocument, id) {
    this.assertTitleInPage();
    let newFolderName;
    switch (statusDocument) {
      case 'Em processo':
        newFolderName = rootFolderRunning + id;
        this.canceledDocumentInFolder(newFolderName);
        this.documentsLink.click();
        break;
      case 'Cancelado':
        newFolderName = rootFolderCanceled + id;
        break;
      case 'Finalizado':
        newFolderName = rootFolderFinished + id;
        break;
      default:
        cy.log(`O parâmetro ${statusDocument} é invalido!`);
    }
    this.assertTitleInPage();
    folderPage.deleteFolder(newFolderName);
  },
  deleteDocumentInFolder() {
    this.nodeDocumentContratoPdfCheckbox();
    this.deleteDocument();
    this.deleteDocumentButtonModal.click();
    cy.contains('Item movido para lixeira com sucesso', { timeout: 30000 });
  },
  assertTitleInPage() {
    cy.get('[data-testid=pageTitle]', { timeout: 20000 }).should('be.visible');
  },
  validateDocumentList(statusDocument) {
    const types = {
      Cancelados: () => {
        this.notExistRunningDocuments();
        this.notExistClosedDocuments();
      },
      Finalizados: () => {
        this.notExistCanceledDocuments();
        this.notExistRunningDocuments();
      },
      'Em processo': () => {
        this.notExistCanceledDocuments();
        this.notExistClosedDocuments();
      },
    };
    types[statusDocument]();
  },
  selectADocument(name) {
    cy.get(`[data-testid=nodeDocument${name}Checkbox]`, { timeout: 20000 }).first().click();
  },
  notExistCanceledDocuments: () => getDocumentsByType('Cancelado').should('not.exist'),
  notExistClosedDocuments: () => getDocumentsByType('Finalizado').should('not.exist'),
  notExistRunningDocuments: () => getDocumentsByType('Em processo').should('not.exist'),
  selectOrAccessFolder(action = 'select') {
    accountsPage.authenticatorAndAcessOperatorArea();
    // cy.visit(baseUrl);
    this.documentsLink.click();
    this.pageTitle.should('be.visible');
    this.pageTitle.contains('Documentos');
    if (action === 'acesso') {
      this.nodeFolderDownloadTestLink.click({ timeout: 10000 });
    } else {
      this.nodeFolderDownloadTestCheckbox.click();
    }
  },
  clickOnFirstContratoDocument() {
    cy.get('[data-testid=nodeDocumentContratoPdfCheckbox]', { timeout: 10000 }).first().click();
  },
  clickMoreOptions(typeDocumentOrFolder, nameDocumentOrFolder) {
    cy.get(`[data-testid=node${typeDocumentOrFolder}${nameDocumentOrFolder}MoreOptions]`, { timeout: 10000 }).first().click();
  },
  clickClosedDocumentMoreOptions(nameDocument) {
    cy.get(`[data-testid=nodeDocument${nameDocument}MoreOptions][data-status=closed]`, { timeout: 10000 }).first().click();
  },
  selectADocumentWithStatus(documentName, documentStatus) {
    cy.get(`[data-status=${documentStatus}] [data-testid=nodeDocument${documentName}Checkbox]`, { timeout: 10000 }).first().click();
  },
  downloadsOptionsDropdown(option) {
    return cy.get(`[data-testid=${option}MoreOptionDownloadButton]`, { timeout: 10000 });
  },
};
