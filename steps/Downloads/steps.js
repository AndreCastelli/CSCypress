import {
  Given as Dado,
  And as E,
  When as Quando,
  Then as Então,
} from 'cypress-cucumber-preprocessor/steps';

import Page from '../../page_objects/Page';
import requests from '../../requests/Requests';
import DocumentsElements from '../../elements/DocumentsElements';
import WidgetElements from '../../elements/WidgetElements';
import DownloadedElements from '../../elements/DownloadedElements';
import ModalElements from '../../elements/ModalDownloadsElements';
import externalApplications from '../../requests/externalApplications';

import widgetNewPage from '../../page_objects/widgetPage';

const user = Cypress.config('user');

const documentsListPage = new Page(DocumentsElements);
const widgetPage = new Page(WidgetElements);
const downloadedPage = new Page(DownloadedElements);
const modalDownloadOptions = new Page(ModalElements);
const folderName = '/DownloadTest/';

Dado('que tenho uma pasta com documento', () => {
  // Criação do documento
  const bodyDocumentRequest = {
    'Finalizar documento automaticamente': 'true',
    'Ordenação de signatários': 'false',
    'Idioma do documento': 'pt-BR',
  };
  requests.createDocument('1', 'pdf', bodyDocumentRequest, folderName);

  // Criação do signatário
  const authSigner = {
    'Autenticar usando': 'email',
  };
  requests.createSigner(authSigner);
  documentsListPage.documentsLink.click();
  documentsListPage.pageTitle.should('be.visible');
  documentsListPage.nodeFolderDownloadTestCheckbox.should('be.visible');
});

E('finalizo a assinatura do documento', () => {
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

E('{string} uma pasta com documentos finalizados', (selectOrAcess) => {
  documentsListPage.selectOrAccessFolder(selectOrAcess);
});

E('solicito o download do documento', () => {
  documentsListPage.clickOnFirstContratoDocument();
  documentsListPage.downloadDocument();
  modalDownloadOptions.confirmDownloadButton.click();
});

Quando('solicito o download', () => {
  documentsListPage.downloadDocument();
});

Dado('que solicito o download de uma pasta com documentos finalizados', () => {
  documentsListPage.selectOrAccessFolder();
  documentsListPage.downloadDocument();
  modalDownloadOptions.confirmDownloadButton.click();
});

Quando('clico no dropdown de mais opções', () => {
  cy.wait(2000);
  cy.get('[data-testid=nodeDocumentContratoPdfMoreOptions]:first').click();
});

Então('verifico as opções de download disponiveis para documento finalizado', () => {
  documentsListPage.downloadsOptionsDropdown('original').should('be.visible');
  documentsListPage.downloadsOptionsDropdown('assinado').should('be.visible');
  documentsListPage.downloadsOptionsDropdown('todos').should('be.visible');
});

Quando('acesso a tela Baixados', () => {
  documentsListPage.downloadsLink.click();
});

E('fecho o modal de aviso para o processamento em background', () => {
  documentsListPage.closeButton.click();
});

E('vejo o link para baixar', () => {
  cy.get('[data-testid=downloadLinkButton]:first').should('be.visible', { timeout: 6000 });
  cy.get('[data-testid=downloadLinkButton]:first').contains('Baixar');
  // downloadedPage.downloadLinkButton.get().first().click();
});

E('vejo o solicitante do download com o email da conta acessada', () => {
  downloadedPage.requesterDownloadColumn.get().first().should('be.visible');
  downloadedPage.requesterDownloadColumn.get().first().contains(user.email);
});

Então('acompanho o status do download Finalizado', () => {
  downloadedPage.downloadStatus.get().first().should('be.visible');
  downloadedPage.downloadStatus.get().first().contains('Processando');
});

E('que seleciono este documento e pasta', () => {
  documentsListPage.selectOrAccessFolder();
  documentsListPage.selectADocument('ContratoPdf');
});

Então('vejo o botão de Baixar', () => {
  documentsListPage.nodesActionsDropdown.click();
  documentsListPage.nodeActionDownloadOption.should('be.visible');
  documentsListPage.nodeActionDownloadOption.contains('Baixar');
});

Dado('que possuo documento', () => {
  const bodyDocumentRequest = {
    'Finalizar documento automaticamente': 'true',
    'Ordenação de signatários': 'false',
    'Idioma do documento': 'pt-BR',
  };
  requests.createDocument('1', 'pdf', bodyDocumentRequest, '/');
});
