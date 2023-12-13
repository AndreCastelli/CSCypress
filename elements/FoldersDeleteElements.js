export default {
  nodesActionsDropdown: ['clickable'],
  cancelDocumentButton: ['clickable'],
  cancelDocumentCheckbox: ['clickable'],
  cancelDocumentModalButton: ['clickable'],
  nodesBreadcrumbPreviousLink: ['clickable'],
  nodeFolderLink(folderName) {
    cy.get(`[data-testid=nodeFolder${folderName}Link]`).click();
  },
  getDocumentLinkTestId() {
    cy.get('[data-testid=runningDocumentLink] > [data-testid=nodeDocumentLink]').first().click();
  },
  nodeFolderCanceladosCheckbox(id) {
    cy.get(`[data-testid=nodeFolderCancelados${id}Checkbox]`).click();
  },
  nodeFolderConcluidosCheckbox(id) {
    cy.get(`[data-testid=nodeFolderConcluidos${id}Checkbox]`).click();
  },
  nodeFolderAguardandoCheckbox(id) {
    cy.get(`[data-testid=nodeFolderAguardando${id}Checkbox]`).click();
  },
  nodeFolderEmProcessoCheckbox(id) {
    cy.get(`[data-testid=nodeFolderEmProcesso${id}Checkbox]`).click();
  },
  deleteSelectedFolder() {
    this.nodesActionsDropdown.click();
    cy.get('[data-testid=nodeActionDeleteOption]').click();
  },
  deleteDocumentButtonModal() {
    cy.get('[data-testid=deleteDocumentButtonModal]').click();
  },
  cancelDocumentFolderAguardando(id) {
    this.nodeFolderLink(`Aguardando${id}`);
    this.getDocumentLinkTestId();
    this.cancelDocumentButton.click();
    this.cancelDocumentCheckbox.click();
    this.cancelDocumentModalButton.click();
  },
  accessDocumentsListUrl() {
    const url = window.location.href.toString();
    const urlDocumentsList = url.replace('dashboard', 'folders/1');
    cy.visit(urlDocumentsList);
  },
  // TODO: Replace 'previousFolderLink' method to 'nodesListPreviousLink' element
  previousFolderLink() {
    cy.get('[data-testid=previousPath] a').click();
  },
};
