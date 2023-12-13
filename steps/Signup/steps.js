import {
  When as Quando,
  And as E,
  Then as Então,
  Given as Dado,
} from 'cypress-cucumber-preprocessor/steps';

import Page from '../../page_objects/Page';
import onboardingPage from '../../page_objects/onboardingPage';
import SignupElements from '../../elements/SignupElements';

const url = Cypress.config('baseUrl');
const signupPage = new Page(SignupElements);
const user = Cypress.config('user');

/* STEPS */

Dado('que sou um novo usuário operador', () => {
  onboardingPage.fillCredentialsInformationsOnboarding();
  onboardingPage.verifyAccountInformationsOnboardingModal();
  onboardingPage.fillAccountInformationsOnboarding();
});

Quando('eu preencho os campos de cadastro', () => {
  signupPage.nameField.type(signupPage.getUserName());
  signupPage.emailField.type(signupPage.getUserEmail());
  signupPage.passwordField.type('foobar123');
  signupPage.acceptTermsCheckbox();
});

Então('o botão de submissão fica desabilitado', () => {
  signupPage.submitButton.get({ timeout: 20000 }).should('be.disabled');
});

E('altero o e-mail para um já cadastrado na base', () => {
  signupPage.emailField.clear();
  signupPage.emailField.type(user.email);
});

Quando('eu clico novamente no link que recebi na minha caixa de email', () => {
  signupPage.visitLink(user.email, url);
});

Quando('eu preencho o campo de senha com {string}', (password) => {
  signupPage.passwordField.type(password);
});

E('apago os dados digitados', () => {
  signupPage.nameField.clear();
  signupPage.emailField.clear();
  signupPage.passwordField.clear();
});

Então('vejo a mensagem {string} nos campos do formulário', (message) => {
  cy.get(`small:contains(${message})`).should('have.length', 3);
});

E('informo um valor inferior a 8 caracteres no campo senha', () => {
  signupPage.passwordField.clear();
  signupPage.passwordField.type('1234567');
});

Então('o login com o {string} deve estar habilitado e visivel', (buttonName) => {
  signupPage.verifyOAuth2ButtonExist(buttonName);
});
