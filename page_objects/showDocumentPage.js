import documentsPage from './documentsPage';
import APIInterface from '../requests/apiInterface';

import { arrayToObject } from '../../utils/util';

const date = new Date();
const year = date.getFullYear();
let today = date.getDate();
let month = date.getMonth() + 1;

export default {
  clickButton(id) {
    cy.get(`[data-testid=${id}]`).click();
  },

  clickButtonWithText(text) {
    cy.contains(text).click();
  },

  clickFirst(id) {
    cy.get(`[data-testid=${id}]`).first().click();
  },

  clickDocumentDetailsTab() {
    this.clickButton('documentDetailsTab');
  },

  clickDocumentViewTab() {
    // TOGGLE_IMPROVEMENT_PERFORMANCE_SCOPE
    // remove getToggle and keep just this.clickButton('tabDocument'); code
    cy.getToggle('toggleImprovementPerformanceScope').then((isEnabled) => {
      const buttonId = isEnabled ? 'tabDocument' : 'documentViewTab';
      this.clickButton(buttonId);
    });
  },

  typeInput(id, value) {
    cy.get(`[data-testid=${id}]`).type(value);
  },

  clearTypeInput(id) {
    cy.get(`[data-testid=${id}]`).clear();
  },

  shouldBe(id, should, value, options) {
    cy.get(`[data-testid=${id}]`, options).should(should, value);
  },

  selectFieldOptionEmpty(option) {
    cy.get(`[data-testid=selectField${option}Option]`).last().click();
  },

  selectFieldOption(option) {
    cy.get(`[data-testid=selectField${option}Option]`).first().click();
  },

  containText(text) {
    cy.contains(text, { timeout: 2000 }).should('be.visible');
  },

  fillDocumentDetails(page) {
    this.typeInput('documentDetailValue', page.Detalhes);
    this.selectCalendar('documentValidityDate');
    this.selectDate(today);
    this.clickButton('documentValidityDate');
  },

  fillDocumentDetailsYesterday() {
    this.selectCalendar('documentValidityDate');
    this.selectDate(today - 1);
    this.clickDocumentValidityDate();
  },

  fillDocumentEvents(page) {
    this.clickButton('addDetailItemButton');
    this.typeInput('documentDetailItem1Name', page['Nome do evento']);
    this.selectCalendar('documentDetailItem1Value');
    this.selectEventDay(today);
    this.clickButton('item-1');
  },

  checkDocumentDetailAdded(page) {
    const fields = {
      documentDetailValue: page.Detalhes,
      documentValidityDate: this.getDateString(),
    };

    Object.keys(fields).forEach((field) => {
      const selector = `[data-testid=${field}] ${field === 'documentValidityDate' ? 'input' : ''}`;
      cy.get(selector).invoke('val').should('eq', fields[field]);
    });
  },

  checkDocumentPages() {
    cy.getToggle('togglePdfjsPreviewerEnabled').then((isEnabled) => {
      if (isEnabled) {
        cy.get('.canvasWrapper canvas').should('have.length.greaterThan', 1);
        cy.getByTestid('currentPage').should('have.text', '1');
      } else {
        cy.getByTestid('pdfImagePage').should('have.length', 7);
      }
    });
  },

  checkDocumentDetailEdited(page) {
    today = date.getDate() + 1;
    month = date.getMonth() + 1;

    const fields = {
      documentDetailValue: page.Detalhes,
      documentValidityDate: this.getDateString(),
    };

    Object.keys(fields).forEach((field) => {
      const selector = `[data-testid=${field}] ${field === 'documentValidityDate' ? 'input' : ''}`;
      cy.get(selector).invoke('val').should('eq', fields[field]);
    });
  },

  checkDocEventsAdded(page) {
    const fields = {
      documentDetailItem1Name: page['Nome do evento'],
      documentDetailItem1Value: this.getDateString(),
    };

    Object.keys(fields).forEach((field) => {
      cy.get(`[data-testid=${field}]`).invoke('val').should('eq', fields[field]);
    });
  },

  checkDocEventsEdited(page) {
    today = date.getDate() + 1;
    month = date.getMonth() + 1;

    const fields = {
      documentDetailItem1Name: page['Nome do evento'],
      documentDetailItem1Value: this.getDateString(),
    };

    Object.keys(fields).forEach((field) => {
      cy.get(`[data-testid=${field}]`).invoke('val').should('eq', fields[field]);
    });
  },

  showEmptyDocumentDetailList() {
    const fields = ['documentDetailValue', 'documentValidityDateClearButton', 'deleteDetailItem1Button'];
    fields.forEach((field) => {
      cy.get(`[data-testid=detail${field}]`).should('not.exist');
    });
  },

  editDocumentDetails(page) {
    this.clearTypeInput('documentDetailValue');
    this.typeInput('documentDetailValue', page.Detalhes);
    this.selectDate(today + 1);
    this.clickDocumentValidityDate();
    this.clickButton('documentDetailValue');
    this.clickButton('saveDetailButton');
  },

  editDocumentEvents(page) {
    this.clearTypeInput('documentDetailItem1Name');
    this.typeInput('documentDetailItem1Name', page['Nome do evento']);
    this.selectCalendar('documentDetailItem1Value');
    this.selectEventDay(today);
    this.clickButton('documentDetailItem1Value');
  },

  clickAddDetailsButton(action) {
    const actions = {
      adicionar: 'addDetailButton',
      editar: 'editDetailButton',
    };
    this.clickButton(actions[action]);
  },

  selectDay(day) {
    cy.get('.date-time-picker').find('.datepicker-day').contains(day)
      .click({ force: true });
  },

  selectMonth(monthAux) {
    cy.get('.datetimepicker.visible').find('.date-buttons').first().click();
    cy.get('.year-month-selector').find('.month-button').eq(monthAux).click()
      .wait(400);
  },

  selectDate(day, monthSet) {
    if (monthSet) this.selectMonth(monthSet);
    this.selectDay(day);
  },

  selectEventDay(day) {
    cy.get('[data-testid="item-1"] > .date-time-picker').find('.datepicker-day-text').contains(day).click({ force: true });
  },

  selectEventText() {
    cy.get('[data-testid=item-2]').contains('Texto').click({ force: true }).first();
  },

  selectEventDate(id) {
    cy.get(`[data-testid=${id}]`).contains('Data').click({ force: true }).first();
  },

  selectCalendar(id) {
    cy.get(`[data-testid=${id}]`).click();
  },

  verifyDetailsEditModalVisible() {
    cy.contains('Editar Detalhe');
    cy.contains('Tem certeza que deseja editar este detalhe?');
  },

  confirmDetailsEdit() {
    this.clickButton('confirmDocumentDetailsEditButton');
  },

  createdDocumentWithDetails() {
    APIInterface.createDocumentDefault();
    documentsPage.clickDocumentsLinkMenu();
    documentsPage.verifyPageTitleIsVisible();
    const documentStatusList = {
      'Status do documento': 'Em processo',
      'Nome do documento': 'contrato.pdf',
    };
    documentsPage.verifyDocumentStatusList(documentStatusList);
    this.clickDocumentDetailsTab();
    const documentDetails = {
      Detalhes: 'Nome do detalhe',
    };
    this.fillDocumentDetails(documentDetails);
    // this.checkDocumentDetailAdded(documentDetails);
  },

  createDocumentMultiplePages() {
    APIInterface.createDocumentMultiplePages();
    documentsPage.clickDocumentsLinkMenu();
    documentsPage.verifyPageTitleIsVisible();
    const documentStatusList = {
      'Status do documento': 'Em processo',
      'Nome do documento': 'contrato.pdf',
    };
    documentsPage.verifyDocumentStatusList(documentStatusList);
    this.clickDocumentViewTab();
  },

  getDateString(isYesterday = false) {
    const monthStr = month < 10 ? `0${month}` : `${month}`;
    const newToday = isYesterday ? today - 1 : today;
    const todayStr = newToday < 10 ? `0${newToday}` : `${newToday}`;
    return `${todayStr}/${monthStr}/${year}`;
  },

  clickCancelDocumentButton() {
    this.shouldBe('cancelDocumentButton', 'be.visible');
    this.clickButton('cancelDocumentButton');
  },

  confirmCancelDocumentModal() {
    // TOGGLE_IMPROVEMENT_PERFORMANCE_SCOPE
    // TODO: when scope > 1 remove getToggle and keep if inner code
    cy.getToggle('toggleImprovementPerformanceScope', { scope: 1 }).then((isEnabled) => {
      if (isEnabled) {
        cy.contains('Ao cancelar, todas as assinaturas já efetuadas serão invalidadas.');
        this.clickButton('modalCheckbox');
        this.shouldBe('confirmationModalConfirm', 'be.visible');
        this.clickButtonWithText('Confirmar cancelamento');
      } else {
        cy.contains('Tem certeza que deseja cancelar o documento?');
        this.clickButton('cancelDocumentCheckbox');
        this.shouldBe('cancelDocumentModalButton', 'be.visible');
        cy.contains('Sim, cancelar o documento', { timeout: 2000 });
        this.clickButton('cancelDocumentModalButton');
      }
    });
  },

  clickFinishDocumentButton() {
    cy.wait(3000);
    this.shouldBe('finishDocumentButton', 'be.visible');
    this.clickButton('finishDocumentButton');
  },

  verifyCannotFinishDocumentModal() {
    this.shouldBe('cannotFinishDocumentModal', 'be.visible');
    cy.contains('O documento só poderá ser finalizado quando tiver ao menos uma assinatura', { timeout: 40000 });
  },

  verifySentReminderSuccessMessage() {
    this.shouldBe('sentMessageSuccess', 'be.visible');
    cy.contains('Lembrete enviado!', { timeout: 40000 });
  },
  clickDocumentValidityDate() {
    this.clickButton('documentValidityDate');
  },

  showEmptyDocumentDetail() {
    this.clearTypeInput('documentDetailValue');
    this.clickButton('documentValidityDateClearButton');
  },

  showEmptyDocumentEvent() {
    this.clickButton('deleteDetailItem1Button');
  },

  createDocumentWithTextDetail() {
    this.createdDocumentWithDetails();
  },

  fillDocumentEventsKindDate() {
    this.clickButton('addDetailItemButton');
    this.typeInput('documentDetailItem1Name', 'Lorem Ipsum');
    this.selectEventDay(today);
    cy.wait(500);
    this.clickButton('item-1');
  },

  fillDocumentEventsKindText(page) {
    this.clickButton('addDetailItemButton');
    this.selectEventText('selectFieldTextoOption');
    this.typeInput('documentDetailItem2Name', page['Nome do evento']);
    this.typeInput('documentDetailItem2TextValue', page['Texto do evento']);
  },

  verifyCanFinishDocumentModal(text) {
    this.shouldBe('canFinishDocumentModal', 'be.visible');
    cy.contains(text, { timeout: 2000 });
  },

  clickFinishDocumentConfirmButton() {
    this.shouldBe('finishDocumentConfirmButton', 'be.visible');
    cy.contains('Finalizar', { timeout: 2000 });
    this.clickButton('finishDocumentConfirmButton');
  },

  clickDeleteSignerButton() {
    this.clickFirst('deleteSignerButton');
  },

  clickDeleteSignerConfirmButton() {
    this.shouldBe('deleteSignerConfirmButton', 'be.visible');
    cy.contains('Clique para confirmar', { timeout: 1000 });
    this.clickFirst('deleteSignerConfirmButton');
  },

  clickSendReminderToSignButton() {
    this.shouldBe('sendToSignButton', 'be.visible');
    this.clickFirst('sendToSignButton');
  },

  verifySendReminderToSignModal() {
    this.shouldBe('sendToSignModal', 'be.visible');
    cy.contains('Enviar solicitação de assinatura', { timeout: 40000 });
  },

  clickConfirmSendReminder() {
    this.shouldBe('sendButton', 'be.visible');
    cy.contains('Enviar', { timeout: 40000 });
    this.clickButton('sendButton');
  },

  verifySignersList(params) {
    const page = arrayToObject(params.rawTable);
    cy.get('[data-testid=pendingSignerNameLabel]').last().contains(page['Nome completo']);
    cy.get('[data-testid=pendingSignedAsLabel]').last().contains(page.Status);
  },

  clickDocumentHistoricTab() {
    this.clickButton('documentHistoricTab');
  },

  hasRefusedSignature() {
    cy.get('[data-testid=refusedSignerItem]').first().contains('assinatura recusada', { matchCase: false });
  },

  refusedInfoModalActivatorIsVisible() {
    cy.get('[data-testid=refusedSignerItem]').first()
      .get('[data-testid=showRefusedInfoModalButton]')
      .should('be.visible');
  },

  refusedInfoModalActivatorClick() {
    cy.get('[data-testid=refusedSignerItem]').first()
      .get('[data-testid=showRefusedInfoModalButton]')
      .click();
  },

  refusedSignerIconIsVisible() {
    cy.get('[data-testid=refusedSignerItem]').first()
      .get('[data-testid=refusedSignerIcon]')
      .should('be.visible');
  },

  refusedCommentEquals(string) {
    cy.get('[data-testid=refusalSignatureInfoModal] [data-testid=refusalCommentField]')
      .should('have.value', string);
  },

  refusalReasonTextHidden() {
    cy.get('[data-testid=refusalSignatureInfoModal] [data-testid=refusalReasonText]')
      .contains('recusou a assinatura.', { matchCase: false });
  },

  createdDocument() {
    APIInterface.createDocumentDefault();
    documentsPage.clickDocumentsLinkMenu();
    documentsPage.verifyPageTitleIsVisible();
    const documentStatusList = {
      'Status do documento': 'Em processo',
      'Nome do documento': 'contrato.pdf',
    };
    documentsPage.verifyDocumentStatusList(documentStatusList);
  },

  shouldListSignerRubricEnabled() {
    cy.contains('Rubrica eletrônica: habilitada');
  },

};
