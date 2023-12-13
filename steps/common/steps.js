import {
  Given as Dado,
  Then as Então,
  When as Quando,
  And as E,
} from 'cypress-cucumber-preprocessor/steps';

import SignupElements from '../../elements/SignupElements';
import Page from '../../page_objects/Page';
import LoginPage from '../../page_objects/LoginPage';
import accountsPage from '../../page_objects/accountsPage';
import SignerElements from '../../elements/SignerElements';
import CommonElements from '../../elements/CommonElements';
import WidgetElements from '../../elements/WidgetElements';
import FlowElements from '../../elements/FlowElements';
import FlowFormElements from '../../elements/FlowFormElements';
import FlowApprovalsElements from '../../elements/FlowApprovalsElements';
import ConfigurationElements from '../../elements/ConfigurationElements';
import TemplateElements from '../../elements/TemplateElements';
import DashboardElements from '../../elements/DashboardElements';
import OnboardingElements from '../../elements/OnboardingElements';
import DocumentsElements from '../../elements/DocumentsElements';
import FolderElements from '../../elements/FolderElements';
import FoldersDeleteElements from '../../elements/FoldersDeleteElements';

import setupDocumentPage from '../../page_objects/setupDocumentPage';
import documentsNewPage from '../../page_objects/documentsPage';
import widgetNewPage from '../../page_objects/widgetPage';
import showDocumentNewPage from '../../page_objects/showDocumentPage';
import flowsPage from '../../page_objects/flowsPage';
import commonComponents from '../../page_objects/commonComponents';
import externalApplications from '../../requests/externalApplications';

import { arrayToObject } from '../../../utils/util';
import requests from '../../requests/Requests';
import { TEXTS } from '../../../utils/constants';

const path = require('path');

const foldersDeletePage = new Page(FoldersDeleteElements);

const url = Cypress.config('baseUrl');
const { FORM_SELECT_STEP } = TEXTS.FLOW;
const { ALERT } = TEXTS.FLOW.ADD_SIGNER.FROM_FORM;

const commonPage = new Page(CommonElements);
const signupPage = new Page(SignupElements);
const signerPage = new Page(SignerElements);
const widgetPage = new Page(WidgetElements);
const flowPage = new Page(FlowElements);
const flowFormPage = new Page(FlowFormElements);
const flowApprovals = new Page(FlowApprovalsElements);
const configurationPage = new Page(ConfigurationElements);
const templatePage = new Page(TemplateElements);
const dashboardPage = new Page(DashboardElements);
const onboardingPage = new Page(OnboardingElements);
const documentsPage = new Page(DocumentsElements);
const folderPage = new Page(FolderElements);
const id = Math.floor(Math.random() * 9999 + 1);

let newFolderName;

let flowName = '';

Então('vejo a mensagem {string}', (text) => {
  cy.contains(text, { timeout: 30000 });
});

Então('vejo o log {string}', (text) => {
  showDocumentNewPage.clickDocumentHistoricTab();
  cy.contains(text);
});

E('clico no botão {string}', (text) => {
  cy.contains(text).filter(':visible').click();
});

E('clico no link {string}', (text) => {
  cy.contains(text).click();
});

Então('clico no botão Ok', () => {
  cy.get('[data-testid=okButton]').click();
});

Dado('que estou autenticado', () => {
  accountsPage.authenticatorAndAcessOperatorArea();
});

Dado('que estou autenticado com a conta empresarial', () => {
  LoginPage.loginAccount();
});

E('estou na página de documentos', () => {
  documentsPage.documentsLink.click();
  documentsPage.pageTitle.should('be.visible');
});

E('clico no botão adicionar documentos', () => {
  commonPage.documentUploadModalButton.click();
});

E('estou na página de configurações do menu', () => {
  cy.contains('Início');
  configurationPage.configurationMenuOption.get().scrollIntoView();
  configurationPage.configurationMenuOption.get().should('be.visible');
  configurationPage.configurationMenuOption.click();
  configurationPage.settingsContainerModal.get().should('be.visible');
});

E('estou na página de Modelos', () => {
  templatePage.templatesLink.click();
  cy.contains('Modelos');
  templatePage.createTemplateButton.get().should('be.visible');
});

E('estou na página da Dashboard', () => {
  dashboardPage.dashboardLink.get().should('be.visible');
  dashboardPage.dashboardLink.click();
  dashboardPage.dashboardLayout.get({ timeout: 10000 }).should('be.visible');
});

E('estou na página de Onboarding', () => {
  // toggle_new_onboarding_account_default_enabled
  // TODO: Remove 'getToggle' wrapper, conditionals and keep only 'isEnabled' inner code
  cy.getToggle('toggle_new_onboarding_account_default_enabled').then((isEnabled) => {
    if (isEnabled) {
      cy.get('[data-testid="nextStepButton"]').click();
      cy.get('[data-testid="testOperatorAccountButton"]').click();
    }
  });
  onboardingPage.onboardingModal.get().should('be.visible');
  cy.url().should('include', '/onboarding/account/new');
});

E('que estou na página de signup', () => {
  cy.visit(`${url}/signup`);
  signupPage.signupModal.get().should('be.visible');
  cy.url().should('include', '/signup');
});

Dado(
  'que faço o upload de {string} arquivo com o nome {string} do tipo {string}',
  (quant, fileName, type) => {
    const paths = Array(Number(quant)).fill(`files/${fileName}.${type}`);
    commonPage.attachPDFFile(paths);
  },
);

E('vejo uma lista com {string} arquivos', (quant) => {
  setupDocumentPage.checkNumberOfDocumentsInTheList(quant);
  cy.wait(1000);
});

E('clico no botão de avançar', () => {
  setupDocumentPage.clickNextStepBtn();
});

E('estou na página de criação de rascunho', () => {
  documentsNewPage.shouldDraft();
});

E('clico na opção signatário novo', () => {
  commonComponents.clickAddSignerButton();
});

Quando('eu preencho os dados do signatário com', (params) => {
  commonComponents.addSignerDetails(arrayToObject(params.rawTable));
});

E('clico no botão Avançar do modal de signatário', () => {
  signerPage.nextStepAddSignerModalButton.click();
});

E('escolho que o signatário deve assinar como', (params) => {
  signerPage.selectSignAs(params.rawTable.flat());
  cy.get('[data-testid=nextStepAddSignerModalButton]').first().click();
});

E('marco que o signatário pode recusar', () => {
  cy.get('[data-testid=refusalCheckbox]').click();
});

E('o signatário é vinculado ao documento em {string}', (locale) => {
  setupDocumentPage.deadlineNotEmpty();
  setupDocumentPage.selectLocaleDocumentField(locale);
});

E('envio os documentos', () => {
  setupDocumentPage.shouldSendMessageDocuments();
  setupDocumentPage.verifyMessageText('');
  cy.wait(5000);
  cy.contains('Enviar documento', { timeout: 30000 });
  setupDocumentPage.clickSendDocumentsButton();
  cy.wait(2000);
});

E('envio os {string} documentos', (qtddocs) => {
  setupDocumentPage.shouldSendMessageDocuments();
  setupDocumentPage.verifyMessageText('');
  cy.wait(5000);
  cy.contains(`Enviar ${qtddocs} documentos`, { timeout: 30000 });
  setupDocumentPage.clickSendDocumentsButton();
  cy.wait(2000);
});

Dado('que possuo documentos com as configurações', (params) => {
  const page = arrayToObject(params.rawTable);
  requests.createDocument(page['Quantidade de documentos'], page.Extensao, page);
});

E('possuo um signatário com os dados', (params) => {
  requests.createSigner(arrayToObject(params.rawTable));
});

E('vinculo o signatário ao documento', (params) => {
  requests.linkSignerToDocumet(arrayToObject(params.rawTable));
});

E('crio cláusulas para o documento', (params) => {
  requests.creatClauses(arrayToObject(params.rawTable));
  requests.linkClausesToDocument(arrayToObject(params.rawTable));
});

E('envio lembrete para o signatário', () => {
  requests.sendSignerNotification();
});

E('acesso a url do documento para assinar', () => {
  widgetNewPage.documentAccess();
});

E('avanço pela step confirmar dados', (params) => {
  const page = arrayToObject(params.rawTable);
  widgetPage.signDocumentButton.contains(page['Botão de assinar']);
  widgetPage.signDocumentButton.click();
  if (page['Botão de começar']) {
    widgetPage.nextStepInfoButton.contains(page['Botão de começar']);
    widgetPage.nextStepInfoButton.click();
  }
  widgetPage.nextStepInfoButton.contains(page['Botão de avançar']);
  widgetPage.nextStepInfoButton.click();
});

E('preencho o campo de token', (params) => {
  if (params) {
    const page = arrayToObject(params.rawTable);
    externalApplications.fillToken(page.Email);
  } else {
    externalApplications.fillToken();
  }
});

E('clico no botão {string} na step de token', (description) => {
  widgetPage.stepInfoFinalizeButton.contains(description);
  widgetPage.stepInfoFinalizeButton.click();
});

E('{string} o email', (expect, params) => {
  const page = arrayToObject(params.rawTable);
  widgetPage.verifyNumberEmails(expect, page);
});

Quando('avanço pela step selfie', (params) => {
  const page = arrayToObject(params.rawTable);

  if (page['Botão de avançar']) {
    widgetPage.nextSubstepSelfieButton.contains(page['Botão de avançar']);
    widgetPage.nextSubstepSelfieButton.click();
  }
  if (page['Botão de selfie']) {
    widgetPage.pictureStepButton.contains(page['Botão de selfie']);
    widgetPage.pictureStepButton.click();
    widgetPage.captureCameraButton.click();
  }

  if (page['Botão outra selfie']) {
    widgetPage.takeAnotherPhotoButton.contains(page['Botão outra selfie']);
    widgetPage.takeAnotherPhotoButton.click();
    widgetPage.captureCameraButton.click();
  }
  widgetPage.nextStepInfoButton.click();
});

E('verifico se o documento está em', (params) => {
  const page = arrayToObject(params.rawTable);
  accountsPage.authenticatorAndAcessOperatorArea();
  documentsNewPage.verifyDocumentStatusList(page);
});

E('edito as configurações do documento para a seguinte', (params) => {
  const page = arrayToObject(params.rawTable);
  requests.updateDocument(page);
});

E('o documento {string} é baixado', (fileName) => {
  const downloadsFolder = Cypress.config('downloadsFolder');
  cy.readFile(path.join(downloadsFolder, fileName)).should('exist');
});

E('clico no botão voltar', (params) => {
  const page = arrayToObject(params.rawTable);
  for (let i = 0; i < page['Quantidade de repetições']; i += 1) {
    widgetPage.goBackWidgetLink.click();
  }
});

E('vejo a quantidade de assinatura(s)', (params) => {
  const page = arrayToObject(params.rawTable);
  widgetPage.numberSignaturesText.contains(page['Quantidade de assinaturas']);
});

Quando('clico em reenviar token', () => {
  widgetPage.resendTokenLink.click();
});

E('vejo a informação de {string}', (infor) => {
  cy.contains(infor);
});

E('estou no menu fluxos', () => {
  flowPage.flowsMenuOption.click();
  flowPage.verifyPageFlow();
});

E('clico no botão criar fluxo', () => {
  const nameRandom = flowsPage.createFlowFakeName();

  flowPage.createFlowButton.click();
  cy.contains(TEXTS.FLOW.STEPS_TITLES.FLOW_NAME);
  cy.wait(1000);
  flowPage.nameField.clear();
  flowPage.nameField.type(nameRandom);
  flowPage.clickNextStepButton();
  flowName = nameRandom;
});

E('concluo com a configuração padrão', () => {
  flowPage.sectionTitle.contains(TEXTS.FLOW.STEPS_TITLES.SETTINGS);
  flowPage.settingNextStepButton.click();
  flowPage.messageNextStepButton.click();
  flowPage.activeNextStepButton.click();
  flowPage.closeButton.click();
});

Então('eu vejo na tela principal o fluxo criado', () => {
  flowPage.verifyTitletWithFlowCreated(flowName);
});

E('avanço para o preview do documento', (params) => {
  const page = arrayToObject(params.rawTable);
  widgetPage.visitDocument(page);
  widgetPage.previewDocumentContainer.get().should('be.visible');
});

E('recarrego a página', () => {
  cy.reload();
});

E('verifico a quantidade de emails recebidos', (params) => {
  widgetPage.numberEmails(params);
});

Quando('eu seleciono o formulário {string}', (formName) => {
  cy.contains(TEXTS.FLOW.STEPS_TITLES.FORM_SELECT).should('be.visible');
  flowPage.clickForm(formName);
  flowPage.clickNextStepButton();
});

E('em seguida escolho seguir para {string}', (choice) => {
  if (choice === FORM_SELECT_STEP.MODAL.OPTIONS.SECOND_FORM.TITLE) {
    flowPage.secondFormOptionModal.get().should('be.visible');
    flowPage.secondFormOptionModal.click();
    flowPage.modalNextStepButton.click();
    flowPage.secondFormOptionModal.get().should('not.be.visible');
  } else if (choice === FORM_SELECT_STEP.MODAL.OPTIONS.TEMPLATE.TITLE) {
    flowPage.templateOptionModal.get().should('be.visible');
    flowPage.templateOptionModal.click();
    flowPage.modalNextStepButton.click();
    flowPage.templateOptionModal.get().should('not.be.visible');
  }
});

E('seleciono o modelo {string}', (modelName) => {
  flowPage.clickTemplateOption(modelName);
  flowPage.clickNextStepButton();
});

E('seleciono as variáveis do documento', (params) => {
  const page = arrayToObject(params.rawTable);
  Object.keys(page).forEach((item, index) => {
    flowPage.selectDataByFirstForm(index, page[item]);
  });
  flowPage.clickNextStepButton();
});

E('seleciono o nome do documento', () => {
  flowPage.sectionTitle.contains(TEXTS.FLOW.STEPS_TITLES.FOLDER);
  flowPage.nextStepButton.get().should('be.disabled');
  cy.wait(500);
  flowPage.documentNameField.type('Nome');
  flowPage.folderNameField.type('Nome /');
  flowPage.nextStepButton.get().should('be.enabled');
  flowPage.clickNextStepButton();
});

E('adiciono o signatário preenchendo os dados', (params) => {
  flowPage.addSignerButton.click();
  commonComponents.addSignerDetails(arrayToObject(params.rawTable));
  cy.get('[data-testid=signerAddModal] [data-testid=nextStepAddSignerModalButton]').first().click();
  cy.wait(2000);
});

E('preencho o formulário deste fluxo', (params) => {
  flowPage.verifyTitletWithFlowCreated(flowName);
  flowPage.clickCopyLink(flowName);
  flowPage.accessFlowFormPage(flowName);
  const page = arrayToObject(params.rawTable);
  flowFormPage.fillFlowForm(page);
  cy.contains('Respostas enviadas');
});

E('eu clico no menu aprovações', () => {
  // cy.visit(url);
  accountsPage.authenticatorAndAcessOperatorArea();
  flowApprovals.flowsApprovalsMenuOption.click();
});

E('clico nas respostas do formulário correspondente ao fluxo criado', () => {
  cy.contains(flowName).click();
});

Então('valido que solicitação foi {string}', () => {
  flowApprovals.verifyFlowApprovalsAlert(flowName);
});

Então('eu vejo o alerta de signatário do formulário ainda não adicionado', (params) => {
  const page = arrayToObject(params.rawTable);
  flowPage.modalTitle.contains(ALERT.SIGNER_UNUTILIZED_TITLE);
  flowPage.signerUnutilizedAlertDescription.contains(ALERT.SIGNER_UNUTILIZED_SUBTITLE);
  flowPage.availableSignersText.contains(ALERT.AVALIABLE_SIGNERS);
  flowPage.availableFieldsText.contains(page['Signatários disponíveis']);
  flowPage.skipAddSignerFormButton.contains(ALERT.NEXT_WITHOUT_ADD_BUTTON);
  flowPage.addSignerFormButtonModal.contains(ALERT.ADD_SIGNER_BUTTON);
});

E('adiciono o signatário do formulário', () => {
  cy.get('[data-testid=modalSignerForm]').click();
  cy.get('[data-testid="signerAddModal"] [data-testid=formField]').click();
  cy.get('[data-testid=selectFieldEmailOption]').click();
  cy.get('[data-testid="signerAddModal"][style=""] [data-testid=nextStepAddSignerModalButton]').click();
  flowPage.signerSignAsSelect.click();
  cy.get('[data-testid=selectFieldSignOption]:visible').click();
  flowPage.signerSignAsSelect.click();
  cy.get('[data-testid="signerAddModal"][style=""] [data-testid=nextStepAddSignerModalButton]').click();
  flowPage.clickNextStepButton();
});

E('após o alerta adiciono o signatário do formulário', () => {
  cy.get('[data-testid=addSignerFormButtonModal]').click();
  cy.get('[data-testid="signerAddModal"] [data-testid=formField]').click();
  cy.get('[data-testid=selectFieldEMailOption]:visible').click();
  cy.get('[data-testid="signerAddModal"][style=""] [data-testid=nextStepAddSignerModalButton]').click();
  flowPage.signerSignAsSelect.click();
  cy.get('[data-testid=selectFieldSignOption]:visible').click();
  flowPage.signerSignAsSelect.click();
  cy.get('[data-testid="signerAddModal"][style=""] [data-testid=nextStepAddSignerModalButton]').click();
  flowPage.clickNextStepButton();
  cy.wait(2000);
});

Quando('adiciono o signatário do formulário após o alerta', () => {
  cy.wait(3000);
  cy.get('[data-testid=addSignerFormButtonModal]').click();
  cy.get('[data-testid="signerAddModal"] [data-testid=formField]').click();
  cy.get('[data-testid=selectFieldEMailOption]:visible').click();
  cy.get('[data-testid="signerAddModal"][style=""] [data-testid=nextStepAddSignerModalButton]').click();
  flowPage.signerSignAsSelect.click();
  cy.get('[data-testid=selectFieldSignOption]:visible').click();
  flowPage.signerSignAsSelect.click();
  cy.get('[data-testid="signerAddModal"][style=""] [data-testid=nextStepAddSignerModalButton]').click();
});

E('acesso a pasta {string}', (text) => {
  const folderName = text.replace(/(\w)(\w*)/g,
    (g0, g1, g2) => g1.toUpperCase() + g2.toLowerCase());
  cy.get(`[data-testid=nodeFolder${folderName}${id}Link]`).click();
});

E('confirmo que o status do documento é igual a {string}', (status) => {
  cy.wait(1000);
  requests.getStatusDocument(status);
});

Dado('que possuo a pasta com as configurações', (params) => {
  const page = arrayToObject(params.rawTable);
  requests.createDocument(
    page['Quantidade de documentos'],
    page.Extensao,
    page,
    `/${page['Nome da pasta']}${id}/`,
  );
  cy.reload();
});

E('cancelo o documento da pasta {string}', (folderName) => {
  documentsPage.documentsLink.click();
  documentsPage.canceledDocumentInFolder(folderName + id);
});

E('excluo o documento com o status {string}', (statusDocument) => {
  documentsPage.documentsLink.click();
  documentsPage.verifyStatusDocumentAndDelete(statusDocument, id);
});

Quando('seleciono a pasta {string}', (folderName) => {
  newFolderName = folderName + id;
  folderPage.nodeFolderCheckbox(newFolderName);
});

E('excluo o documento e a pasta {string}', (folderName) => {
  newFolderName = folderName + id;
  cy.visit(url);
  documentsPage.documentsLink.click();
  documentsPage.canceledDocumentInFolder(newFolderName);
  cy.visit(url);
  documentsPage.documentsLink.click();
  folderPage.nodeFolderLink(newFolderName);
  documentsPage.deleteDocumentInFolder();
  cy.visit(url);
  documentsPage.documentsLink.click();
  folderPage.deleteFolder(newFolderName);
});

E('verifico que a pasta {string} não é exibida na lixeira', (folderName) => {
  folderPage.validateFolderDeleted(folderName, id);
});

Quando('seleciono a pasta com o nome {string}', (text) => {
  documentsPage.documentsLink.click();
  switch (text) {
    case 'Cancelados':
      foldersDeletePage.nodeFolderCanceladosCheckbox(id);
      break;
    case 'Concluídos':
      foldersDeletePage.nodeFolderConcluidosCheckbox(id);
      break;
    case 'Em Processo':
      foldersDeletePage.nodeFolderEmProcessoCheckbox(id);
      break;
    case 'Aguardando':
      foldersDeletePage.nodeFolderAguardandoCheckbox(id);
      break;
    default:
      break;
  }
});

E('que cancelo 2 documentos da pasta "Aguardando"', () => {
  foldersDeletePage.cancelDocumentFolderAguardando(id);
  foldersDeletePage.nodesBreadcrumbPreviousLink.click();
  foldersDeletePage.nodesBreadcrumbPreviousLink.click();
  foldersDeletePage.cancelDocumentFolderAguardando(id);
  foldersDeletePage.nodesBreadcrumbPreviousLink.click();
  foldersDeletePage.nodesBreadcrumbPreviousLink.click();
});

E('clico no botão de submissão', () => {
  signupPage.submitButton.get({ timeout: 10000 }).should('be.not.disabled');
  signupPage.submitButton.click();
});

E('clico no botão de termos e submissão', () => {
  signupPage.acceptTermsCheckbox();
  signupPage.submitButton.get({ timeout: 10000 }).should('be.not.disabled');
  signupPage.submitButton.click();
});

E('abro a página de edição deste documento em {string}', (status) => {
  accountsPage.authenticatorAndAcessOperatorArea();
  requests.openMyFirstShowDocumentWithStatus(status);
});

Quando('clico no nome do meu perfil', () => {
  commonComponents.clickMenu();
});

Então('vejo um link para acessar área signatário', () => {
  commonComponents.shouldSignerAreaLink();
});

Então('não vejo um link para acessar área signatário', () => {
  commonComponents.shouldSignerAreaLinkNotVisible();
});
