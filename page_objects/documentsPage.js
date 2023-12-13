import {
  find, capitalize, camelCase, upperFirst,
} from 'lodash';
import { arrayToObject } from '../../utils/util';
import accountsPage from './accountsPage';

// const url = Cypress.config('baseUrl');

export default {
  clickButton(id, options) {
    cy.get(`[data-testid=${id}]`).click(options);
  },

  clickOption(id) {
    cy.get(`[data-testid=${id}${'Option'}]`).click();
  },

  shouldBe(id, should, value, options = {}) {
    cy.get(`[data-testid=${id}]`, { ...options, timeout: 30000 }).should(should, value);
  },

  clickDocumentsLinkMenu() {
    this.clickButton('documentsLink');
  },

  clickFinishedDocumentsLinkMenu() {
    this.clickButton('finishedDocumentsLink');
  },

  clickRunningDocumentsLinkMenu() {
    this.clickButton('runningDocumentsLink');
  },

  clickCanceledDocumentsLinkMenu() {
    this.clickButton('canceledDocumentsLink');
  },

  verifyPageTitleIsVisible() {
    this.shouldBe('pageTitle', 'be.visible');
  },

  verifyRunningDocumentLinkIsVisible() {
    cy.get('[data-testid="runningDocumentsLink"]').should('be.visible', { timeout: 6000 });
  },

  verifyRunningDocumentsListIsVisible() {
    cy.get('[data-testid="documentsRowList"]').should('be.visible', { timeout: 6000 });
  },

  clickCreateNewDocumentButton() {
    this.clickButton('documentUploadModalButton');
  },

  goDocumentsPage() {
    accountsPage.authenticatorAndAcessOperatorArea();
    this.clickDocumentsLinkMenu();
    this.verifyPageTitleIsVisible();
  },

  verifyDocumentStatusList(page) {
    // cy.visit(url);
    this.accessDocumentStatusPage(page['Status do documento']);
    this.clickLatestDocument();
    cy.contains(page['Nome do documento']);
  },

  accessDocumentStatusPage(status) {
    switch (status) {
      default:
        this.clickDocumentsLinkMenu();
        break;
      case 'Finalizados':
        this.clickFinishedDocumentsLinkMenu();
        break;
      case 'Em processo':
        this.clickRunningDocumentsLinkMenu();
        break;
      case 'Cancelados':
        this.clickCanceledDocumentsLinkMenu();
        break;
    }
  },

  clickLatestDocument() {
    // TOGGLE_NODES_LIST_REFACTOR_ENABLED
    // TODO: Remove 'getToggle' wrapper, conditionals and keep only 'isEnabled' inner code
    cy.getToggle('toggleNodesListRefactorEnabled').then((isEnabled) => {
      if (isEnabled) {
        cy.get('[data-testid=nodesOrderFieldSelect]').click();
        cy.get('[data-testid=selectFieldEnviadosMaisRecentesOption]').click();
      }
    });
    cy.get('[data-testid=nodeDocumentLink]').first().click();
  },

  openShowDocument(documentName) {
    cy.wait(3000);
    cy.get('[data-testid=nodeDocumentLink]').first().contains(documentName);
    cy.get('[data-testid=nodeDocumentLink]').first().click();
  },

  checkDocumentsInList(quant) {
    cy.get('[data-testid=nodeDocumentContratoPdfItem]').should('have.length', quant);
  },

  containFolderOrDocument(params, collection, isFolder = true) {
    const page = arrayToObject(params.rawTable);
    Object.keys(page).forEach((item) => {
      const name = this.collectItemRealName(collection, item, isFolder);
      cy.contains(name);
    });
  },

  collectItemRealName(collection, name, isFolder = true) {
    if (isFolder) {
      const objFolder = find(collection, (item) => item.folder.includes(name));
      return objFolder ? objFolder.folder : name;
    }
    const objFolder = find(collection, (item) => item.file.includes(name));
    return objFolder ? objFolder.file : name;
  },

  selectNodeFolder(folderName) {
    cy.get(`[data-testid="${camelCase(`nodeFolder_${folderName}`)}Checkbox"]`, {
      timeout: 5000,
    }).click();
  },

  selectNodeDocument(documentName) {
    cy.get(`[data-testid="${camelCase(`nodeDocument_${documentName}Checkbox`)}"]`, {
      timeout: 5000,
    }).click();
  },

  clickNodesHeaderDropdownAction(kind) {
    const actions = {
      download: 'Download',
      rename: 'Renomear',
      move: 'Mover',
      delete: 'Excluir',
      hardDelete: 'Excluir definitivamente',
    };

    if (actions[kind]) {
      const testId = `nodeAction${capitalize(kind)}Option`;
      this.clickButton('nodesActionsDropdown');
      cy.get(`[data-testid=${testId}]`).contains(actions[kind]);
      this.clickButton(testId);
    } else {
      cy.log('Opção não encontrada');
    }
  },

  selectNodeFolderToMove(nodeName) {
    cy.get(`[data-testid="${camelCase(`nodeFolder_${nodeName}`)}Label"]`, {
      timeout: 5000,
    }).click();
  },

  submitMoveItem() {
    // TOGGLE_NODES_LIST_REFACTOR_ENABLED
    // TODO: Remove 'getToggle' wrapper, conditionals and keep only 'isEnabled' inner code
    cy.getToggle('toggleNodesListRefactorEnabled').then((isEnabled) => {
      if (isEnabled) this.clickButton('submitSelectedFolderButton');
      else this.clickButton('submitMoveNodesButton');
    });
  },

  shouldDocumentsPageVisible() {
    cy.contains('Documentos');
  },

  markFolderCheckbox(folderName) {
    const testid = upperFirst(camelCase(folderName));
    cy.get(`[data-testid="nodeFolder${testid}Checkbox"]`, { timeout: 15000 })
      .first()
      .click({ force: true });
  },

  isFormFolderModalVisible() {
    // TOGGLE_NODES_LIST_REFACTOR_ENABLED
    // TODO: Remove 'getToggle' wrapper, conditionals and keep only 'isEnabled' inner code
    cy.getToggle('toggleNodesListRefactorEnabled').then((isEnabled) => {
      if (isEnabled) {
        this.shouldBe('formFolderModal', 'be.visible');
        this.shouldBe('formFolderNameInput', 'be.visible');
        this.shouldBe('submitFolderFormButton', 'be.visible');
      } else {
        this.shouldBe('newFolderModal', 'be.visible');
        this.shouldBe('folderNameField', 'be.visible');
        this.shouldBe('newFolderConfirmButton', 'be.visible');
      }
    });
  },

  isEditFormFolderModalVisible() {
    // TOGGLE_NODES_LIST_REFACTOR_ENABLED
    // TODO: Remove 'getToggle' wrapper, conditionals and keep only 'isEnabled' inner code
    cy.getToggle('toggleNodesListRefactorEnabled').then((isEnabled) => {
      if (isEnabled) {
        this.shouldBe('formFolderModal', 'be.visible');
        this.shouldBe('formFolderNameInput', 'be.visible');
        this.shouldBe('submitFolderFormButton', 'be.visible');
      } else {
        this.shouldBe('editFolderModal', 'be.visible');
        this.shouldBe('editFolderNameField', 'be.visible');
        this.shouldBe('editFolderConfirmButton', 'be.visible');
      }
    });
  },

  clearFormFolderNameInput() {
    // TOGGLE_NODES_LIST_REFACTOR_ENABLED
    // TODO: Remove 'getToggle' wrapper, conditionals and keep only 'isEnabled' inner code
    cy.getToggle('toggleNodesListRefactorEnabled').then((isEnabled) => {
      if (isEnabled) cy.get('[data-testid="formFolderNameInput"]', { timeout: 15000 }).clear();
      else cy.get('[data-testid=editFolderNameField]').clear();
    });
  },

  fillFormFolderNameInput(folderName) {
    // TOGGLE_NODES_LIST_REFACTOR_ENABLED
    // TODO: Remove 'getToggle' wrapper method, conditionals and keep only 'isEnabled' inner code
    cy.getToggle('toggleNodesListRefactorEnabled').then((isEnabled) => {
      if (isEnabled) cy.get('[data-testid=formFolderNameInput]').type(folderName);
      else cy.get('[data-testid=folderNameField]').type(folderName);
    });
  },

  fillEditFormFolderNameInput(folderName) {
    // TOGGLE_NODES_LIST_REFACTOR_ENABLED
    // TODO: Remove 'getToggle' wrapper method, conditionals and keep only 'isEnabled' inner code
    cy.getToggle('toggleNodesListRefactorEnabled').then((isEnabled) => {
      if (isEnabled) cy.get('[data-testid="formFolderNameInput"]').type(folderName);
      else cy.get('[data-testid=editFolderNameField]').type(folderName);
    });
  },

  clickSubmitFolderFormButton(text) {
    let testId = '';
    // TOGGLE_NODES_LIST_REFACTOR_ENABLED
    // TODO: Remove 'getToggle' wrapper method, ternary and
    //       keep 'submitFolderFormButton' testId value
    cy.getToggle('toggleNodesListRefactorEnabled').then((isEnabled) => {
      testId = isEnabled ? 'submitFolderFormButton' : 'newFolderConfirmButton';

      this.shouldBe(testId, 'be.visible');
      cy.get(`[data-testid="${testId}"]`).contains(text, { timeout: 10000 });
      this.clickButton(testId);
    });
  },

  clickSubmitEditFolderFormButton(text) {
    let testId = '';
    // TOGGLE_NODES_LIST_REFACTOR_ENABLED
    // TODO: Remove 'getToggle' wrapper method, ternary and
    //       keep 'submitFolderFormButton' testId value
    cy.getToggle('toggleNodesListRefactorEnabled').then((isEnabled) => {
      testId = isEnabled ? 'submitFolderFormButton' : 'editFolderConfirmButton';

      this.shouldBe(testId, 'be.visible');
      cy.get(`[data-testid="${testId}"]`).contains(text, { timeout: 10000 });
      this.clickButton(testId);
    });
  },

  submitFolderFormButtonIsDisabled() {
    let testId = '';
    // TOGGLE_NODES_LIST_REFACTOR_ENABLED
    // TODO: Remove 'getToggle' wrapper method, ternary and
    //       keep 'submitFolderFormButton' testId value
    cy.getToggle('toggleNodesListRefactorEnabled').then((isEnabled) => {
      testId = isEnabled ? 'submitFolderFormButton' : 'editFolderConfirmButton';
      this.shouldBe(testId, 'be.disabled');
    });
  },

  createSingleFolder(folderName) {
    // TOGGLE_NODES_LIST_REFACTOR_ENABLED
    // TODO: Remove 'getToggle' wrapper, conditionals and keep only 'isEnabled' inner code
    cy.getToggle('toggleNodesListRefactorEnabled').then((isEnabled) => {
      if (isEnabled) this.createAnNewFolder(folderName);
      else {
        this.clickNewFolderButton();
        this.shouldBe('newFolderModal', 'be.visible');
        this.shouldBe('folderNameField', 'be.visible');
        this.shouldBe('newFolderConfirmButton', 'be.visible');
        cy.get('[data-testid=folderNameField]').type(folderName);
        this.shouldBe('newFolderConfirmButton', 'be.visible');
        this.clickButton('newFolderConfirmButton');
      }
    });

    cy.contains('Pasta criada com sucesso', { timeout: 20000 }).click();
  },

  clickNewFolderButton() {
    cy.get('[data-testid="newFolderButton"]').contains('Nova pasta', { timeout: 10000 });
    this.clickButton('newFolderButton');
  },

  clickFolderMoreOptions(folderName) {
    const testid = upperFirst(camelCase(folderName));
    cy.get(`[data-testid="nodeFolder${testid}MoreOptions"]`, { timeout: 15000 }).first().click();
  },

  clickRenameMoreOption(folderName) {
    const testId = `rename${folderName}MoreOption`;
    this.shouldBe(testId, 'be.visible');
    cy.get(`[data-testid=${testId}]`).contains('Renomear', { timeout: 10000 });
    this.clickButton(testId);
  },

  createAnNewFolder(folderName) {
    this.clickNewFolderButton();
    this.isFormFolderModalVisible();
    this.fillFormFolderNameInput(folderName);
    this.clickSubmitFolderFormButton('Criar');
  },

  clickCloseButton() {
    this.clickButton('closeButton');
  },

  accessNodeFolder(nodeName) {
    cy.get(`[data-testid="${camelCase(`nodeFolder_${nodeName}`)}Link"]`, { timeout: 5000 }).click();
  },

  selectSignerAs() {
    this.clickButton('signerSignAsSelect');
    this.clickOption('selectFieldSign');
    this.clickOption('selectFieldParty');
    this.clickOption('selectFieldWitness');
    this.clickButton('nextStepAddSignerModalButton');
  },

  shouldListSignerAs() {
    cy.contains('Assinar, Assinar como parte e Assinar como testemunha');
  },

  selectOrdenationSigner() {
    this.clickButton('orderSubscriptionButton');
    this.clickButton('sequenceEnabledCheckbox', { force: true });
    this.clickButton('saveconfirmButton');
    cy.contains('Grupo 1');
    cy.contains('Grupo 2');
  },

  shouldDraft() {
    cy.contains('Adicionar documentos');
    cy.contains('Adicionar signatários');
    cy.get('[data-testid="changeFolderButton"]').contains('Alterar pasta');
  },

  selectDocumentsRead() {
    this.clickButton('readdocumentButton');
  },

  shouldOrdenationShowDocuments() {
    cy.get('[data-testid=orderSubscriptionButton]').should('be.visible');
    cy.get('[data-testid=orderSubscriptionButton]').should('have.attr', 'disabled', 'disabled');
  },

};
