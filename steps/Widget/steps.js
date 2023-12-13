import {
  When as Quando,
  And as E,
  Then as Então,
} from 'cypress-cucumber-preprocessor/steps';

import Page from '../../page_objects/Page';
import WidgetElements from '../../elements/WidgetElements';
import requests from '../../requests/Requests';
import { arrayToObject } from '../../../utils/util';
import widgetNewPage from '../../page_objects/widgetPage';
import apiInterface from '../../requests/apiInterface';

const widgetPage = new Page(WidgetElements);
let summary = '';

Quando('clico no botão de assinar documento', () => {
  widgetPage.signDocumentButton.contains('Assinar');
  widgetPage.signDocumentButton.click();
});

Então('vejo a página de link expirado em português', () => {
  cy.wait(2000);
  cy.url().should('include', '/unavailable');
  cy.contains('Este link expirou', { timeout: 40000 });
});

Então('vejo a página de link expirado em inglês', () => {
  cy.wait(2000);
  cy.url().should('include', '/unavailable');
  cy.contains('This link has expired', { timeout: 40000 });
});

E('avanço pela step de finalizar confirmação de dados', () => {
  widgetPage.stepInfoFinalizeButton.contains('Finalizar');
  cy.wait(1000);
  widgetPage.stepInfoFinalizeButton.click();
});

Quando('acesso novamente a url do documento para assinar', () => {
  cy.visit(requests.getDocumentUrl());
});

E('clico no botão Ver para assinar', () => {
  widgetPage.viewToSignButton.contains('Ver para assinar');
  widgetPage.viewToSignButton.click();
});

E('removo signatários do documento', () => {
  requests.removeSigner();
});

E('envio uma assinatura em lote de forma {string}', (summaryx) => {
  summary = summaryx;
  requests.createBatch(summaryx);
});

E('vejo os documentos de acordo com a forma escolhida: colapsada ou sequencial', () => {
  widgetPage.documentsListSummary(summary);
});

E('clico no botão Assinar do lote de documentos', () => {
  widgetPage.clickSignDocumentButton();
  widgetPage.nextStepInfoButton.contains('Avançar');
  widgetPage.nextStepInfoButton.click();
});

Quando('desenho a assinatura manuscrita', () => {
  widgetPage.handwrittenSignature();
});

E('avanço pelas steps de tirar fotos do documento oficial', (params) => {
  const page = arrayToObject(params.rawTable);
  widgetPage.pictureStepButton.contains(page['Botão de preparar para foto']);
  widgetPage.pictureStepButton.click();
  widgetPage.captureCameraButton.click();
  widgetPage.nextStepInfoButton.click();
  widgetPage.pictureStepButton.contains(page['Botão de preparar para foto']);
  widgetPage.pictureStepButton.click();
  widgetPage.captureCameraButton.click();
  widgetPage.nextStepInfoButton.click();
});

Quando('clico no botão de opções', () => {
  widgetPage.optionsDocumentButtonClick();
});

E('clico na opção {string} do modal', (option) => {
  widgetPage.optionsModalClickOnOption(option);
});

E('clico no botão recusar', () => {
  widgetPage.refusalSubmitButtonClick();
});

E('botão recusar deve estar desabilitado', () => {
  widgetPage.refusalSubmitButtonDisabled();
});

E('preencho os dados da recusa com', (params) => {
  widgetPage.refuseSignature(arrayToObject(params.rawTable));
});

Quando('acessso a página de confirmação de rubrica eletrônica', () => {
  widgetNewPage.clickSignDocumentButton();
});

Então('vejo a página de confirmação de leitura e concordância do documento', () => {
  widgetNewPage.containsConfirmRubricText();
  widgetNewPage.containsConfirmReadyDocumentTitle();
  widgetNewPage.shouldConfirmRubricAndNextButtonIsVisible();
  widgetNewPage.shouldConfirmRubricCheckboxIsVisible();
});

Quando('habilito o checkbox de rubricar o documento', () => {
  widgetNewPage.clickConfirmRubricCheckboxIsEnabled();
  widgetNewPage.shouldConfirmRubricCheckboxIsEnabled();
});

Então('botão de confirmar e avançar é habilitado', () => {
  widgetNewPage.shouldConfirmRubricAndNextButtonIsEnabled();
});

E('consigo avançar para próxima etapa', () => {
  widgetNewPage.clicNextStepInfoButton();
});

Quando('desabilito o checkbox de rubricar o documento', () => {
  widgetNewPage.clickConfirmRubricCheckboxIsEnabled();
  widgetNewPage.shouldConfirmRubricCheckboxIsEnabled();
  widgetNewPage.clickConfirmRubricCheckboxIsDesable();
});

Então('botão de confirmar e avançar é desabilitado', () => {
  widgetNewPage.shouldConfirmRubricNextButtonDisabled();
});

E('vou até o final do documento', () => {
  widgetNewPage.scrollToBottomOfPage();
});

Então('vejo que o botão assinar está desabilitado', () => {
  widgetNewPage.shouldSignDocumentButtonDisabled();
});

Então('vejo que o botão assinar está habilitado', () => {
  widgetNewPage.shouldSignDocumentButtonEnabled();
});

Então('eu vejo o documento novamente', () => {
  widgetPage.previewDocumentContainer.get().should('be.visible');
});

Quando('crio clausulas', () => {
  apiInterface.createClausesInDocument();
});

E('acesso o documento com rubrica eletrônica com clausulas especificas', () => {
  apiInterface.createClausesInDocument();
  widgetNewPage.documentAccess();
});

Quando('acesso a página de rubrica eletrônica com clausulas especificas', () => {
  widgetNewPage.scrollToBottomOfPage();
  widgetNewPage.clickSignDocumentButton();
});

Então('vejo a página de rubrica eletrônica com clausulas especificas', () => {
  widgetNewPage.containsGoBackButton();
  widgetNewPage.verifyClausesStep('contrato.pdf', 'Clausula teste cypress', ' descricao cypress ');
});

Quando('habilito o checkbox de rubrica eletrônica com clausulas especificas', () => {
  widgetNewPage.clickConfirmClauseCheckbox();
});

Quando('desabilito o checkbox de rubrica eletrônica com clausulas especificas', () => {
  widgetNewPage.clickConfirmClauseCheckbox();
  widgetNewPage.clickConfirmClauseCheckbox();
});

Então('visualizo os lotes pendentes para assinar', (params) => {
  const doc = arrayToObject(params.rawTable);
  widgetNewPage.shouldBatchesPendingVisible(doc['nome do documento']);
});

E('acesso o lote para assinar', () => {
  widgetNewPage.clickBatchesPendingSignerArea();
});

E('visualizo minhas pendencias', (params) => {
  const qtd = arrayToObject(params.rawTable);
  const ndoc = arrayToObject(params.rawTable);
  widgetNewPage.shouldQtdDocsPendingSignerArea(qtd['Quantidade de documentos'], ndoc['nome do documento']);
});

E('volto para area do signatario', () => {
  widgetNewPage.clickBackSignerAreaButton();
});

E('acesso de volta minha área de assinatura', () => {
  widgetNewPage.optionsModalDocumentButtonClick();
  widgetNewPage.clickSignerAreaPendingDocumentsButton();
});

E('volto para minha área', () => {
  widgetNewPage.clickSignerAreaDashboardButton();
  widgetNewPage.shouldPendingListSignerArea();
});

Então('visualizo modal com informação de aguardando outros signatários', () => {
  widgetNewPage.shouldOrdenationAtctive();
});

Então('visualizo modal com alguns documentos indisponiveis para assinar', () => {
  widgetNewPage.shouldUnavailableToSignerRefusal();
});

E('seleciono para recusar um documento', () => {
  widgetNewPage.clickRefusalBatchSignerArea();
});
