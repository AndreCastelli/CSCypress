import {
  Then as Então,
  When as Quando,
  And as E,
} from 'cypress-cucumber-preprocessor/steps';

import signerPage from '../../page_objects/signerPage';
import profileSettingsNewPage from '../../page_objects/profileSettingsPage';
import commonComponents from '../../page_objects/commonComponents';
import documentsPage from '../../page_objects/documentsPage';

Então('vejo a pagina do signatario completa', () => {
  signerPage.shouldSignerCompletArea();
});

Quando('acesso a área do signatário', () => {
  signerPage.openSignerAreaPage();
});

Então('vejo os termos de uso', () => {
  signerPage.shouldSignerTerms();
});

Quando('aceito os termos de uso', () => {
  signerPage.acceptSignerTerms();
});

Então('sou direcionado para a área do signatário', () => {
  signerPage.shouldSignerArea();
});

E('clico no perfil do signatario', () => {
  commonComponents.clickMenu();
  profileSettingsNewPage.clickProfileSettings();
});

Então('vejo as configurações do perfil', () => {
  profileSettingsNewPage.verifySettingsPageTitle();
});

E('clico no link para area do operador', () => {
  commonComponents.clickMenu();
  profileSettingsNewPage.clickOperatorAreaLink();
});

Então('vejo a pagina do operador', () => {
  documentsPage.shouldDocumentsPageVisible();
});

Então('vejo as informações no menu topbar', () => {
  signerPage.shouldTopBarSignerArea();
});
