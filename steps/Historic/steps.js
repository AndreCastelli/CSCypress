import {
  Then as Então,
  When as Quando,
} from 'cypress-cucumber-preprocessor/steps';

import HistoricElements from '../../elements/HistoricElements';
import Page from '../../page_objects/Page';
import { arrayToObject } from '../../../utils/util';

import showDocumentPage from '../../page_objects/showDocumentPage';

const historicDocumentPage = new Page(HistoricElements);

Quando('acesso o histórico do documento', () => {
  cy.contains('Lista de signatários', { timeout: 10000, matchCase: false });
  showDocumentPage.clickDocumentHistoricTab();
  cy.contains('EVENTOS', { timeout: 10000 });
});

Então('vejo o histórico do documento', (params) => {
  const page = arrayToObject(params.rawTable);
  historicDocumentPage.logText.get().should(($logLength) => {
    expect($logLength).to.have.length(page['Quantidade de logs']);
  });
  switch (page['Informações de']) {
    default:
    case 'Criação':
      historicDocumentPage.compareDocumentCreateLog(params);
      break;
    case 'Edição':
      historicDocumentPage.compareDocumentUpdateLog(params);
      break;
    case 'Adição de signatário':
      historicDocumentPage.compareAddSignerLog(params);
      break;
    case 'Assinatura':
      historicDocumentPage.compareSignatureLog(params);
      break;
  }
});
