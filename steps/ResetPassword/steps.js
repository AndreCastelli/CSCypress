import {
  Given as Dado,
  And as E,
  Then as Então,
  When as Quando,

} from 'cypress-cucumber-preprocessor/steps';

import Page from '../../page_objects/Page';
import ResetPasswordElements from '../../elements/ResetPasswordElements';
import ForgotPasswordElements from '../../elements/ForgotPasswordElements';
import { arrayToObject } from '../../../utils/util';

const forgotPasswordPage = new Page(ForgotPasswordElements);
const ResetPasswordPage = new Page(ResetPasswordElements);
const user = Cypress.config('user');
const url = Cypress.config('baseUrl');

Dado('que eu estou na página de {string}', () => {
  cy.visit(url);
  ResetPasswordPage.forgotPasswordLink.click();
});

Quando('clico em {string}', () => {
  ResetPasswordPage.submitButton.click();
});

Quando('limpo o campo email informado', () => {
  ResetPasswordPage.emailField.clear();
});

Quando('preencho o formulário de esqueci minha senha com E-mail inválido', () => {
  ResetPasswordPage.emailField.type('clicksign{enter}');
});

E('preencho o formulário de esqueci minha senha com E-mail válido', () => {
  ResetPasswordPage.emailField.type('clicksigncypress@example.com');
});

E('clico no link {string}', () => {
  ResetPasswordPage.backToLoginLink.click();
});

Então('vejo o/a mensagem/título {string}', (TEXT) => {
  cy.contains(TEXT);
});

Dado('que eu estou na página de esqueceu a senha', () => {
  cy.visit(`${url}/reset_password/new`);
});

Quando('eu preencho o campo de email', () => {
  forgotPasswordPage.emailField.type(user.email);
});

Quando('acesso o link gerado', (params) => {
  const page = arrayToObject(params.rawTable);
  ResetPasswordPage.visitDocument(page['Assunto do email']);
});

E('preencho os campos de senha', () => {
  ResetPasswordPage.passwordField.type(user.password);
});

Então('espero estar acessando a página de login', () => {
  cy.url().should('include', '/signin');
});
