import {
  Given as Dado,
  When as Quando,
  And as E,
  Then as Então,
} from 'cypress-cucumber-preprocessor/steps';

import SigninElements from '../../elements/SigninElements';
import Page from '../../page_objects/Page';
import LoginPage from '../../page_objects/LoginPage';
import accountsPage from '../../page_objects/accountsPage';

const url = Cypress.config('baseUrl');
const user = Cypress.config('user');
const signinPage = new Page(SigninElements);

/* STEPS */

Dado('que eu estou na página de login', () => {
  cy.visit(url);
});

Quando('eu preencho os email corretamente e senha errada', () => {
  signinPage.passwordField.type('1234578#$');
  signinPage.emailField.type(user.email);
});

Quando('eu preencho um email inválido', () => {
  signinPage.emailField.type(signinPage.getUserEmail());
  signinPage.passwordField.type(user.password);
});

Quando('eu preencho email e senha corretamente', () => {
  accountsPage.authenticatorAndAcessOperatorArea();
});

Quando('eu clico no link esqueci a senha', () => {
  signinPage.forgotPasswordLink.click();
});

Quando('eu clico no link Cadastre-se', () => {
  signinPage.signupLink.click();
});

E('limpo os campos preenchidos', () => {
  signinPage.emailField.clear({ force: true });
  signinPage.passwordField.clear({ force: true });
});

Quando('eu preencho os campos de login', () => {
  signinPage.emailField.type(signinPage.getUserEmail());
  signinPage.passwordField.type('foobar123');
});

Então('vejo a mensagem de valor é obrigatório nos campos do formulário', () => {
  cy.contains(/O campo é obrigatório|O valor é obrigatório/g);
});

Então('o botão de submissão fica desabilitado', () => {
  signinPage.submitButton.get({ timeout: 20000 }).should('be.disabled');
});

E('clico no botão de submissão', () => {
  signinPage.submitButton.get().should('be.visible').click();
});

Então('o login com o {string} deve estar habilitado e visivel', (buttonName) => {
  signinPage.verifyOAuth2ButtonExist(buttonName);
});

Quando('acesso plataforma contendo conta de signatario', () => {
  // insert function to accept terms in operator area
  LoginPage.authenticatedLogin();
});

Quando('acesso plataforma não contendo conta de signatario', () => {
  // insert function to delete acceptance of terms
  LoginPage.authenticatedLogin();
});

Então('vejo a lista de contas contendo a conta do signatario', () => {
  accountsPage.shouldAccountsSignerVisible();
});

Então('vejo a lista de contas não contendo a conta do signatario', () => {
  accountsPage.shouldAccountsSignerNotVisible({ timeout: 20000 });
});

Então('espero estar acessando a página de login', () => {
  cy.url().should('include', '/signin');
});

E('acesso a area do signatario', () => {
  accountsPage.clickLinkSignerArea();
});
