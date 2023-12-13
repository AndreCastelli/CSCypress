import {
  Then as Então,
  When as Quando,
  And as E,
} from 'cypress-cucumber-preprocessor/steps';

import Page from '../../page_objects/Page';
import SignerElements from '../../elements/SignerElements';

import setupDocumentPage from '../../page_objects/setupDocumentPage';
import documentsPage from '../../page_objects/documentsPage';
import showDocumentPage from '../../page_objects/showDocumentPage';
import widgetPage from '../../page_objects/widgetPage';
import Requests from '../../requests/Requests';
import commonComponents from '../../page_objects/commonComponents';
import accountsPage from '../../page_objects/accountsPage';

const documentName = 'contrato.pdf';
// const url = Cypress.config('baseUrl');

const signerPage = new Page(SignerElements);
/* STEPS */

E('crio um novo signatário', () => {
  commonComponents.addRandomSignerToDocument();
});

E('volto para a home', () => {
  setupDocumentPage.backToHome();
});

E('acesso o documento na area logada', () => {
  accountsPage.authenticatorAndAcessOperatorArea();
  documentsPage.verifyRunningDocumentLinkIsVisible();
  documentsPage.accessDocumentStatusPage('Em processo');
  documentsPage.verifyRunningDocumentsListIsVisible();
  documentsPage.openShowDocument(documentName);
});

Quando('cancelo o documento', () => {
  showDocumentPage.clickCancelDocumentButton();
  showDocumentPage.confirmCancelDocumentModal();
});

Então('espero ver um alerta de sucesso', () => {
  // TOGGLE_IMPROVEMENT_PERFORMANCE_SCOPE
  // TODO: when scope > 1 remove getToggle and keep if inner code
  cy.getToggle('toggleImprovementPerformanceScope', { scope: 1 }).then((isEnabled) => {
    if (isEnabled) {
      cy.contains('Cancelado', { timeout: 40000 });
    } else {
      cy.contains(`Documento ${documentName} cancelado com sucesso`, { timeout: 40000 });
    }
  });
});

Quando('clico no botão finalizar', () => {
  showDocumentPage.clickFinishDocumentButton();
});

Quando('finalizo o documento', () => {
  showDocumentPage.clickFinishDocumentButton();
  showDocumentPage.verifyCanFinishDocumentModal('Deseja mesmo finalizar o documento?');
  showDocumentPage.clickFinishDocumentConfirmButton();
});

E('vejo uma tela com uma mensagem de bloqueio', () => {
  showDocumentPage.verifyCannotFinishDocumentModal();
});

E('que assino o documento', (params) => {
  cy.wait(1000);
  widgetPage.signDocument(params);
  widgetPage.verifyToken(params);
  accountsPage.authenticatorAndAcessOperatorArea();
  // cy.visit(url);
  documentsPage.accessDocumentStatusPage('Em processo');
  cy.wait(5000);
  documentsPage.openShowDocument(documentName);
});

Então('vejo uma mensagem de sucesso', () => {
  cy.contains(`Documento ${documentName} finalizado com sucesso`, { timeout: 4000 });
});

E('clico no botão de enviar documento', () => {
  signerPage.nextStepAddSignerModalButton.get().should('be.visible');
  cy.contains('Enviar documento', { timeout: 4000 });
  signerPage.nextStepAddSignerModalButton.click();
});

Então('vejo um novo usuário na lista de signatários com os dados', (params) => {
  cy.wait(1500);
  showDocumentPage.verifySignersList(params);
});

Quando('deleto o signatário', () => {
  cy.reload();
  cy.wait(4000);
  showDocumentPage.clickDeleteSignerButton();
  showDocumentPage.clickDeleteSignerConfirmButton();
});

Quando('notifico um lembrete ao signatário', () => {
  cy.reload();
  showDocumentPage.clickSendReminderToSignButton();
  showDocumentPage.verifySendReminderToSignModal();
  showDocumentPage.clickConfirmSendReminder();
});

Então('vejo uma mensagem de lembrete enviado', () => {
  showDocumentPage.verifySentReminderSuccessMessage();
});

E('adiciono um signatário no documento', () => {
  const list = {
    'Assinar como': 'manager',
  };
  Requests.linkExistingSignerToDocumet(list);
});

Quando('adiciono um novo signatário', () => {
  commonComponents.clickAddSignerButton();
  const signerData = {
    Email: 'clicksigncypress@gmail.com',
    'Nome completo': 'Alice da Silva',
    'Autenticação obrigatória': 'Token Via EMail',
  };
  commonComponents.addSignerDetails(signerData);
  commonComponents.clickNextStepAddSignerModalButton();
  commonComponents.saveSelectSignAs(['Assinar']);
  cy.contains('Enviar documento', { timeout: 4000 });
  commonComponents.clickNextStepAddSignerModalButton();
});

Quando('adiciono um novo signatário com cláusulas', () => {
  commonComponents.clickAddSignerButton();
  const signerData = {
    Email: 'clicksigncypress@gmail.com',
    'Nome completo': 'Alice da Silva',
    'Autenticação obrigatória': 'Token Via EMail',
  };
  commonComponents.addSignerDetails(signerData);
  commonComponents.clickNextStepAddSignerModalButton();
  commonComponents.saveSelectSignAs(['Assinar']);
  commonComponents.selectAddClausesOption();
  commonComponents.clickNextStepAddSignerModalButton();
  commonComponents.selectSignerClauseCheckbox();
  commonComponents.clickNextStepAddSignerModalButton();
  cy.contains('Enviar documento', { timeout: 4000 });
  commonComponents.clickNextStepAddSignerModalButton();
});

E('vejo um signatário com assinatura recusada', () => {
  showDocumentPage.hasRefusedSignature();
  showDocumentPage.refusedInfoModalActivatorIsVisible();
  showDocumentPage.refusedSignerIconIsVisible();
});

Quando('clico no botão de ver motivo da recusa', () => {
  showDocumentPage.refusedInfoModalActivatorClick();
});

E('vejo o seguinte comentário de recusa {string}', (comment) => {
  showDocumentPage.refusedCommentEquals(comment);
});

Então('não vejo o motivo da recusa', () => {
  showDocumentPage.refusalReasonTextHidden();
});

Então('vejo a rubrica eletrônica habilitada na listagem de signatários', () => {
  showDocumentPage.shouldListSignerRubricEnabled();
});
