import {
  When as Quando,
  And as E,
} from 'cypress-cucumber-preprocessor/steps';

import { faker } from '@faker-js/faker';
import Page from '../../page_objects/Page';
import SignerElements from '../../elements/SignerElements';

import setupDocumentPage from '../../page_objects/setupDocumentPage';
import draftsPage from '../../page_objects/draftsPage';

const signerPage = new Page(SignerElements);

/* STEPS */

const signerData = {
  email: faker.internet.exampleEmail(),
  name: faker.name.findName(),
  auth: 'Token Via EMail',
};

E('volto para a home', () => {
  setupDocumentPage.backToHome();
});

E('clico no menu na opção rascunhos', () => {
  cy.wait(2000);
  draftsPage.goDraftstPage();
});

E('verifico se existe o rascunho criado', () => {
  draftsPage.checkFirstDraft(signerData);
});

E('deleto o rascunho', () => {
  draftsPage.deleteDraft();
});

E('verifico se o rascunho foi deletado', () => {
  draftsPage.checkDraftNotExists(signerData);
});

Quando('crio um novo signatário', () => {
  signerData.email = faker.internet.exampleEmail();
  signerPage.addRandomSignerDetails(signerData);
});
