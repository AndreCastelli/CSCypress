import { faker } from '@faker-js/faker';

export default {
  searchDocumentInput: ['typeable'],
  searchDocumentButton: ['clickable'],
  searchDocument(typeDocument) {
    let nameDocument;
    switch (typeDocument) {
      case 'inexistente':
        nameDocument = faker.company.companyName();
        break;
      case 'existente':
        nameDocument = 'contrato';
        break;
      case 'nome do signatario':
        nameDocument = 'Maria da Silva';
        break;
      case 'email do signatario':
        nameDocument = 'clicksigncypress@gmail.com';
        break;
      default:
        cy.log(`O parâmetro ${typeDocument} é invalido!`);
    }
    this.searchDocumentInput.type(`${nameDocument}{enter}`);
  },
  checkSearchResultIsEmpty() {
    cy.contains('Nenhum resultado encontrado na busca');
    cy.contains('Experimente alterar sua pesquisa ou filtro para achar o que está procurando');
    cy.get('[data-testid=nodesEmptyList]').should('be.exist');
  },
  checkSearchResultDocuments(term) {
    cy.contains('para "', { timeout: 15000 });

    cy.get('body').then(($body) => {
      if ($body.find('[data-testid=nodeDocumentLink]').length === 1) {
        cy.contains(`1 resultado para "${term}"`);
      } else {
        cy.contains(` resultados para "${term}"`);
      }
    });
    cy.get('[data-testid=documentsRowList]').should('be.visible');
  },
};
