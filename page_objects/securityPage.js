export default {
  typeField(datatestid, value) {
    cy.get(`[data-testid=${datatestid}]`).clear();
    cy.get(`[data-testid=${datatestid}]`).type(value);
  },

  shouldBe(id, should, value, options) {
    cy.get(`[data-testid=${id}]`, options).should(should, value);
  },

  checkText(text) {
    cy.contains(text, { timeout: 30000 });
  },

  dontCheckText(text) {
    cy.contains(text, { timeout: 30000 }).should('not.exist');
  },

  accessSecurityConfiguration() {
    this.shouldBe('securityTab', 'be.visible');
    cy.contains('Segurança', { timeout: 2000 }).click({ force: true });
  },

  uploadFile(text) {
    if (text === 'inválido') {
      const filePath = 'files/contrato.pdf';
      const fileName = 'contrato.pdf';
      cy.fixture(filePath, 'binary')
        .then(Cypress.Blob.binaryStringToBlob)
        .then((fileContent) => {
          cy.get('[data-testid=fileInput]').attachFile({
            fileContent,
            fileName,
            force: true,
            subjectType: 'input',
          });
          cy.get('[data-testid=fileInput]').trigger('input', { force: true });
        });
    } else {
      const filePath = 'files/saml_test.xml';
      const fileName = 'saml_test.xml';
      cy.fixture(filePath, 'binary')
        .then(Cypress.Blob.binaryStringToBlob)
        .then((fileContent) => {
          cy.get('[data-testid=fileInput]').attachFile({
            fileContent,
            fileName,
            encoding: 'utf-8',
            mimeType: 'text/xml',
            force: true,
            subjectType: 'input',
          });
          cy.get('[data-testid=fileInput]').trigger('input', { force: true });
        });
    }
  },

  verifyNewAttributeStatus(status) {
    this.shouldBe('addSamlAttributeButton', 'be.visible');
    const buttonState = status ? 'be.enabled' : 'be.disabled';
    this.shouldBe('addSamlAttributeButton', buttonState);
  },

  addAttributeClick() {
    this.shouldBe('addSamlAttributeButton', 'be.visible');
    cy.contains('Adicionar novo atributo', { timeout: 2000 }).click({ force: true });
  },

  removeAttributeClick() {
    cy.contains('Remover', { timeout: 2000 }).click({ force: true });
  },

  saveClick() {
    cy.contains('Salvar', { timeout: 4000 }).click({ force: true });
  },

  verifyNewSamlAttributeGroup() {
    this.shouldBe('samlAttributeGroup', 'be.visible');
  },
};
