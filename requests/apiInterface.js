import Requests from './Requests';

export default {
  createDocumentDefault() {
    const page = {
      'Quantidade de documentos': '1',
      Extensao: 'pdf',
      'Finalizar documento automaticamente': 'true',
      'Idioma do documento': 'pt-BR',
      'Ordenação de signatários': 'false',
    };
    Requests.createDocument(page['Quantidade de documentos'], page.Extensao, page);
  },
  createDocumentMultiplePages() {
    const page = {
      'Quantidade de documentos': '1',
      Extensao: 'pdf',
      'Finalizar documento automaticamente': 'true',
      'Idioma do documento': 'pt-BR',
      'Ordenação de signatários': 'false',
      'Arquivo real': 'pdf-multiple-pages',
    };
    Requests.createDocument(page['Quantidade de documentos'], page.Extensao, page);
  },
  createClausesInDocument() {
    Requests.creatClauses();
    Requests.linkClausesToDocument();
  },
};
