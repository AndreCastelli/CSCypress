import { camelCase } from 'lodash';
import documentsPage from './documentsPage';
import { TEXT_SETUP_DOCUMENT } from '../../utils/constants';

import commonComponents from './commonComponents';

export default {

  clickButton(id, options) {
    cy.get(`[data-testid=${id}]`).click(options);
  },

  selectValue(id, value) {
    cy.get(`[data-testid=${id}]`, { timeout: 20000 }).select(value);
  },

  selectOption(select, option) {
    const optionDataTestId = camelCase(
      `selectField ${option} Option`,
    );
    cy.get(`[data-testid=${select}]`, { timeout: 3000 }).click();
    cy.get(`[data-testid=menuContent] [data-testid=${optionDataTestId}]:visible`, { timeout: 3000 }).click();
  },

  shouldBe(id, should, value, options) {
    cy.get(`[data-testid=${id}]`, options).should(should, value);
  },

  typeField(dataTestId, value) {
    cy.get(`[data-testid=${dataTestId}]`).type(value);
  },

  clickNextStepBtn() {
    cy.get('[data-testid=nextStepBtn]').first().click();
  },

  clickRefusalCheckbox() {
    this.clickButton('refusalCheckbox');
  },

  clickRubricCheckbox() {
    this.clickButton('rubricCheckbox');
  },

  disableWidgetEmbeddedWarning() {
    cy.window().then(() => {
      sessionStorage.setItem('widgetEmbeddedWarning', 'true');
    });
  },

  goSetupDocumentPage() {
    documentsPage.goDocumentsPage();
    documentsPage.clickCreateNewDocumentButton();
  },

  goSignersListStepSetupDocumentPage() {
    this.uploadDocumentStep('1');
    commonComponents.clickNextStepBtn();
  },

  checkOnTheDocumentSetupHomepage() {
    this.goSetupDocumentPage();
    cy.contains('Adicionar documentos');
    cy.contains('Adicionar signatários');
  },

  attachPDFFile(qtdDocs, fileName = 'contrato', type = 'pdf') {
    const paths = Array(Number(qtdDocs)).fill(`files/${fileName}.${type}`);
    cy.get('[data-testid=uploadFileDropzone]').attachFile(paths, { subjectType: 'drag-n-drop' });
  },

  checkNumberOfDocumentsInTheList(qtdDocs) {
    this.shouldBe('archiveList', 'have.length', qtdDocs);
  },

  clickSendDocumentsButton() {
    this.clickButton('sendDocumentsButton');
  },

  uploadDocumentStep(qtdDocs) {
    this.attachPDFFile(qtdDocs);
    this.checkNumberOfDocumentsInTheList(qtdDocs);
  },

  shouldAutoRemindSectionVisible() {
    this.shouldBe('autoRemindSection', 'not.be.visible');
  },

  shouldBeAutoRemindWhatsappText() {
    cy.contains(TEXT_SETUP_DOCUMENT.AUTO_REMIND.WHATSAPP_WARNING);
  },

  shouldBeAutoRemindDefaultText() {
    cy.contains(TEXT_SETUP_DOCUMENT.AUTO_REMIND.WHATSAPP_WARNING).should('not.be.visible');
    cy.contains(TEXT_SETUP_DOCUMENT.AUTO_REMIND.DEFAULT_TEXT);
  },

  setupDefaultDocumentWithDefaultSigner(qtdDocs = 1) {
    this.uploadDocumentStep(qtdDocs);
    this.addSignerDefaultToDocument();
    this.configureDocument('pt-BR');
    this.clickNextStepBtn();
  },

  addSignerDefaultToDocument() {
    const signerDefault = {
      Email: 'clicksigncypress@gmail.com',
      'Autenticação obrigatória': 'Token via e-mail',
      'Nome completo': 'Alice da Silva',
      'Assinar como': ['Assinar'],
    };
    commonComponents.clickNextStepBtn();
    commonComponents.addSignerToDocument(signerDefault);
    commonComponents.clickNextStepBtn();
  },

  shouldMessageTextBoxBeDisabled() {
    cy.get('[data-testid=documentMessageField]').should('be.disabled');
  },

  shouldMessageTextBoxBeEnabled() {
    cy.get('[data-testid=documentMessageField]').should('not.be.disabled');
  },

  addSignerWithWhatsappToDocument(params = {}) {
    const signer = {
      Email: 'clicksigncypress@gmail.com',
      'Autenticação obrigatória': 'Token via WhatsApp',
      'Nome completo': 'Alice da Silva',
      'Assinar como': ['Assinar'],
      'Método de envio': 'WhatsApp',
      'Número de telefone': '8299999999',
      cpf: '98182846072',
      'Data de nascimento': '04041995',
    };

    commonComponents.addSignerToDocument({ ...signer, ...params });
  },

  addSignerWithEmailToDocument() {
    const signer = {
      Email: 'clicksigncypress@gmail.com',
      'Autenticação obrigatória': 'Token via e-mail',
      'Nome completo': 'Alice da Silva',
      'Assinar como': ['Assinar'],
      'Método de envio': 'e-mail',
    };
    commonComponents.addSignerToDocument(signer);
  },

  deadlineNotEmpty() {
    cy.get('[data-testid=deadlineAtField').invoke('val').should('not.be.empty');
  },

  selectLocaleDocumentField(locale) {
    cy.get('[data-testid=localeDocumentField]').then(($el) => {
      if ($el.is('select')) this.selectValue('localeDocumentField', locale);
      else {
        this.selectOption('localeDocumentField', locale.replace('-', ' ') || locale);
      }
    });
  },

  configureDocument(locale) {
    this.deadlineNotEmpty();
    this.selectLocaleDocumentField(locale);
  },

  checkBlockOnRefusalVisible() {
    this.shouldBe('blockOnRefusalCheckbox', 'be.visible');
  },
  checkBlockOnRefusalEnable() {
    this.shouldBe('blockOnRefusalCheckbox', 'be.checked');
  },
  uncheckBlockOnRefusalCheckbox() {
    cy.get('[data-testid=blockOnRefusalCheckbox]').uncheck({ force: true });
  },
  checkBlockOnRefusalDisable() {
    this.shouldBe('blockOnRefusalCheckbox', 'not.be.checked');
  },
  checkRubricCheckboxDisable() {
    cy.get('[data-testid=rubricCheckbox] input').invoke('val').should('eq', 'false');
  },
  checkRubricCheckboxEnable() {
    cy.get('[data-testid=rubricCheckbox] input').invoke('val').should('eq', 'true');
  },
  sendDocument() {
    this.clickNextStepBtn();
    this.verifyMessageText('');
    this.clickSendDocumentsButton();
  },

  verifyMessageText(text) {
    cy.get('[data-testid=documentMessageField').invoke('val').should('eq', text);
  },

  // Função para veriicar a etapa de rubrica
  shouldConfirmStageRubric() {
    cy.contains('Rubrica eletrônica');
    cy.contains('Precisa adicionar Rubrica eletrônica?');
  },

  // validar opção visivel de não pedir confirmação
  shouldOptionNoConfirmReadDocumentVisible() {
    this.shouldBe('notReadDocumentRadioButton', 'be.visible');
    cy.contains(TEXT_SETUP_DOCUMENT.RUBRIC_STEP.RUBRIC_OPTIONS.NOT_CONFIRM_READ);
  },

  // validar opção visivel de pedir confirmação e clausulas
  shouldOptionConfirmReadClausesDocumentVisible() {
    this.shouldBe('addClausesRadioButton', 'be.visible');
    cy.contains(TEXT_SETUP_DOCUMENT.RUBRIC_STEP.RUBRIC_OPTIONS.CONFIRM_READ_CLAUSES);
  },

  // validando se opção "Não pedir confirmação de leitura neste documento" esta selecionada
  shouldOptionNoConfirmReadDocumentEnabled() {
    cy.get('[data-testid="notReadDocumentRadioButton"]').should('be.enabled');
  },

  // validando se opção "confirmação de leitura neste documento" esta selecionada
  shouldOptionConfirmReadDocumentEnabled() {
    cy.get('[data-testid="addReadDocumentRadioButton"]').should('be.enabled');
  },

  // validando se opção "confirmação de leitura neste documento" esta selecionada
  shouldOptionConfirmReadDocumentClausesEnabled() {
    cy.get('[data-testid="addClausesRadioButton"]').should('be.enabled');
  },

  // Clicando no botão de "Não pedir confirmação de leitura neste documento"
  clickOptionNoConfirmReadDocument() {
    this.clickButton('notReadDocumentRadioButton');
  },

  // Clicando no botão de "confirmação de leitura neste documento"
  clickOptionConfirmReadDocument() {
    this.clickButton('addReadDocumentRadioButton');
  },

  // Clicando no botão de "confirmação de leitura neste documento com clausulas"
  clickOptionConfirmReadDocumentClauses() {
    this.clickButton('addClausesRadioButton');
  },

  // validando que estou em rascunho
  shouldDraft() {
    cy.contains('Adicionar documentos');
    cy.contains('Adicionar signatários');
  },

  // Avançando na tela de rubrica
  nextStepRubric() {
    cy.get('[data-testid="nextStepBtn"]').click();
  },

  // Validar seleção dos documentos necessarios para envio de Lote
  selectDocumentsLoteRubric() {
    cy.get('[data-testid="rubricClauseArchivesSelect"]').click();
    cy.get('[data-testid="selectFieldContratoPdfOption"]').click();
    cy.get('[data-testid="rubricClauseArchivesSelect"]').click();
    cy.get('[data-testid="nextStepBtn"] > .content_1WMw1').click();
  },

  // Validando e configurando tela de confirmação com clausulas
  configurationInsertConfirmReadDocumentClauses() {
    cy.contains('O título e o conteúdo da cláusula serão exibidos no Log do documento');
    cy.contains('Texto da cláusula');
    cy.get('[data-testid="rubricClauseTitle"]').type('Teste Clausulas 1');
    cy.get('[data-testid="rubricClauseDrafListIds"]').first().click();
    cy.get('[data-testid="selectFieldAliceDaSilvaOption"]').filter(':visible').first().click();
    cy.get('[data-testid="rubricClauseDescription"]').type('Teste de inserção de cláusulas 1');
  },
  // adiconando maximo de clausulas
  addMaxClausules(qtd) {
    const clauseDataTestId = [
      '[data-testid="rubricClauseSection"]',
      '[data-testid="rubricClauseSection"] > :nth-child(4)',
      '[data-testid="rubricClauseSection"] > :nth-child(5)',
    ];
    for (let i = 0; i <= qtd; i += 1) {
      cy.get(clauseDataTestId[i])
        .find('[data-testid="rubricClauseTitle"]')
        .type(`Teste Clausulas ${i}`);
      cy.get(clauseDataTestId[i])
        .find('[data-testid="rubricClauseDrafListIds"]')
        .click();
      cy.get('[data-testid="selectFieldAliceDaSilvaOption"]')
        .filter(':visible')
        .first()
        .click();
      cy.get(clauseDataTestId[i])
        .find('[data-testid="rubricClauseDescription"]')
        .type(`Teste de inserção de cláusulas ${i}`);
      if (i < qtd) { this.clickOptionAddClauses(); }
    }
  },

  // clicando em adicionar clausulas
  clickOptionAddClauses() {
    cy.get('[data-testid="addClauseButton"]').click();
  },
  // validando maximo de clausulas adicionadas
  shouldAddMaxClausules() {
    cy.get('[data-testid="rubricClauseTitle"]').should('have.length', 3);
    cy.get('[data-testid="addClauseButton"]').should('have.length', 0);
  },

  // Validando remover clausula
  clickRemoveClauses() {
    cy.get('[data-testid="removeClauseButton"]').first().click();
  },

  // Avançar para envio de documento
  clickNextSendDocuments() {
    cy.wait(3000);
    cy.get('[data-testid="nextStepBtn"]').click();
  },

  // validando clausulas para adicionar
  shouldAddClausulesVisible() {
    cy.get('[data-testid="addClauseButton"]').should('be.visible');
    cy.get('[data-testid="removeClauseButton"]').should('have.length', 0);
  },

  // Selecionando signatario na opção de confirmação
  selectOptionConfirmation() {
    cy.get('[data-testid="rubricClauseDrafListIds"]').last().click();
    cy.get('[data-testid="selectFieldAliceDaSilvaOption"]').filter(':visible').last().click();
    cy.get('[data-testid="rubricClauseDrafListIds"]').last().click();
  },

  // validar tela de configurações
  shouldStepConfiguration() {
    cy.contains('Configurações');
  },

  backToHome() {
    this.shouldBe('backToHomeButton', 'be.visible');
    this.clickButton('backToHomeButton');
  },

  // Verificando mensagem de envio de documento
  shouldSendMessageDocuments() {
    cy.contains(
      'Esta mensagem irá para todos os signatários. Se a mensagem for respondida, será encaminhada diretamente para o seu e-mail.',
    );
  },
  // Valida botão de visualizar doc
  shouldReadDocumentVisibled() {
    cy.get('[data-testid="showDocumentButton"]').should('be.visible');
  },

  // clicando para visualizar documento
  clickReadDocumentVisibled() {
    cy.get('[data-testid="showDocumentButton"]').click();
  },

  // valida tela de visualizar documento
  shouldClickReadDocument() {
    cy.contains('Baixar');
    cy.contains('contrato.pdf');
    cy.contains('Página');
  },

  // Valida voltar pra tela de configuração de rubrica
  clickBackRubricClauses() {
    cy.get('[data-testid="backLinkButton"]').click();
  },
  // validar tela quando clicado no boltão voltar em visualizar documento
  shouldBackRubricClausesVisibled() {
    cy.contains('Cláusulas para rubricar');
  },

  shouldHaveSignersCountEqual(count) {
    cy.get('[data-testid=signerListInfo]').should('have.length', count);
  },

  clickChangeFolderButton() {
    this.clickButton('changeFolderButton');
  },

  createNewFolder(folderName) {
    this.clickButton('nodeFolderDocumentosLabel');
    this.clickButton('newFolderModalButton');
    this.typeField('newFolderModalInput', folderName);
    this.clickButton('confirmNewFolderButton');
  },

  createAndSelectNewFolderInDocumentSetup(folderName) {
    this.clickButton('changeFolderButton');
    this.createNewFolder(folderName);
    this.selectFolder(folderName);
  },

  selectFolder(folderName) {
    const folderTestId = camelCase(`nodeFolder ${folderName} Label`);
    this.clickButton(folderTestId);
    this.clickButton('submitSelectedFolderButton');
    cy.contains(folderName);
  },

  confirmClausesWarning() {
    cy.get('[data-testid="confirmClausesCheckbox"]').click();
    cy.get('[data-testid="confirmClausesButton"]').click();
  },

  shouldDocumentsCheckbox() {
    cy.get('[data-testid=draftAllDocumentsCheckbox]').should('be.visible');
    cy.get('[data-testid=draftAllDocumentsCheckbox]').first().click();
  },

  listDraftDocuments() {
    cy.get('[data-testid="draftDocumentsSelect"]').should('be.visible');
    cy.get('[data-testid="draftDocumentsSelect"]').first().click();
  },

  selectDocumentsDraftList() {
    cy.get('[data-testid^=selectField]:first-of-type').filter(':visible').first().click();
  },

  noSelectDocumentsDraftList() {
    cy.get('[data-testid^=selectField]:first-of-type').filter(':visible').first().click();
    cy.get('[data-testid^=selectField]:first-of-type').filter(':visible').last().click();
  },

  shouldQtdDocumentsList() {
    cy.get('[data-testid="draftDocumentsSelect"]').first().should('have.length', 1);
  },

  shouldDocumentsNoSelectSigner() {
    cy.get('[data-testid="draftDocumentsSelect"]').first().should('contain', 'Selecione...');
    cy.contains('Selecione pelo menos um documento');
  },

  clickSignerInformationDetails() {
    cy.get('[data-testid="drafSignerListItemCollapseButton"]').first().click();
  },

  shouldSignerInformationDetails() {
    cy.contains('Envio via: E-mail');
    cy.contains('Autenticar usando: Token via SMS');
    cy.contains('E-mail: clicksigncypress@gmail.com');
    cy.contains('CPF: 981.828.460-72');
    cy.contains('Data de nascimento: 04/04/1995');
    cy.contains('Número do celular: (99) 9 9999-9999');
  },

  clickOrderSigner() {
    cy.get('[data-testid="orderSubscriptionButton"]').click();
  },

  shouldModalOrderSubscription() {
    cy.get('[data-testid="modal-backdrop"][style=""] >').should('be.visible');
    cy.get('[data-testid="modal-backdrop"][style=""] >').should('contain', 'Ordenação indisponível');
  },

};
