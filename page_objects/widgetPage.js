import externalApplications from '../requests/externalApplications';
import requests from '../requests/Requests';
import { arrayToObject } from '../../utils/util';

export default {

  shouldBe(dataTestId, shouldB) {
    cy.get(`[data-testid=${dataTestId}]`).should(shouldB);
  },

  containsConfirmReadyDocumentTitle() {
    cy.contains('Tudo certo com o documento?');
  },

  containsConfirmRubricText() {
    cy.contains('Sim, confirmo que li todas as páginas e concordo com este documento');
  },

  shouldConfirmRubricCheckboxIsVisible() {
    cy.get('[data-testid=widgetRubricCheckbox]').should('be.visible');
  },

  shouldConfirmRubricAndNextButtonIsVisible() {
    cy.get('[data-testid=nextStepInfoButton]').should('be.visible');
  },
  // Função para habilitar checkbox
  clickConfirmRubricCheckboxIsEnabled() {
    cy.get('[data-testid=widgetRubricCheckbox]').click();
  },
  // Função pra validar se checkbox está habilitado
  shouldConfirmRubricCheckboxIsEnabled() {
    cy.get('[data-testid=widgetRubricCheckbox] input').invoke('val').should('eq', 'true');
  },
  // Função pra validar se botão avançar e confirmar está habilitado
  shouldConfirmRubricAndNextButtonIsEnabled() {
    cy.get('[data-testid=nextStepInfoButton]').should('be.enabled');
  },
  // Função pra avançar na tela de Confirmar e avançar
  clicNextStepInfoButton() {
    cy.get('[data-testid=nextStepInfoButton]').click();
  },
  // Função pra validar se checkbox está desabilitado
  clickConfirmRubricCheckboxIsDesable() {
    cy.get('[data-testid=widgetRubricCheckbox]').click();
    cy.get('[data-testid=widgetRubricCheckbox]').should('not.be.checked');
  },
  // Função pra validar se botão avançar e confirmar está desabilitado
  shouldConfirmRubricNextButtonDisabled() {
    cy.get('[data-testid=nextStepInfoButton]').should('not.be.enabled');
  },
  // Função scroll para final da pagina
  scrollToBottomOfPage() {
    cy.wait(2000);
    cy.get('[data-testid=mainWidget]').scrollTo('bottom', { ensureScrollable: false });
  },
  // Validar click no botão assinar na tela do scroll
  clickSignDocumentButton() {
    cy.get('[data-testid=signDocumentButton]').click();
  },
  // Validar botão assinar desabilitado no scroll
  shouldSignDocumentButtonDisabled() {
    cy.get('[data-testid=signDocumentButton]').should('not.be.enabled');
  },
  // Validar botão assinar Habilitado no scroll
  shouldSignDocumentButtonEnabled() {
    cy.get('[data-testid=signDocumentButton]', { timeout: 30000 }).should('be.enabled');
  },

  // Validar botão assinar contém string
  signDocumentButtonContains(text) {
    cy.get('[data-testid=signDocumentButton]').contains(text);
  },

  nextStepInfoButtonContains(text) {
    cy.get('[data-testid=nextStepInfoButton]').contains(text);
  },

  stepInfoFinalizeButtonContains(text) {
    cy.get('[data-testid=stepInfoFinalizeButton]').contains(text);
  },

  clickStepInfoFinalizeButton() {
    cy.get('[data-testid=stepInfoFinalizeButton]').click();
  },

  shouldBeVisiblePreviewDocumentContainer() {
    cy.get('[data-testid=previewDocumentContainer]').should('be.visible');
  },

  verifyToken(params) {
    const page = arrayToObject(params.rawTable);
    cy.get('[data-testid=authenticatedTokenMessage]').then((tokenElemnt) => {
      if (Cypress.dom.isVisible(tokenElemnt)) {
        this.stepInfoFinalizeButtonContains(page['Botão finalização']);
        this.clickStepInfoFinalizeButton();
        cy.contains('Assinatura feita com sucesso!', { timeout: 40000 });
      } else {
        this.nextStepInfoButtonContains(page['Botão de avançar']);
        this.clicNextStepInfoButton();
        externalApplications.fillToken();
        cy.contains('Assinatura feita com sucesso!', { timeout: 40000 });
      }
    });
  },

  signDocument(params) {
    const page = arrayToObject(params.rawTable);
    this.documentAccess();
    this.shouldBeVisiblePreviewDocumentContainer();
    this.signDocumentButtonContains(page['Botão de assinar']);
    this.clickSignDocumentButton();
  },

  documentAccess() {
    cy.visit(requests.getDocumentUrl());
    cy.get('[data-testid=signDocumentButton]', { timeout: 30000 }).should('exist');
  },

  containsGoBackButton() {
    this.shouldBe('goBackWidgetLink', 'be.visible');
    cy.get('[data-testid="goBackWidgetLink"]').contains('Voltar');
  },

  verifyStepTitle(title) {
    cy.get('[data-testid="stepTitle"]').contains(title);
  },

  verifyClausesStep(documentName, clauseName, clauseDescription) {
    this.verifyStepTitle('Rubrica eletrônica');
    cy.get('[data-testid=documentNameTitle]').contains(documentName);
    cy.get('[data-testid="viewDocumentButton"]').should('be.visible');
    cy.get('[data-testid="viewDocumentButton"]').should('be.enabled');
    cy.get('[data-testid=clauseTitle]').contains(clauseName);
    cy.get('[data-testid=clauseDescriptionTitle]').contains(clauseDescription);
    cy.get('[data-testid="widgetClausesCheckbox"]').should('be.visible');
    cy.get('[data-testid="widgetClausesCheckbox"]').should('not.be.checked');
    cy.get('[data-testid="widgetClausesCheckbox"]').contains('Rubricar');
    this.shouldConfirmRubricNextButtonDisabled();
  },

  clickConfirmClauseCheckbox() {
    cy.get('[data-testid=widgetClausesCheckbox]').click();
  },

  shouldBatchesPendingVisible(docName) {
    cy.contains(docName);
  },

  clickBatchesPendingSignerArea() {
    cy.get('[data-testid="signerAreaBatchRow"]', { timeout: 10000 }).first().click();
  },

  shouldQtdDocsPendingSignerArea(qtddoc, docName) {
    cy.contains('Minha área de assinatura');
    if (qtddoc === 1) {
      cy.get('[data-testid="signerAreaBatchRow"]', { timeout: 10000 }).first().contains(docName);
    } else {
      cy.get('[data-testid="signerAreaBatchRow"]', { timeout: 10000 }).first().contains(qtddoc);
    }
  },

  clickBackSignerAreaButton() {
    cy.get('[data-testid="backSignerAreaButton"]', { timeout: 15000 })
      .should('be.visible')
      .click();
  },

  optionsModalDocumentButtonClick() {
    cy.get('.actions_33YdW > [data-testid="optionsDocumentButton"]')
      .contains('Opções')
      .click();
  },

  clickSignerAreaPendingDocumentsButton() {
    cy.get('[data-testid="SignerAreaPendingDocumentsButton"]')
      .should('be.visible')
      .click();
  },

  clickSignerAreaDashboardButton() {
    cy.get('[data-testid="signerDashboardButton"]')
      .should('be.visible')
      .click();
  },

  shouldPendingListSignerArea() {
    cy.contains('Minha área de assinatura');
    cy.get('[data-testid="signerAreaBatchTable"]', { timeout: 15000 }).should('be.visible');
  },

  shouldOrdenationAtctive() {
    cy.contains('Aguardando outros signatários');
    cy.get('[data-testid="signerAreaBatchWarningModal"]').should('be.visible');
  },

  shouldUnavailableToSignerRefusal() {
    cy.get('[data-testid="signerAreaBatchWarningModal"]').should('be.visible');
    cy.contains('Documento indisponível');
    cy.contains('Documento pausado');
    cy.contains('Cancelar');
    cy.contains('Avançar');
  },

  clickRefusalBatchSignerArea() {
    cy.get(':nth-child(1) > :nth-child(2) > .userActions_1DZtI > .first_1xaYO').first().click();
  },

  shouldDeadlineVisible() {
    cy.get('[data-testid="batchDeadlineHeaderColumn"]').should('be.visible');
    cy.contains('Vencimento');
  },

};
