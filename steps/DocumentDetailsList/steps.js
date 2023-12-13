import {
  And as E,
  When as Quando,
  Then as Então,
} from 'cypress-cucumber-preprocessor/steps';

import { arrayToObject } from '../../../utils/util';
import showDocumentPage from '../../page_objects/showDocumentPage';
import documentDetailsListPage from '../../page_objects/documentDetailsListPage';

Quando('acesso o menu de vigencia', () => {
  documentDetailsListPage.acessdDocumentDetails();
});

Então('espero ver os detalhes no menu', (params) => {
  const page = arrayToObject(params.rawTable);
  documentDetailsListPage.checkDocumentDetail(page);
});

E('preencho o campo data do dia anterior', (params) => {
  const page = arrayToObject(params.rawTable);
  showDocumentPage.fillDocumentDetailsYesterday(page);
});

Quando('Realizo o filtro pela data informada', () => {
  documentDetailsListPage.filterDateDetail();
});

Então('espero ver os detalhes antigo no menu', (params) => {
  const page = arrayToObject(params.rawTable);
  documentDetailsListPage.checkDocumentDetail(page);
});

Então('espero ver o evento no menu', (params) => {
  const page = arrayToObject(params.rawTable);
  documentDetailsListPage.checkDocumentDetail(page);
});
