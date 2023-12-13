import {
  Given as Dado,
  When as Quando,
  Then as Então,
  And as E,
} from 'cypress-cucumber-preprocessor/steps';

import { faker } from '@faker-js/faker';

import setupDocumentPageNew from '../../page_objects/setupDocumentPage';
import documentsPageNew from '../../page_objects/documentsPage';
import commonComponents from '../../page_objects/commonComponents';
import accountsPage from '../../page_objects/accountsPage';

const folderName = faker.random.words();

/* STEPS */

E('altero a pasta para uma pasta nova criada', () => {
  setupDocumentPageNew.createAndSelectNewFolderInDocumentSetup(folderName);
});

E('verifico se estou na pasta criada', () => {
  cy.contains(folderName);
});

E('clico no botão {string}', (text) => {
  cy.wait(3000);
  cy.contains(text).click();
});

Então('vejo os {string} documentos criados', (quant) => {
  documentsPageNew.checkDocumentsInList(quant);
});

Quando('adiciono um signatário com a recusa permitida', () => {
  setupDocumentPageNew.clickRefusalCheckbox();
  commonComponents.saveSelectSignAs(['Assinar como testemunha']);
});

Então('visualizo que aquele signatário pode recusar', () => {
  cy.contains('Recusa de assinatura: habilitada');
});

Quando('adiciono um signatário sem a permissão de recusa', () => {
  commonComponents.saveSelectSignAs(['Assinar como testemunha']);
});

Então('visualizo que aquele signatário não pode recusar', () => {
  cy.contains('Recusa de assinatura: permitido').should('have.length', 0);
});

Dado('que estou na página inicial do setup do documento', () => {
  setupDocumentPageNew.checkOnTheDocumentSetupHomepage();
});

Quando('faço upload de um documento adicionando um signatário', () => {
  const qtDocs = '1';
  setupDocumentPageNew.setupDefaultDocumentWithDefaultSigner(qtDocs);
});

Quando('faço upload de {string} documentos adicionando um signatário', (qtDocs) => {
  setupDocumentPageNew.setupDefaultDocumentWithDefaultSigner(qtDocs);
});

Quando('estou na etapa de configurações do documento', () => {
  const qtDocs = '1';
  setupDocumentPageNew.uploadDocumentStep(qtDocs);
  setupDocumentPageNew.addSignerDefaultToDocument();
  setupDocumentPageNew.configureDocument('pt-BR');
});

Dado('que acesso a etapa de listagem dos signatários do documento', () => {
  setupDocumentPageNew.goSignersListStepSetupDocumentPage();
});

Quando('preencho dados de signatário com método de envio via whatsapp', () => {
  commonComponents.clickAddSignerButton();
  commonComponents.selectSignerCommunicateBy('WhatsApp');
});

Quando('estou no passo de mensagem e envio', () => {
  commonComponents.clickNextStepBtn();
  commonComponents.clickNextStepBtn();
});

E('vejo a caixa de texto desabilitada', () => {
  setupDocumentPageNew.shouldMessageTextBoxBeDisabled();
});

E('vejo a caixa de texto habilitada', () => {
  setupDocumentPageNew.shouldMessageTextBoxBeEnabled();
});

E('adiciono um signatário com método de envio via WhatsApp', () => {
  setupDocumentPageNew.addSignerWithWhatsappToDocument();
});

E('adiciono um signatário com método de envio via e-mail', () => {
  setupDocumentPageNew.addSignerWithEmailToDocument();
});

E('adiciono um signatário com método de envio via WhatsApp autenticação Pix', () => {
  setupDocumentPageNew.addSignerWithWhatsappToDocument({
    'Autenticação obrigatória': 'Pix Cpf Obrigatório',
  });
});

E('adiciono um signatário com método de envio via WhatsApp autenticação Certificado Digital', () => {
  setupDocumentPageNew.disableWidgetEmbeddedWarning();
  setupDocumentPageNew.addSignerWithWhatsappToDocument({
    'Autenticação obrigatória': 'Certificado Digital Cpf Obrigatório',
  });
});

Então('vejo que {int} signatários estão na lista para assinar o documento', (signersCount) => {
  setupDocumentPageNew.shouldHaveSignersCountEqual(signersCount);
});

Quando('avanço até a etapa de configurações', () => {
  commonComponents.clickNextStepBtn();
});

Então('não vejo a seção de lembretes automáticos', () => {
  setupDocumentPageNew.shouldAutoRemindSectionVisible();
});

Então('vejo a mensagem que documentos enviados via whatsapp não receberão lembretes', () => {
  setupDocumentPageNew.shouldBeAutoRemindWhatsappText();
});

Então('vejo a mensagem de lembretes automáticos', () => {
  setupDocumentPageNew.shouldBeAutoRemindDefaultText();
});

Então('vejo que opção de salvar na agenda está habilitada', () => {
  commonComponents.checkSaveAsContactEnabled();
});

Quando('adiciono um novo signátio com autenticação PIX', () => {
  const signerData = {
    Email: 'clicksigncypress@gmail.com',
    'Nome completo': 'Maria da Silva',
    'Autenticação obrigatória': 'Pix Cpf Obrigatório',
    cpf: '98182846072',
    'Data de nascimento': '04041995',
    'Assinar como': ['Assinar'],
  };
  commonComponents.addSignerToDocument(signerData);
});

Então('visualizo a opção de bloquear após recusa habilitada', () => {
  setupDocumentPageNew.checkBlockOnRefusalVisible();
  setupDocumentPageNew.checkBlockOnRefusalEnable();
});

E('aciono a opção de não bloquear após recusa', () => {
  setupDocumentPageNew.uncheckBlockOnRefusalCheckbox();
});

Então('visualizo checkbox desabilitado', () => {
  setupDocumentPageNew.checkBlockOnRefusalVisible();
  setupDocumentPageNew.checkBlockOnRefusalDisable();
});

E('salvo o documento com sucesso', () => {
  setupDocumentPageNew.sendDocument();
});

E('marco que o signatário pode rubricar', () => {
  setupDocumentPageNew.clickRubricCheckbox();
});

Então('vejo a opção de rubrica selecionada', () => {
  setupDocumentPageNew.checkRubricCheckboxEnable();
});

E('desmarco que o signatário pode rubricar', () => {
  setupDocumentPageNew.clickRubricCheckbox();
  setupDocumentPageNew.clickRubricCheckbox();
});

Então('vejo a opção de rubrica desmarcada', () => {
  setupDocumentPageNew.checkRubricCheckboxDisable();
});

Então('vejo a etapa de rubrica eletrônica', () => {
  setupDocumentPageNew.shouldConfirmStageRubric();
});

Então('vejo a opção de não pedir confirmação de leitura neste documento selecionada', () => {
  setupDocumentPageNew.shouldOptionNoConfirmReadDocumentVisible();
  setupDocumentPageNew.shouldOptionNoConfirmReadDocumentEnabled();
});

Quando('clico no botão avançar da etapa de rubrica', () => {
  setupDocumentPageNew.nextStepRubric();
});

Então('vejo a tela de configurações', () => {
  setupDocumentPageNew.shouldStepConfiguration();
});

E('seleciono na etapa de rubrica eletrônica a opção Confirmação de leitura do documento', () => {
  setupDocumentPageNew.clickOptionConfirmReadDocumentClauses();
  setupDocumentPageNew.nextStepRubric();
});

Então('vejo a opção de Confirmação de leitura do documento selecionada', () => {
  setupDocumentPageNew.shouldOptionConfirmReadDocumentVisible();
});

Quando('seleciono na etapa de rubrica eletrônica a opção Confirmação de leitura do documento e rubrica de cláusulas específicas', () => {
  setupDocumentPageNew.clickOptionConfirmReadDocumentClauses();
});

Então('vejo a opção Confirmação de leitura do documento e rubrica de cláusulas específicas selecionada', () => {
  setupDocumentPageNew.shouldOptionConfirmReadClausesDocumentVisible();
  setupDocumentPageNew.shouldOptionConfirmReadDocumentClausesEnabled();
});

Quando('configuro a confirmação de leitura do documento da rubrica eletrônica', () => {
  setupDocumentPageNew.clickOptionConfirmReadDocumentClauses();
  setupDocumentPageNew.nextStepRubric();
  setupDocumentPageNew.selectOptionConfirmation();
  setupDocumentPageNew.nextStepRubric();
  cy.wait(300);
  setupDocumentPageNew.clickNextSendDocuments();
});

Então('consigo enviar os documentos para assinatura', () => {
  setupDocumentPageNew.shouldSendMessageDocuments();
});

Quando('configuro a confirmação de leitura do documento e rubrica de clausulas especificas', () => {
  setupDocumentPageNew.clickOptionConfirmReadDocumentClauses();
  setupDocumentPageNew.nextStepRubric();
  setupDocumentPageNew.clickOptionAddClauses();
  setupDocumentPageNew.configurationInsertConfirmReadDocumentClauses();
  setupDocumentPageNew.nextStepRubric();
  setupDocumentPageNew.confirmClausesWarning();
  cy.wait(300);
  setupDocumentPageNew.clickNextSendDocuments();
});

// fluxo de criação de um documento até a etapa de rubrica//Em Andamento//
Dado('que estou no setup de documento', () => {
  // todo falta finalizar
  accountsPage.authenticatorAndAcessOperatorArea();
  documentsPageNew.documentsLink.click();
  documentsPageNew.pageTitle.should('be.visible');
  setupDocumentPageNew.shouldDraft();
});

Quando('adiciono três cláusulas', () => {
  setupDocumentPageNew.clickOptionConfirmReadDocumentClauses();
  setupDocumentPageNew.nextStepRubric();
  setupDocumentPageNew.clickOptionAddClauses();
  setupDocumentPageNew.addMaxClausules(2);
});

Então('vejo as clausulas adicionadas', () => {
  setupDocumentPageNew.shouldAddMaxClausules();
  setupDocumentPageNew.nextStepRubric();
  setupDocumentPageNew.confirmClausesWarning();
  cy.wait(300);
  setupDocumentPageNew.clickNextSendDocuments();
});

Quando('clico em remover cláusula', () => {
  setupDocumentPageNew.clickOptionConfirmReadDocumentClauses();
  setupDocumentPageNew.nextStepRubric();
  setupDocumentPageNew.clickOptionAddClauses();
  setupDocumentPageNew.configurationInsertConfirmReadDocumentClauses();
  setupDocumentPageNew.clickRemoveClauses();
});

Então('vejo que a clausula foi removida', () => {
  setupDocumentPageNew.shouldAddClausulesVisible();
});

Quando('clico em adicionar clausula', () => {
  setupDocumentPageNew.clickOptionConfirmReadDocumentClauses();
  setupDocumentPageNew.nextStepRubric();
  setupDocumentPageNew.clickOptionAddClauses();
  setupDocumentPageNew.configurationInsertConfirmReadDocumentClauses();
});

Então('vejo a opção de visualizar documento', () => {
  setupDocumentPageNew.shouldReadDocumentVisibled();
});

E('clico para visualizar o documento', () => {
  setupDocumentPageNew.clickReadDocumentVisibled();
});

Então('vejo o documento', () => {
  setupDocumentPageNew.shouldClickReadDocument();
});

E('clico em voltar', () => {
  setupDocumentPageNew.clickBackRubricClauses();
});

Então('vejo a etapa de configuração de rubrica', () => {
  setupDocumentPageNew.shouldBackRubricClausesVisibled();
});

Então('vejo o checkbox com a lista de documento adicionados', () => {
  setupDocumentPageNew.shouldDocumentsCheckbox();
  setupDocumentPageNew.listDraftDocuments();
});

E('seleciono um dos documentos para o signatário', () => {
  setupDocumentPageNew.selectDocumentsDraftList();
  setupDocumentPageNew.listDraftDocuments();
});

Então('vejo apenas o documento selecionado para o signatário', () => {
  setupDocumentPageNew.shouldQtdDocumentsList();
});

E('não seleciono documentos para o signatário', () => {
  setupDocumentPageNew.noSelectDocumentsDraftList();
  setupDocumentPageNew.listDraftDocuments();
});

Então('vejo a mensagem de validação de documentos', () => {
  setupDocumentPageNew.shouldDocumentsNoSelectSigner();
});

E('seleciono para expandir as informações do signatário', () => {
  setupDocumentPageNew.clickSignerInformationDetails();
});

Então('vejo o detalhamento das informações do signatário', () => {
  setupDocumentPageNew.shouldSignerInformationDetails();
});

E('clico para ordenar signatários', () => {
  setupDocumentPageNew.clickOrderSigner();
});

Então('vejo a mensagem de ordenação indisponivel com os motivos', () => {
  setupDocumentPageNew.shouldModalOrderSubscription();
});
