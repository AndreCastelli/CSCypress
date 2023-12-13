import {
  And as E,
  When as Quando,
  Given as Então,
} from 'cypress-cucumber-preprocessor/steps';

import FolderElements from '../../elements/FolderElements';
import Page from '../../page_objects/Page';
import PermissionElements from '../../elements/PermissionElements';

import documentsNewPage from '../../page_objects/documentsPage';

const folderPage = new Page(FolderElements);
const permissionPage = new Page(PermissionElements);

const rootFolderName = 'Automacaopermissoes';
const subfolder = 'SemPermissao';
const memberAccount = Cypress.config('member');

E('tenho a pasta Automacaopermissoes na raiz', () => {
  cy.wait(500);
  cy.get('body').then(($body) => {
    if ($body.find(`[data-testid=nodeFolder${rootFolderName}Link]`).length === 0) {
      cy.wait(500);
      documentsNewPage.createSingleFolder(rootFolderName);
    }
  });
});

E('seleciono a pasta "Pasta permissões"', () => {
  documentsNewPage.markFolderCheckbox(rootFolderName);
});

Quando('clico em Permissões', () => {
  permissionPage.verifyPermissionFolder();
});

E('tenho uma subpasta SemPermissao na pasta raiz', () => {
  folderPage.accessNodeFolder(rootFolderName);
  cy.wait(900);
  cy.get('body').then(($body) => {
    if ($body.find(`[data-testid=nodeFolder${subfolder}Link]`).length === 0) {
      cy.wait(500);
      documentsNewPage.createSingleFolder(subfolder);
    }
  });
});

Quando('seleciono a pasta semPermissao', () => {
  documentsNewPage.markFolderCheckbox(subfolder);
});

Então('espero não ver o botão permissões', () => {
  cy.contains('Permissões').should('not.exist');
});

E('seleciono a pasta automacao permissoes', () => {
  documentsNewPage.markFolderCheckbox(rootFolderName);
});

E('atribuo a permissão {string} para a pasta', (typePermission) => {
  permissionPage.setPermissionFolder(typePermission);
});

Quando('clico em "Salvar"', () => {
  permissionPage.savePermissionFolder();
});

E('retiro a permissão de um usuário membro', () => {
  permissionPage.removePermissionFolder(memberAccount);
});
