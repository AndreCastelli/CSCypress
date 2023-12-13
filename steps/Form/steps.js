import {
  When as Quando,
  Then as Então,
  And as E,
} from 'cypress-cucumber-preprocessor/steps';

import { faker } from '@faker-js/faker';
import { lowerFirst, camelCase } from 'lodash';

import FormElements from '../../elements/FormElements';
import FormEditElements from '../../elements/FormEditElements';
import FormsEditElements from '../../elements/FormsEditElements';
import Page from '../../page_objects/Page';
import { arrayToObject } from '../../../utils/util';

import formsPage from '../../page_objects/formsPage';

const formPage = new Page(FormElements);
const FormEditPage = new Page(FormEditElements);
const FormsEditPage = new Page(FormsEditElements);
const FormName = faker.commerce.productName();
const FormNameEdit = faker.commerce.productName();

let name = '';

E('estou no menu formulários', () => {
  formPage.formsMenuOption.click();
});

E('clico no botão criar formulário', () => {
  formPage.createFormButton.click();
});

Quando('eu preencho o nome do formulário', () => {
  name = faker.lorem.words(3);
  formPage.formNameField.type(name);
});

E('seleciono os campos que desejo no formulário, como obrigatórios', (campos) => {
  const page = arrayToObject(campos.rawTable);
  Object.keys(page).forEach((item) => {
    formPage.selectFields(item);
  });
});

E('seleciono um campo conectado ao CEP', (campos) => {
  const page = arrayToObject(campos.rawTable);
  Object.keys(page).forEach((item) => {
    formPage.selectLinkedField(item);
  });
});

E('clico em Salvar', () => {
  formsPage.clickSaveFormButton();
});

E('volto na lista de formulários', () => {
  formPage.clickBackFormListButton();
});

Então('eu vejo na tela principal o formulário criado', () => {
  formPage.verifyTitletWithFormCreated(name);
});

E('pré-visualizo o formulário criado', () => {
  formPage.clickPreviewFormButton(name);
});

E('clico em editar o formulário criado', () => {
  cy.get(`[data-testid=${camelCase(name)}EditButton]`).first().click();
});

E('eu vejo o campo logradouro preenchido', () => {
  cy.get('[attribute_type="street"]').should('not.have.value', '');
});

E('clico em Enviar respostas', () => {
  formPage.submitAnswersButton.click();
});

E('eu vejo a mensagem de campos obrigatórios', (mensagem) => {
  const page = arrayToObject(mensagem.rawTable);
  Object.keys(page).forEach((item) => {
    formPage.assertErrorInfoMessage(item);
  });
});

E('em seguida preencho com valores inválidos para cada campo', () => {
  formPage.fillWithInvalidData();
});

E('em seguida preencho campo cep', () => {
  formPage.fillCepWithValidData();
});

Então('eu vejo a mensagem de erro específico para cada campo preenchido', (mensagens) => {
  const page = arrayToObject(mensagens.rawTable);
  Object.keys(page).forEach((item) => {
    formPage.assertErrorInfoMessage(item);
  });

  formPage.assertInvalidCepMessage();
});

E('clico em excluir formulário', () => {
  formPage.clickDeleteFormButton(name, 'formDelete');
});

Quando('clico no botão excluir da modal', () => {
  formPage.confirmationModalConfirm.click();
});

Então('não vejo mais o formulário', () => {
  formPage.assertFormDontExists(name);
});

E('que estou na listagem de formulários', () => {
  FormEditPage.formsMenuOption.click();
  cy.contains('Formulários', { timeout: 2000 });
});

Quando('clico em editar o formulário {string}', (formName) => {
  cy.get(`[data-testid=${camelCase(formName)}EditButton]`).first().click();
});

E('que tenho um formulário', () => {
  FormsEditPage.formsMenuOption.click();
  FormsEditPage.createFormButton.click();
  FormsEditPage.createForm(FormName);
  cy.contains('Sucesso! Formulário salvo.', { timeout: 2000 }).should('be.visible');
});

E('seleciono o formulário para editar', () => {
  cy.get(`[data-testid=${lowerFirst(camelCase(FormName))}EditButton]`).first().click();
  cy.get('[data-testid=formNameField]', { timeout: 2000 }).clear().type(FormNameEdit);
});

Quando('salvo alterações no formulário', () => {
  cy.get('[data-testid=saveFormSettingsButton]', { timeout: 2000 }).click();
  cy.contains('Sucesso! Formulário salvo.', { timeout: 2000 }).should('be.visible');
});

Então('vejo as alterações feitas', () => {
  cy.contains('Formulários', { timeout: 2000 });
  cy.contains(FormNameEdit, { timeout: 2000 }).should('be.visible');
});

Quando('clico em excluir formulário {string}', (Name) => {
  formPage.clickDeleteFormButton(Name, 'formDelete');
});
