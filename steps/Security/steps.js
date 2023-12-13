import {
  Then as Então,
  When as Quando,
  And as E,
} from 'cypress-cucumber-preprocessor/steps';

import securityPage from '../../page_objects/securityPage';

E('clico na aba Segurança', () => {
  securityPage.accessSecurityConfiguration();
});

E('realizo upload de um arquivo {string}', (text) => {
  securityPage.uploadFile(text);
});

Então('vejo um novo campo em tela', () => {
  securityPage.verifyNewSamlAttributeGroup();
});

Quando('clico no botão de remover', () => {
  securityPage.removeAttributeClick();
});

E('clico no botão Salvar', () => {
  securityPage.saveClick();
});

Quando('digito o domínio SAML da empresa', () => {
  securityPage.typeField('providerName', 'exemplo.com.br');
});

Quando('digito um atributo SAML', () => {
  securityPage.typeField('emailSamlAttribute', 'exemplo@teste.com.br');
});

Então('vejo a mensagem {string}', (text) => {
  securityPage.checkText(text);
});

Então('não vejo a mensagem {string}', (text) => {
  securityPage.dontCheckText(text);
});

Quando('clico no botão de adicionar novo atributo', () => {
  securityPage.addAttributeClick();
});

E('o botão de adicionar novo atributo fica {string}', (text) => {
  if (text === 'habilitado') {
    securityPage.verifyNewAttributeStatus(true);
    return;
  }
  securityPage.verifyNewAttributeStatus(false);
});
