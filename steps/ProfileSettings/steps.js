import { And as E, When as Quando, Then as Então } from 'cypress-cucumber-preprocessor/steps';

import { faker } from '@faker-js/faker';

import { TOAST_MESSAGE } from '../../../utils/constants';
import ProfileSettingsElements from '../../elements/ProfileSettingsElements';
import Page from '../../page_objects/Page';

import profileSettingsNewPage from '../../page_objects/profileSettingsPage';

const profileSettingsPage = new Page(ProfileSettingsElements);
const user = Cypress.config('user');

Quando('altero o nome', () => {
  profileSettingsPage.nameInput.clear();
  profileSettingsPage.nameInput.type(faker.name.findName());
});

E('clico em "Salvar nome"', () => {
  window.reload = false;
  profileSettingsPage.saveInformationButton.click();
});

Então('verifico se o nome foi alterado com sucesso', () => {
  cy.window().should('not.have.prop', 'reload');
  cy.contains(TOAST_MESSAGE.SUCCESS.EDIT_INFORMARTION);
});

Quando('altero o nome informando valor nulo', () => {
  profileSettingsPage.nameInput.clear();
  profileSettingsPage.nameInput.type('  ');
  cy.contains(/O campo é obrigatório|O valor é obrigatório/g);
});

Quando('clico em "Alterar senha"', () => {
  window.reload = false;
  profileSettingsPage.changePasswordButton.click();
});

E('em seguida clico no botão "Cancelar"', () => {
  window.reload = false;
  profileSettingsPage.closeSection.click();
});

E('em seguida digito a senha atual', () => {
  profileSettingsPage.currentPasswordInput.type(user.password);
});

E('em seguida digito a senha atual inválida', () => {
  profileSettingsPage.currentPasswordInput.type(faker.internet.password());
});

E('crio uma nova senha', () => {
  profileSettingsPage.newPasswordInput.type(user.password);
});

E('crio uma senha com menos de oito caracteres', () => {
  profileSettingsPage.newPasswordInput.type('12345');
});

E('clico no botão "Salvar senha"', () => {
  profileSettingsPage.changePasswordAction.click();
});

Então('o botão "Salvar senha" deve estar desabilitado', () => {
  profileSettingsPage.changePasswordAction.get().should('be.disabled');
});

Então('verifico se a senha foi alterada com sucesso', () => {
  cy.contains(TOAST_MESSAGE.SUCCESS.EDIT_PASSWORD);
});

Quando('na primeira pergunta seleciono a opção "Sim. Para todos os documentos"', () => {
  profileSettingsPage.firstQuestionRadio();
});

E('na segunda pergunta seleciono "Sim. Para todos os documentos"', () => {
  profileSettingsPage.secondQuestionRadio();
});

E('clico em salvar configurações', () => {
  profileSettingsPage.saveNotificationsButton.click();
});

Então('verifico se as configurações de notificações foram alteradas com sucesso', () => {
  cy.contains(TOAST_MESSAGE.SUCCESS.EDIT_NOTIFICATION_SETTING);
});

E('estou na página de configurações de perfil', () => {
  profileSettingsPage.profileMenu.click();
  profileSettingsPage.operatorsLink.click();
  profileSettingsNewPage.verifySettingsPageTitle();
});
