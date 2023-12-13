import {
  When as Quando,
  Then as Então,
  And as E,
} from 'cypress-cucumber-preprocessor/steps';

import templateElements from '../../elements/TemplateElements';
import Page from '../../page_objects/Page';
import TemplatePage from '../../page_objects/templatePage';

const templatePage = new Page(templateElements);

let newTemplateName;

E('clico em Criar Modelo', () => {
  templatePage.clickCreateTemplateButton();
});

E('preencho um nome para o modelo', () => {
  newTemplateName = templatePage.getNewRandomTemplateName();
  templatePage.fillTemplateNameField(newTemplateName);
});

E('faço upload do arquivo modelo', () => {
  const fileName = 'template_sample.docx';
  const filePath = 'files/template_sample.docx';

  templatePage.attachFile(filePath, fileName);
});

Quando('clico no botão Salvar', () => {
  templatePage.clickSaveTemplateButton();
});

E('vejo o modelo na listagem', () => {
  templatePage.checkTemplateExists(newTemplateName);
});

E('crio um novo modelo', () => {
  newTemplateName = templatePage.getNewRandomTemplateName();

  const fileName = 'template_sample.docx';
  const filePath = 'files/template_sample.docx';

  templatePage.createSingleTemplate(newTemplateName, filePath, fileName);
});

E('clico em editar esse modelo', () => {
  templatePage.clickEditTemplateButton(newTemplateName);
});

E('faço alterações no modelo', () => {
  const fileName = 'template_sample_with_email.docx';
  const filePath = 'files/template_sample_with_email.docx';

  newTemplateName = templatePage.getNewRandomTemplateName();
  templatePage.fillTemplateNameField(newTemplateName);
  templatePage.attachFile(filePath, fileName);
});

E('clico em excluir esse modelo', () => {
  templatePage.clickDeleteTemplateButton(newTemplateName);
});

Quando('confirmo a exclusão no botão {string}', (text) => {
  templatePage.clickConfirmDeleteTemplateButton(text);
});

Então('vejo uma mensagem de excluído com sucesso', () => {
  cy.contains(`Modelo ${newTemplateName} excluído com sucesso.`, { timeout: 4000 });
});

E('não vejo o modelo na listagem', () => {
  templatePage.checkTemplateNotExists(newTemplateName);
});

E('clico no botão Gerar documento', () => {
  templatePage.clickGenerateDocumentButton(newTemplateName);
});

E('vejo o nome do documento já preenchido', () => {
  templatePage.documentFileNameField.get().invoke('val').should('not.be.empty');
  templatePage.documentFileNameField.get().should('have.value', newTemplateName);
});

E('adiciono as variáveis em formato json com os dados', () => {
  TemplatePage.fillDocumentVarJsonField();
});

E('clico em Gerar documento para avançar', () => {
  templatePage.clickNextStepCreateDocumentButton();
});

E('envio os documentos criados via modelo', () => {
  templatePage.sendDocumentButton.click();
});

Então('vejo o documento na listagem', () => {
  templatePage.checkDocumentCreated(newTemplateName);
});
