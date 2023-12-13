import {
  When as Quando,
  And as E,
  Then as Então,
} from 'cypress-cucumber-preprocessor/steps';

import { lowerFirst, camelCase } from 'lodash';
import { faker } from '@faker-js/faker';
import ContactsListElements from '../../elements/ContactsListElements';
import Page from '../../page_objects/Page';
import commonComponents from '../../page_objects/commonComponents';

const ContactListPage = new Page(ContactsListElements);

const FakeName = faker.name.findName();
const FakeEmail = faker.internet.email();
const FakeNameEdit = faker.name.findName();

E('estou na página de Agenda', () => {
  ContactListPage.contactsListLink.click();
  cy.contains('Agenda', { timeout: 2000 });
});

Quando('abro a modal de adicionar contatos', () => {
  ContactListPage.addContactButton.click();
});

Então('clico em salvar', () => {
  cy.get('[data-testid=saveContactButton]').click({ multiple: true, force: true });
});

Então('vejo a mensagem {string} nos campos Email e autenticação obrigatória', (text) => {
  cy.wait(2000);
  cy.contains(text, { timeout: 2000, force: true }).should('be.ok');
});

E('preencho o formulário de novo contato', () => {
  commonComponents.addSignerDetails({
    Email: FakeEmail,
    'Nome completo': FakeName,
    'Autenticação obrigatória': 'Token via E-mail',
    'Salvar na agenda': 'Desabilitado',
  });
  cy.get('[data-testid=addContactButton]').click({ force: true });
});

Então('vejo o contato editado na listagem de contatos', () => {
  cy.wait(3000);
  cy.contains(FakeNameEdit, { timeout: 2000 }).should('exist');
});

E('possuo um contato na lista', () => {
  cy.wait(3000);
  commonComponents.shouldHaveContactInTable(FakeName);
});

E('possuo um contato editado na lista', () => {
  cy.wait(3000);
  commonComponents.shouldHaveContactInTable(FakeNameEdit);
});

E('seleciono o contato para editar', () => {
  cy.wait(3000);
  cy.get(`[data-testid=${lowerFirst(camelCase(FakeName))}EditButton]`, { timeout: 2000 }).click();
});

Então('vejo os dados esperados do contato', () => {
  cy.contains(FakeEmail, { timeout: 2000 }).should('be.visible');
  cy.contains(FakeName, { timeout: 2000 }).should('be.visible');
});

Quando('salvo as alterações dos dados cadastrados', () => {
  cy.get('[data-testid=signerNameField]').first().clear().type(FakeNameEdit);
  cy.get('[data-testid=saveContactButton]').first().click({ force: true });
});

Então('vejo o contato na listagem de contatos', () => {
  cy.wait(3000);
  cy.contains(FakeNameEdit, { timeout: 2000 }).should('be.ok');
});

E('seleciono o contato alterado para editar', () => {
  cy.wait(3000);
  cy.get(`[data-testid=${lowerFirst(camelCase(FakeNameEdit))}EditButton]`, { timeout: 2000 }).click();
});

E('vejo os novos dados esperados do contato', () => {
  cy.contains(FakeNameEdit, { timeout: 2000 }).should('be.visible');
});

E('seleciono o contato para remoção', () => {
  cy.get(`[data-testid=${lowerFirst(camelCase(FakeNameEdit))}Checkbox]`, { timeout: 2000 }).click();
  ContactListPage.removeContactButton.click();
});

Quando('vejo a modal de titulo {string}', (text) => {
  cy.contains(text, { timeout: 2000 }).should('be.visible');
});

Então('não vejo o contato na listagem de contatos', () => {
  cy.contains(FakeNameEdit, { timeout: 2000 }).should('not.exist');
});

E('clico em Excluir', () => {
  ContactListPage.deleteButton.click();
});
