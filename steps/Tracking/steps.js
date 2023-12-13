import {
  When as Quando,
  Then as Então,
  And as E,
} from 'cypress-cucumber-preprocessor/steps';

import Page from '../../page_objects/Page';
import { arrayToObject } from '../../../utils/util';
import TrackingElements from '../../elements/TrackingElements';

const trackingPage = new Page(TrackingElements);

/* STEPS */

E('clico no menu na opção e-mails enviados', () => {
  trackingPage.trackingMenuOption.click();
});

E('verifico os emails rastreados para o destinatário', (params) => {
  const page = arrayToObject(params.rawTable);
  const recipientToSearch = page['Destinatário'];
  const emailTypeToSearch = page['Tipo do email'];
  const recipients = trackingPage.trackingRecipientList.get().first();
  recipients.contains(recipientToSearch);
  const emailTypes = trackingPage.trackingKindList.get().first();
  emailTypes.contains(emailTypeToSearch);
});

E('clico no input de filtro e busco por {string}', (email) => {
  cy.wait(500);
  trackingPage.trackingEmailInputFilter.type(email);
  trackingPage.trackingEmailFilterSubmitBtn.click();
});

Quando('escolho a opção {string} no filtro de {string}', (option, filter) => {
  cy.wait(500);
  trackingPage.handleFilterMenu(option, filter);
});

Então('verifico se na coluna {string} possui apenas o texto {string}', (column, text) => {
  cy.wait(2000);
  trackingPage.checkFilteredTableText(column, text);
});
