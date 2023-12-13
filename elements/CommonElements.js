export default {
  documentUploadModalButton: ['clickable'],
  attachPDFFile(paths) {
    cy.get('[data-testid=uploadFileDropzone]').attachFile(paths, { subjectType: 'drag-n-drop' });
  },
  documentUpload(filePath, fileName) {
    cy.fixture(filePath, 'binary')
      .then(Cypress.Blob.binaryStringToBlob)
      .then((fileContent) => {
        cy.get('[data-testid=documentFileUploadField]').attachFile({
          fileContent,
          fileName,
          mimeType: '.docx, application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          force: true,
          subjectType: 'input',
        });
        cy.get('[data-testid=documentFileUploadField]').trigger('input', { force: true });
      });
  },
  spreadsheetUpload() {
    cy.fixture('files/planilha.xls', 'binary')
      .then(Cypress.Blob.binaryStringToBlob)
      .then((fileContent) => {
        cy.get('[data-testid=spreadsheetUploadField]').attachFile({
          fileContent,
          fileName: 'planilha.xls',
          mimeType: 'application/vnd.ms-excel',
          encoding: 'utf-8',
          force: true,
          subjectType: 'input',
        });
        cy.get('[data-testid=spreadsheetUploadField]').trigger('input', { force: true });
      });
  },
  spreadsheetUploadError() {
    cy.fixture('files/planilha_erro.xls', 'binary')
      .then(Cypress.Blob.binaryStringToBlob)
      .then((fileContent) => {
        cy.get('[data-testid=spreadsheetUploadField]').attachFile({
          fileContent,
          fileName: 'planilha_erro.xls',
          mimeType: 'application/vnd.ms-excel',
          encoding: 'utf-8',
          force: true,
          subjectType: 'input',
        });
        cy.get('[data-testid=spreadsheetUploadField]').trigger('input', { force: true });
      });
  },
  submitDocumentUploadModal() {
    cy.get('[data-testid=submitDocumentUploadModal]').then((input) => {
      input.attr('disabled', false);
      input.click();
    });
  },
};
