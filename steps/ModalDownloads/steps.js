import {
  Given as Dado,
  And as E,
  When as Quando,
  Then as Então,
} from 'cypress-cucumber-preprocessor/steps';

import requests from '../../requests/Requests';
import DocumentsElements from '../../elements/DocumentsElements';
import WidgetElements from '../../elements/WidgetElements';
import ModalElements from '../../elements/ModalDownloadsElements';
import Page from '../../page_objects/Page';
import externalApplications from '../../requests/externalApplications';

import widgetNewPage from '../../page_objects/widgetPage';

import { TEXTS } from '../../../utils/constants';

const documentsListPage = new Page(DocumentsElements);
const widgetPage = new Page(WidgetElements);
const modalDownloadOptions = new Page(ModalElements);
const url = Cypress.config('baseUrl');
let documentStatus = '';

Dado('que possuo documento', () => {
  const bodyDocumentRequest = {
    'Finalizar documento automaticamente': 'true',
    'Ordenação de signatários': 'false',
    'Idioma do documento': 'pt-BR',
  };
  requests.createDocument('1', 'pdf', bodyDocumentRequest, '/');

  // Criação do signatário
  const authSigner = {
    'Autenticar usando': 'email',
  };
  requests.createSigner(authSigner);
});

E('seleciono este documento {string}', (status) => {
  cy.reload();
  const values = {
    'em processo': 'running',
    cancelado: 'canceled',
    finalizado: 'closed',
  };
  documentStatus = values[status];
  documentsListPage.selectADocumentWithStatus('ContratoPdf', values[status]);
});

E('cancelo este documento', () => {
  requests.cancelDocument();
});

Quando('solicito o download', () => {
  documentsListPage.downloadDocument.click();
});

Então('acesso o modal de opções de download verificando as opções disponíveis', () => {
  modalDownloadOptions.modalTitle.contains(TEXTS.DOWNLOADS.DOWNLOADOPTIONSMODAL.TITLE);
  modalDownloadOptions.originalDocumentsDownloadOption.should('be.enabled');
  if (documentStatus === 'running') {
    modalDownloadOptions.originalDocumentsDownloadOption.should('be.checked');
    modalDownloadOptions.originalAndSignedDocumentsDownloadOption.should('be.disabled');
    modalDownloadOptions.signedDocumentsDownloadOption.should('be.disabled');
  } else {
    modalDownloadOptions.originalAndSignedDocumentsDownloadOption.should('be.enabled');
    modalDownloadOptions.signedDocumentsDownloadOption.should('be.enabled');
    modalDownloadOptions.signedDocumentsDownloadOption.should('be.checked');
    modalDownloadOptions.originalDocumentsDownloadOption.click();
    modalDownloadOptions.originalDocumentsDownloadOption.should('be.checked');
    modalDownloadOptions.originalAndSignedDocumentsDownloadOption.click();
    modalDownloadOptions.originalAndSignedDocumentsDownloadOption.should('be.checked');
  }
});

E('finalizo este documento', () => {
  // Acessar link para assinar o documento
  widgetNewPage.documentAccess();

  // Avançando as steps de assinatura até o token
  widgetPage.signDocumentButton.contains('Assinar');
  widgetPage.signDocumentButton.click();
  widgetPage.nextStepInfoButton.contains('Avançar');
  widgetPage.nextStepInfoButton.click();

  // Inserindo o token recebido no e-mail
  externalApplications.fillToken();
});

E('que retorno para a area logada da aplicação', () => {
  cy.visit(url);
  documentsListPage.documentsLink.click();
});
