import {
  When as Quando,
  And as E,
  Then as Então,
} from 'cypress-cucumber-preprocessor/steps';

import Page from '../../page_objects/Page';
import SignupElements from '../../elements/SignupElements';
import OnboardingElements from '../../elements/OnboardingElements';

import emailConfirmationModal from '../../page_objects/Modal/emailConfirmationModal';

const signupPage = new Page(SignupElements);
const onboardingPage = new Page(OnboardingElements);

/* STEPS */

Quando('preencho os campos de cadastro', () => {
  signupPage.nameField.type(onboardingPage.getUserName());
  signupPage.emailField.type(onboardingPage.getUserEmail());
  signupPage.passwordField.type('foobar123');
});

Quando('clico no botão Pessoa Física', () => {
  onboardingPage.chooseAccountTypeModal.get().should('be.visible');
  onboardingPage.accountTypePersonalButton.get().should('be.visible');
  onboardingPage.accountTypePersonalButton.click();
});

Quando('clico no botão Pessoa Jurídica', () => {
  onboardingPage.chooseAccountTypeModal.get().should('be.visible');
  onboardingPage.accountTypeBusinessButton.get().should('be.visible');
  onboardingPage.accountTypeBusinessButton.click();
});

E('preencho todos os campos do formulário de {string}', (entityType) => {
  onboardingPage.formAccountInfoModal.get().should('be.visible');
  if (entityType === 'PJ') {
    onboardingPage.nameField.type(onboardingPage.getCompanyName());
  }
  onboardingPage.segmentSelect.get().click();
  cy.contains('Autônomo', { timeout: 2000 }).click();
  onboardingPage.documentsAmountSelect.get().click();
  cy.contains('Entre 6 e 20 documentos', { timeout: 2000 }).click();
  onboardingPage.reasonSelect.get().click();
  cy.contains('Sou pessoa desenvolvedora', { timeout: 2000 }).click();
  onboardingPage.phoneNumberField.type(onboardingPage.getPhoneNumber());
});

E('clico no botão Concluir', () => {
  onboardingPage.submitButton.get().should('be.visible');
  onboardingPage.submitButton.click();
});

Então('vejo a popup de validação de email', () => {
  emailConfirmationModal.verifyEmailValidationModalIsVisible();
});
