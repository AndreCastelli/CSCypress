import {
  When as Quando,
  Then as Então,
  And as E,
} from 'cypress-cucumber-preprocessor/steps';

import { upperFirst, camelCase } from 'lodash';
import Page from '../../page_objects/Page';
import SearchOrderedElements from '../../elements/SearchOrderedElements';
import SearchDocumentElements from '../../elements/SearchDocumentElements';
import SearchFilteredElements from '../../elements/SearchFilteredElements';

const searchOrderedElements = new Page(SearchOrderedElements);
const searchDocumentElements = new Page(SearchDocumentElements);
const searchFilteredPage = new Page(SearchFilteredElements);
const getPascalizeText = (text) => upperFirst(camelCase(text));

// TODO: Move for cypress date utils
const date = new Date();
const today = date.getDate();
const month = date.getMonth() + 1;

const getFormattedMonth = (diff) => (month < 10 ? `0${month + diff}` : month + diff);
const getFullDate = ({ diffDays = '', diffMonths = '' }) => `${date.getDate() + diffDays}/${getFormattedMonth(diffMonths)}/${date.getFullYear()}`;

Quando('pesquiso um documento por {string}', (typeDocument) => {
  searchDocumentElements.searchDocument(typeDocument);
});

E('verifico que nenhum documento foi listado', () => {
  searchDocumentElements.checkSearchResultIsEmpty();
});

Então('eu vejo que o documento é exibido na lista ao efetuar a busca com o termo {string}', (term) => {
  searchDocumentElements.checkSearchResultDocuments(term);
});

Quando('seleciono a opção {string} no campo de ordenação', (order) => {
  const pascalizeOrderText = upperFirst(camelCase(order));
  searchOrderedElements.selectOrderList(pascalizeOrderText);
});

E('pesquiso um documento pelo nome contrato.pdf', () => {
  searchDocumentElements.searchDocumentInput.type('contrato');
  searchDocumentElements.searchDocumentButton.click();
});

Então('eu vejo que o documento "contrato" exibido no primeiro item da lista', () => {
  searchOrderedElements.checkFirstDocument('contrato');
});

// TODO: Upgrade this step
Então('eu vejo que o documento mais recente é exibido no primeiro item da lista', () => {
  searchDocumentElements.checkSearchResultDocuments('contrato');
});

// TODO: Upgrade this step
Então('eu vejo que o documento mais antigo é exibido no primeiro item da lista', () => {
  searchDocumentElements.checkSearchResultDocuments('contrato');
});

Quando('escolho o filtro de {string}', (kind) => {
  const filters = {
    'CPF do signatário': 'documentation',
    Status: 'status',
    'Data de envio': 'createdAt',
    'Data de finalização': 'finishedAt',
    'Data limite de assinatura': 'deadlineAt',
  };
  searchFilteredPage.searchFilterType(filters[kind]);
});

E('digito o CPF do signatário {string}', (value) => {
  searchFilteredPage.searchFilterDocumentationInput.type(value);
});

E('seleciono o status {string}', (status) => {
  searchFilteredPage.selectFieldOption(getPascalizeText(status));
});

E('seleciono a data de hoje', () => {
  searchFilteredPage.selectDate(today);
});

E('seleciono a data 30 dias à frente', () => {
  searchFilteredPage.selectDate(today, month);
});

E('vejo que o status dos documentos da lista é {string}', (status) => {
  searchFilteredPage.checkAllDocumentsStatus(status);
});

E('vejo que o primeiro documento na lista é de hoje', () => {
  searchFilteredPage.checkFirstDocumentCreatedAtDate(
    getFullDate({ diffDays: 0, diffMonths: 0 }),
  );
});

E('vejo que o primeiro documento na lista irá expirar em 1 mês', () => {
  searchFilteredPage.checkFirstDocumentDeadlineOrFinishedDate(
    getFullDate({ diffDays: 0, diffMonths: 1 }),
  );
});

E('abro o menu de filtros no campo de busca', () => {
  searchFilteredPage.searchFilterMenuButton.click();
});

E('pesquiso um documento pelo nome contrato', () => {
  searchDocumentElements.searchDocumentInput.type('contrato');
});

Então('eu vejo que tenho resultado da busca na lista de documento', () => {
  searchDocumentElements.checkSearchResultDocuments('contrato');
});
