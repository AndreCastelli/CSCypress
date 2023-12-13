import {
  When as Quando,
  And as E,
} from 'cypress-cucumber-preprocessor/steps';

import Page from '../../page_objects/Page';
import TrashElements from '../../elements/TrashElements';

const trashPage = new Page(TrashElements);

E('acesso a página de lixeira', () => {
  trashPage.accessTrashPage();
});

Quando('seleciono todos os itens da pagina atual da lixeira', () => {
  trashPage.selectAllNodesCheckbox.click();
  cy.contains('Excluir definitivamente');
  cy.contains('Restaurar');
});

E('excluo definitivamente', () => {
  trashPage.hardDeleteNode();
  cy.contains('Excluir definitivamente');
  trashPage.hardDeleteConfirmButton.click();
});
