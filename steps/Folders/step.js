import {
  And as E,
  Then as Então,
  When as Quando,
} from 'cypress-cucumber-preprocessor/steps';

import { upperFirst, camelCase } from 'lodash';
import FolderElements from '../../elements/FolderElements';
import Page from '../../page_objects/Page';
import DocumentsElements from '../../elements/DocumentsElements';
import FoldersDeleteElements from '../../elements/FoldersDeleteElements';

import documentsNewPage from '../../page_objects/documentsPage';

const rootFolderName = 'PastaRaiz';
const folderPage = new Page(FolderElements);
const newFolderName = 'PastaPrincipal';
const documentsPage = new Page(DocumentsElements);
const url = Cypress.config('baseUrl');
const foldersDeletePage = new Page(FoldersDeleteElements);
let folderFiles = [];
let newFolderName1;
let newFolderName2;

Quando('crio uma nova pasta principal', () => {
  cy.wait(600);
  cy.get('body').then(($body) => {
    if ($body.find(`[data-testid=nodeFolder${newFolderName}Link]`).length >= 1) {
      cy.wait(600);
      folderPage.deleteSingleFolder(newFolderName);
      cy.wait(600);
      documentsNewPage.createSingleFolder(newFolderName);
    } else {
      documentsNewPage.createSingleFolder(newFolderName);
    }
  });
});

E('apago o nome da pasta digitado', () => {
  folderPage.clearFolderNameField();
});

Quando('crio uma pasta com o mesmo nome', () => {
  documentsNewPage.createAnNewFolder(newFolderName);
});

Quando('deleto uma pasta vazia', () => {
  folderPage.deleteSingleFolder(newFolderName);
});

E('acesso a pasta de documentos {string}', (folderName) => {
  folderPage.accessNodeFolder(folderName);
});

E('que retorno para a area logada da aplicação', () => {
  cy.visit(url);
  documentsPage.documentsLink.click();
});

E('todos documentos dentro da pasta "Cancelados" estão cancelados', () => {
  foldersDeletePage.getDocumentLinkTestId();
  foldersDeletePage.cancelDocumentButton.click();
  foldersDeletePage.cancelDocumentCheckbox.click();
  foldersDeletePage.cancelDocumentModalButton.click();
  cy.visit(url);
});

E('clico na opção de excluir pasta', () => {
  foldersDeletePage.deleteSelectedFolder();
});

E('confirmo a exclusão', () => {
  foldersDeletePage.deleteDocumentButtonModal();
});

E('crio as pastas com os arquivos', (params) => {
  folderFiles = folderPage.transformToObject(params);
  folderPage.createDocuments(folderFiles);
  cy.reload({ timeout: 8000 });
  documentsNewPage.containFolderOrDocument(params, folderFiles);
});

Quando('movo a pasta {string} para a pasta {string}', (folder1, folder2) => {
  let folderNameMove = documentsNewPage.collectItemRealName(folderFiles, folder1);
  documentsNewPage.selectNodeFolder(folderNameMove);

  documentsNewPage.clickNodesHeaderDropdownAction('move');

  folderNameMove = documentsNewPage.collectItemRealName(folderFiles, folder2);
  documentsNewPage.selectNodeFolderToMove(folderNameMove);

  documentsNewPage.submitMoveItem();
});

Quando('movo o arquivo {string} para a pasta {string}', (file, folder) => {
  const fileName = documentsNewPage.collectItemRealName(folderFiles, file, false);
  documentsNewPage.selectNodeDocument(fileName);

  documentsNewPage.clickNodesHeaderDropdownAction('move');

  const folderNameMove = documentsNewPage.collectItemRealName(folderFiles, folder);
  documentsNewPage.selectNodeFolderToMove(folderNameMove);

  documentsNewPage.submitMoveItem();
});

E('estou na página da pasta {string}', (text) => {
  const folderName = folderPage.collectItemRealName(folderFiles, text);
  cy.contains(folderName);
});

E('que vejo {string}', (type, params) => {
  if (type === 'arquivos') {
    documentsNewPage.containFolderOrDocument(params, folderFiles, false);
  } else if (type === 'pastas') {
    documentsNewPage.containFolderOrDocument(params, folderFiles);
  }
});

E('expando a pasta {string}', (folder) => {
  const folderName = folderPage.collectItemRealName(folderFiles, folder);
  folderPage.expandNodeFolder(folderName);
});

E('acesso a pasta com nome {string}', (folder) => {
  const folderName = folderPage.collectItemRealName(folderFiles, folder);
  folderPage.accessNodeFolder(folderName);
});

Quando('crio uma nova pasta', () => {
  newFolderName1 = folderPage.getNewRandomFolderName();
  documentsNewPage.createSingleFolder(newFolderName1);
});

E('seleciono a pasta criada', () => {
  documentsNewPage.markFolderCheckbox(newFolderName1);
});

Quando('renomeio essa pasta', () => {
  documentsNewPage.markFolderCheckbox(newFolderName1);
  documentsNewPage.clickNodesHeaderDropdownAction('rename');
  documentsNewPage.isEditFormFolderModalVisible();

  newFolderName1 = folderPage.getNewRandomFolderName();
  documentsNewPage.clearFormFolderNameInput();
  documentsNewPage.fillEditFormFolderNameInput(newFolderName1);
  documentsNewPage.clickSubmitEditFolderFormButton('Renomear');
});

Quando('renomeio essa pasta através do mais opções', () => {
  documentsNewPage.clickFolderMoreOptions(newFolderName1);

  const folderName = upperFirst(camelCase(newFolderName1, ' ', ''));
  documentsNewPage.clickRenameMoreOption(folderName);

  documentsNewPage.isEditFormFolderModalVisible();

  newFolderName1 = folderPage.getNewRandomFolderName();
  documentsNewPage.clearFormFolderNameInput();
  documentsNewPage.fillEditFormFolderNameInput(newFolderName1);
  documentsNewPage.clickSubmitEditFolderFormButton('Renomear');
});

E('clico no botão Renomear', () => {
  documentsNewPage.clickNodesHeaderDropdownAction('rename');
});

E('clico na opção Renomear', () => {
  const folderName = upperFirst(camelCase(newFolderName1, ' ', ''));
  documentsNewPage.clickRenameMoreOption(folderName);
});

E('vejo a tela de Renomear pasta', () => {
  documentsNewPage.isEditFormFolderModalVisible();
});

E('insiro um novo nome para a pasta', () => {
  newFolderName1 = folderPage.getNewRandomFolderName();
  folderPage.clearFormFolderNameInput();
  folderPage.fillEditFormFolderNameInput(newFolderName1);
  folderPage.clickSubimitFolderFormButton('Renomear');
});

E('confirmo a alteração no botão Renomear', () => {
  folderPage.clickSubimitFolderFormButton('Renomear');
});

E('clico em mais opções da pasta', () => {
  documentsNewPage.clickFolderMoreOptions(newFolderName1);
});

Quando('crio 2 novas pastas', () => {
  newFolderName1 = folderPage.getNewRandomFolderName();
  newFolderName2 = folderPage.getNewRandomFolderName();

  documentsNewPage.createSingleFolder(newFolderName1);
  documentsNewPage.createSingleFolder(newFolderName2);
});

E('seleciono as pastas criadas', () => {
  documentsNewPage.markFolderCheckbox(newFolderName1);
  documentsNewPage.markFolderCheckbox(newFolderName2);
});

Então('espero não ver o botão Renomear', () => {
  folderPage.editFolderButton.get().should('not.be.exist');
  documentsNewPage.markFolderCheckbox(newFolderName1);
  documentsNewPage.markFolderCheckbox(newFolderName2);
});

E('seleciono a primeira pasta criada', () => {
  documentsNewPage.markFolderCheckbox(newFolderName1);
});

E('digito o nome da segunda pasta criada no campo nome da pasta', () => {
  documentsNewPage.clearFormFolderNameInput();
  documentsNewPage.fillEditFormFolderNameInput(newFolderName2);
  documentsNewPage.clickSubmitEditFolderFormButton('Renomear');
});

E('vejo o botão Renomear desabilitado', () => {
  documentsNewPage.clearFormFolderNameInput();
  documentsNewPage.submitFolderFormButtonIsDisabled();
});

E('digito {string} no campo nome da pasta', (folderName) => {
  documentsNewPage.clearFormFolderNameInput();
  documentsNewPage.fillEditFormFolderNameInput(folderName);
});

E('apago o nome da pasta', () => {
  documentsNewPage.clearFormFolderNameInput();
});

Então('vejo que o campo nome do formulário é obrigatório', () => {
  cy.contains('O campo é obrigatório', { timeout: 40000 });
  documentsNewPage.submitFolderFormButtonIsDisabled();
  documentsNewPage.clickCloseButton();
});

E('deleto {string}', (typedelete) => {
  switch (typedelete) {
    case 'a pasta criada':
      folderPage.deleteFolder(upperFirst(camelCase(newFolderName1, ' ', '')));
      break;
    case 'as pastas criadas':
      folderPage.deleteFolder(upperFirst(camelCase(newFolderName1, ' ', '')));
      cy.wait(500);
      folderPage.deleteFolder(upperFirst(camelCase(newFolderName2, ' ', '')));
      break;
    default:
      cy.log(`O parâmetro ${typedelete} é invalido!`);
  }
});

E('tenho uma pasta na raiz', () => {
  cy.wait(500);
  cy.get('body').then(($body) => {
    if ($body.find(`[data-testid=nodeFolder${rootFolderName}Link]`).length > 0) {
      cy.wait(500);
      folderPage.accessNodeFolder(rootFolderName);
    } else {
      cy.wait(500);
      documentsNewPage.createSingleFolder(rootFolderName);
      folderPage.accessNodeFolder(rootFolderName);
    }
  });
});

Quando('crio uma subpasta {string}', (folderName) => {
  cy.document().then((doc) => {
    const doesNodeExists = !!doc.querySelector(`[data-testid=nodeFolder${folderName}Link]`);
    if (doesNodeExists) {
      folderPage.markAllNodesCheckbox();
      folderPage.clickNodesHeaderDropdownAction('delete');
      folderPage.deleteDocumentButtonModal();
    }
    documentsNewPage.createSingleFolder(folderName);
  });
});

Quando('crio outra subpasta {string}', (folderName) => {
  documentsNewPage.createAnNewFolder(folderName);
});

E('tenho uma subpasta {string} na pasta raiz', (folderName) => {
  // cy.get(`[data-testid=nodeFolder${folderName}Link]`);
  folderPage.verifyNodeFolder(folderName);
});

Quando('renomeio a subpasta {string} para o nome {string}', (folderName, newName) => {
  documentsNewPage.markFolderCheckbox(folderName);
  documentsNewPage.clickNodesHeaderDropdownAction('rename');
  documentsNewPage.isEditFormFolderModalVisible();
  documentsNewPage.clearFormFolderNameInput();
  documentsNewPage.fillEditFormFolderNameInput(newName);
  documentsNewPage.clickSubmitEditFolderFormButton('Renomear');
});

E('movo a subpasta {string} para a subpasta {string}', (folderName, destinyFolderName) => {
  documentsNewPage.markFolderCheckbox(folderName);
  documentsNewPage.clickNodesHeaderDropdownAction('move');
  folderPage.expandNodeFolder(rootFolderName);
  documentsNewPage.selectNodeFolderToMove(destinyFolderName);
  documentsNewPage.submitMoveItem();
});

Quando('movo a subpasta {string} para a subpasta {string} dentro dela', (folderName, destinyFolderName) => {
  documentsNewPage.markFolderCheckbox(folderName);
  documentsNewPage.clickNodesHeaderDropdownAction('move');
  folderPage.expandNodeFolder(rootFolderName);
  folderPage.expandNodeFolder(folderName);
  documentsNewPage.selectNodeFolderToMove(destinyFolderName);
  documentsNewPage.submitMoveItem();
});

Quando('Excluo a subpasta {string}', (folderName) => {
  documentsNewPage.markFolderCheckbox(folderName);
  folderPage.clickNodesHeaderDropdownAction('delete');
  folderPage.deleteDocumentButtonModal();
});
