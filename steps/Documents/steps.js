import {
  And as E,
  When as Quando,
  Given as Dado,
  Then as Então,
} from 'cypress-cucumber-preprocessor/steps';

import requests from '../../requests/Requests';
import DocumentReportPage from '../../page_objects/DocumentReportPage';
import DocumentsElements from '../../elements/DocumentsElements';
import Page from '../../page_objects/Page';
import documentsNewPage from '../../page_objects/documentsPage';

const documentsPage = new Page(DocumentsElements);
const baseUrl = Cypress.config('baseUrl');
const documentsDeletePage = new Page(DocumentsElements);

Dado('que estou na página de relatório de documentos', () => {
  DocumentReportPage.goDocumentsReportPage();
});

Então('vejo a coluna com assinaturas recusadas', () => {
  DocumentReportPage.columnIsVisible('Com assinaturas recusadas');
});

Dado('que possuo documento', () => {
  const bodyDocumentRequest = {
    'Finalizar documento automaticamente': 'true',
    'Ordenação de signatários': 'false',
    'Idioma do documento': 'pt-BR',
  };
  requests.createDocument('1', 'pdf', bodyDocumentRequest, '/');
});

Quando('aciono para excluir documento em processo', () => {
  cy.reload();
  documentsDeletePage.pageTitle.should('be.visible');
  documentsDeletePage.selectADocumentWithStatus('ContratoPdf', 'running');
  documentsDeletePage.deleteDocument();
});

Quando('acesso a página de documentos {string}', (namePage) => {
  cy.visit(baseUrl);
  documentsPage.documentsLink.click();
  documentsPage.acessPageDocument(namePage);
});

Então('vejo apenas documentos com status {string}', (statusDocument) => {
  documentsPage.validateDocumentList(statusDocument);
});

E('acesso a página de documentos', () => {
  cy.wait(2000);
  documentsPage.documentsLink.click();
});

E('escolho as formas que o signatário vai assinar', () => {
  documentsNewPage.selectSignerAs();
});

E('vejo o agrupamento de assinar na listagem do signatário', () => {
  documentsNewPage.shouldListSignerAs();
});

Então('ordeno os signatários', () => {
  documentsNewPage.selectOrdenationSigner();
});

E('visualizo o documento enviado', () => {
  documentsNewPage.selectDocumentsRead();
});

E('vejo o botão de ordenação desabilitado', () => {
  documentsNewPage.shouldOrdenationShowDocuments();
});
