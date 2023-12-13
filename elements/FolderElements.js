import { faker } from '@faker-js/faker';
import {
  find, capitalize, upperFirst, camelCase, each,
} from 'lodash';
import { arrayToObject } from '../../utils/util';
import requests from '../requests/Requests';

export default {
  nodesActionsDropdown: ['clickable'],
  newFolderButton: ['clickable'],
  editFolderButton: ['clickable'],
  transformToObject(params) {
    const folderFiles = [];
    const page = arrayToObject(params.rawTable);
    Object.entries(page).forEach((item) => {
      folderFiles.push(this.addItemToFolderFiles(item[0], item[1]));
    });
    return folderFiles;
  },
  addItemToFolderFiles(folder, file) {
    const timestamp = new Date().getTime();
    const objFolderFile = {
      folder: `${folder}_${timestamp}`,
      file: `${file}_${timestamp}.pdf`,
    };
    return objFolderFile;
  },
  collectItemRealName(collection, name, isFolder = true) {
    if (isFolder) {
      const objFolder = find(collection, (item) => item.folder.includes(name));
      return objFolder ? objFolder.folder : name;
    }
    const objFolder = find(collection, (item) => item.file.includes(name));
    return objFolder ? objFolder.file : name;
  },
  createDocuments(folderFiles) {
    const params = [];
    params['Finalizar documento automaticamente'] = true;
    params['Ordenação de signatários'] = false;
    params['Idioma do documento'] = 'pt-BR';
    const numDoc = 1;
    const extension = 'pdf';
    each(folderFiles, (item) => {
      const folderName = this.collectItemRealName(folderFiles, item.folder);
      const fileName = this.collectItemRealName(folderFiles, item.file, false);
      requests.createDocument(numDoc, extension, params, folderName, fileName);
    });
  },
  expandNodeFolder(nodeName) {
    cy.get(`[data-testid="${camelCase(`nodeFolder_${nodeName}`)}Arrow"]`, {
      timeout: 5000,
    }).click();
  },
  accessNodeFolder(nodeName) {
    cy.get(`[data-testid="${camelCase(`nodeFolder_${nodeName}`)}Link"]`, { timeout: 5000 }).click();
  },
  verifyNodeFolder(nodeName) {
    cy.get(`[data-testid="${camelCase(`nodeFolder_${nodeName}`)}Link"]`);
  },
  getNewRandomFolderName() {
    return `A${faker.random.word()}`;
  },
  getRandomCamelCaseFolderName() {
    return upperFirst(camelCase(faker.random.word()));
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
      cy.getByTestid('nodesActionsDropdown').click();
      cy.getByTestid(testId).contains(actions[kind]);
      cy.getByTestid(testId).click();
    } else {
      cy.log('Opção não encontrada');
    }
  },
  clickNewFolderButton() {
    this.newFolderButton.get().contains('Nova pasta', { timeout: 10000 });
    this.newFolderButton.click({ force: true });
  },
  clickSubimitFolderFormButton(text) {
    const testId = 'submitFolderFormButton';
    cy.getByTestid(testId).should('be.visible');
    cy.getByTestid(testId).contains(text, { timeout: 10000 });
    cy.getByTestid(testId).click();
  },
  clickRenameMoreOption(folderName) {
    const testId = `rename${folderName}MoreOption]`;
    cy.getByTestid(testId).should('be.visible');
    cy.getByTestid(testId).contains('Renomear', { timeout: 10000 });
    cy.getByTestid(testId).click();
  },
  fillFormFolderNameInput(folderName) {
    cy.getByTestid('formFolderNameInput').type(folderName);
  },
  clearFormFolderNameInput() {
    cy.getByTestid('formFolderNameInput').clear();
  },
  clickFolderMoreOptions(folderName) {
    const testid = upperFirst(camelCase(folderName));
    cy.get(`[data-testid="nodeFolder${testid}MoreOptions"]`, { timeout: 15000 }).first().click();
  },
  markFolderCheckbox(folderName) {
    const testid = upperFirst(camelCase(folderName));
    cy.get(`[data-testid="nodeFolder${testid}Checkbox"]`, { timeout: 15000 })
      .first()
      .click({ force: true });
  },
  deleteDocumentButtonModal() {
    cy.get('[data-testid=deleteDocumentButtonModal]').click();
  },
  markAllNodesCheckbox() {
    cy.get('[data-testid="selectAllNodesCheckbox"]', { timeout: 15000 })
      .first()
      .click({ force: true });
  },
  createAnNewFolder(folderName) {
    this.clickNewFolderButton();
    this.isFormFolderModalVisible();
    this.fillFormFolderNameInput(folderName);
    this.clickSubimitFolderFormButton('Criar');
  },
  isFormFolderModalVisible() {
    cy.getByTestid('formFolderModal').should('be.visible');
    cy.getByTestid('formFolderNameInput').should('be.visible');
    cy.getByTestid('submitFolderFormButton').should('be.visible');
  },
  deleteSingleFolder(folderName) {
    this.markFolderCheckbox(folderName);
    this.clickNodesHeaderDropdownAction('delete');
    this.deleteDocumentButtonModal();
  },
  nodeFolderLink(folderName) {
    cy.get(`[data-testid=nodeFolder${folderName}Link`).contains(folderName).click();
  },
  nodeFolderLabel(folderName) {
    cy.get(`[data-testid=nodeFolder${folderName}Label]`).contains(folderName).click();
  },
  nodeFolderCheckbox(folderName) {
    cy.get(`[data-testid=nodeFolder${folderName}Checkbox]`).first().click();
  },
  deleteFolder(folderName) {
    this.assertTitleInPage();
    this.nodeFolderCheckbox(folderName);
    this.clickNodesHeaderDropdownAction('delete');
    cy.get('[data-testid=deleteDocumentButtonModal]').click();
    cy.contains('Item movido para lixeira com sucesso', { timeout: 30000 });
    cy.wait(1000);
  },
  validateFolderDeleted(folderName, id) {
    const newFolderName = folderName + id;
    cy.get('body').should('not.contain', `${newFolderName}`);
  },
  assertTitleInPage() {
    cy.get('[data-testid=pageTitle]', { timeout: 20000 }).should('be.visible');
  },
  createNewFolderInMoveModal(folderName, parentName) {
    cy.getByTestid(`nodeFolder${parentName}Label`).click();
    cy.getByTestid('newFolderModalButton').click();
    cy.getByTestid('newFolderModalInput').type(folderName);
    cy.getByTestid('confirmNewFolderButton').click();
  },
};
