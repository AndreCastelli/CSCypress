import {
  And as E,
  When as Quando,
  Then as Então,
} from 'cypress-cucumber-preprocessor/steps';

import { arrayToObject } from '../../../utils/util';

import showDocumentPage from '../../page_objects/showDocumentPage';

E('acesso a aba de detalhes', () => {
  showDocumentPage.clickDocumentDetailsTab();
  cy.contains('Detalhes');
});

Quando('preencho os campos de detalhes', (params) => {
  const page = arrayToObject(params.rawTable);
  showDocumentPage.fillDocumentDetails(page);
});

Quando('adiciono um evento', (params) => {
  const page = arrayToObject(params.rawTable);
  showDocumentPage.fillDocumentEvents(page);
});

E('clico em {string} detalhes', (action) => {
  const actions = {
    salvar: 'saveDetailButton',
    excluir: 'deleteDetailItem1Button', // excluir referente a lista de evento linha 1

  };
  showDocumentPage.clickButton(actions[action]);
});

Então('vejo os detalhes adicionados', (params) => {
  const page = arrayToObject(params.rawTable);
  showDocumentPage.checkDocumentDetailAdded(page);
});

Então('vejo o documento e suas páginas', () => {
  showDocumentPage.checkDocumentPages();
});

Então('vejo os detalhes editados', (params) => {
  const page = arrayToObject(params.rawTable);
  showDocumentPage.checkDocumentDetailEdited(page);
});

E('vejo os detalhes adicionados na lista de eventos', (params) => {
  const page = arrayToObject(params.rawTable);
  showDocumentPage.checkDocEventsAdded(page);
});

Então('vejo os detalhes adicionados na lista de eventos editados', (params) => {
  const page = arrayToObject(params.rawTable);
  showDocumentPage.checkDocEventsEdited(page);
});

Quando('edito os campos de detalhes com', (params) => {
  const page = arrayToObject(params.rawTable);
  showDocumentPage.editDocumentDetails(page);
});

E('edito os campos do evento que já existe', (params) => {
  const page = arrayToObject(params.rawTable);
  showDocumentPage.editDocumentEvents(page);
});

E('visualizo o modal confirmando o desejo de editar', () => {
  showDocumentPage.verifyDetailsEditModalVisible();
  showDocumentPage.confirmDetailsEdit();
});

Então('não vejo uma lista de detalhes e eventos', () => {
  showDocumentPage.showEmptyDocumentDetailList();
});

E('excluo os campos do detalhes', () => {
  showDocumentPage.showEmptyDocumentDetail();
});

E('excluo a linha do evento', () => {
  showDocumentPage.showEmptyDocumentEvent();
});

E('estou na aba de detalhes de um documento', () => {
  showDocumentPage.createdDocumentWithDetails();
});

E('estou na aba de visualização de um documento', () => {
  showDocumentPage.createDocumentMultiplePages();
});

E('adiciono um evento tipo Texto', (params) => {
  const page = arrayToObject(params.rawTable);
  showDocumentPage.fillDocumentEventsKindText(page);
});

Quando('adiciono um evento tipo Data', () => {
  showDocumentPage.fillDocumentEventsKindDate();
});

E('vejo o toast com a mensagem salvo com sucesso', () => {
  cy.wait(500);
  cy.contains('Salvo com sucesso');
});
