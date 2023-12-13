import {
  When as Quando,
  And as E,
  Then as Então,
} from 'cypress-cucumber-preprocessor/steps';

import Page from '../../page_objects/Page';
import DashboardElements from '../../elements/DashboardElements';

import setupDocumentNewPage from '../../page_objects/setupDocumentPage';

const dashboardPage = new Page(DashboardElements);
const changePlanUrl = '/solicitacao-alteracao-plano';
const consumptionPageUrl = '/consumption';

const urls = {
  'Relatório de Documentos': {
    url: '/reports/documents',
  },
  Documentos: {
    url: '/folders',
  },
  'Em processo': {
    url: '/documents/running',
  },
  Finalizados: {
    url: '/documents/closed',
  },
  Cancelados: {
    url: '/documents/canceled',
  },
};

Então('sou direcionado para o fomulário de alteração de plano', () => {
  cy.contains('Solicite a alteração do seu plano', { timeout: 10000 }).should('be.visible');
  cy.url().should('include', changePlanUrl);
});

Então('sou direcionado para a tela de consumo', () => {
  cy.contains('Configurações da empresa', { timeout: 10000 }).should('be.visible');
  cy.url().should('include', consumptionPageUrl);
});

E('clico em Adicionar documentos', () => {
  dashboardPage.sendDocumentModal.get().should('be.visible');
  dashboardPage.sendDocumentButton.get().should('be.visible').click({ force: true });
});

E('clico em Baixar modelo', () => {
  dashboardPage.downloadSampleLink.get().should('be.visible').click({ force: true });
});

E('volto para a home', () => {
  setupDocumentNewPage.backToHome();
});

Quando('clico no botão Ver relatórios', () => {
  dashboardPage.documentsReportButton.get({ timeout: 20000 }).should('be.visible');
  dashboardPage.documentsReportButton.click();
});

Então('sou direcionado para tela de {string}', (statusDocument) => {
  cy.contains(statusDocument, { timeout: 10000 }).should('be.ok');
  cy.url().should('include', urls[statusDocument].url);
});

Quando('clico no botão Ver todos', () => {
  dashboardPage.allDocumentsButton.get({ timeout: 20000 }).should('be.visible');
  dashboardPage.allDocumentsButton.click();
});

Quando('clico no botão Em processo', () => {
  dashboardPage.runningDocumentsButton.get({ timeout: 20000 }).should('be.visible');
  dashboardPage.runningDocumentsButton.click();
});

Quando('clico no botão Finalizados', () => {
  dashboardPage.closedDocumentsButton.get({ timeout: 20000 }).should('be.visible');
  dashboardPage.closedDocumentsButton.click();
});

Quando('clico no botão Cancelados', () => {
  dashboardPage.canceledDocumentsButton.get({ timeout: 20000 }).should('be.visible');
  dashboardPage.canceledDocumentsButton.click();
});

Então('vejo o contador de documentos recusados diferente de zero', () => {
  dashboardPage.documentsRefusedCountNotEmpty();
});
