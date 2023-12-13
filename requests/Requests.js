import requests from './requestMethods';
import routes from '../routes';

let documentKeys = [];
let signerKey = '';
let requestSignatureKey = '';
let documentUrl = '';
let listKey = '';
const clausesId = [];
const signerEmail = Cypress.config('signerEmail');

export default {
  createDocument(numDocuments, extension, params, folderName = '/cypress/', newFilename = '') {
    const endpoint = routes.documents.create;
    const filename = params['nome do documento'] ? params['nome do documento'] : 'contrato';
    const filenameReal = params['Arquivo real'] ? params['Arquivo real'] : ['contrato'];
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    const deadlineAt = date.toISOString();
    const docsKeys = [];

    cy.readFile(`cypress/fixtures/files/${filenameReal}.${extension}`, 'base64').then((base64) => {
      const body = {
        document: {
          path: newFilename === '' ? `${folderName}${filename}.${extension}` : `/${folderName}/${newFilename}`,
          content_base64: `data:application/pdf;base64,${base64}`,
          deadline_at: deadlineAt,
          auto_close: params['Finalizar documento automaticamente'],
          sequence_enabled: params['Ordenação de signatários'],
          locale: params['Idioma do documento'],
        },
      };

      for (let i = 0; i < numDocuments; i += 1) {
        requests.post(endpoint, body).then((res) => {
          docsKeys.push(res.body.document.key);
        });
      }
      documentKeys = docsKeys;
    });
  },
  createSigner(params) {
    const endpoint = routes.signer.create;
    const body = {
      signer: {
        auths: [params['Autenticar usando']],
      },
    };
    body.signer.email = params.Email ? params.Email : signerEmail;
    body.signer.phone_number = params['Número de telefone'] ? params['Número de telefone'] : '85986319747';
    body.signer.name = params['Nome completo'] ? params['Nome completo'] : 'Madalena da Silva';
    body.signer.documentation = params.CPF ? params.CPF : '123.321.123-40';
    body.signer.selfie_enabled = params['Autenticar por selfie'] ? params['Autenticar por selfie'] : false;
    body.signer.official_document_enabled = params['Autenticar por doc oficial'] ? params['Autenticar por doc oficial'] : false;
    body.signer.handwritten_enabled = params['Autenticar por manuscrito'] ? params['Autenticar por manuscrito'] : false;
    body.signer.liveness_enabled = params['Autenticar por reconhecimento facial'] ? params['Autenticar por reconhecimento facial'] : false;
    body.signer.birthday = params['Aniversário'] ? params['Aniversário'] : '1959-03-31';
    body.signer.delivery = params['Notificações'] ? params['Notificações'] : 'email';

    requests.post(endpoint, body).then((res) => {
      signerKey = res.body.signer.key;
    });
  },
  linkSignerToDocumet(params) {
    const endpoint = routes.list;
    documentKeys.forEach((documentK) => {
      const body = {
        list: {
          signer_key: signerKey,
          sign_as: params['Assinar como'],
          refusable: params.Recusa,
          document_key: documentK,
          rubric_enabled: params.Rubrica,
        },
      };
      if (params.Grupo) { body.list.group = params.Grupo; }
      if (params.Mensagem) { body.list.message = params.Mensagem; }
      requests.post(endpoint, body).then((res) => {
        documentUrl = res.body.list.url;
        listKey = res.body.list.key;
        requestSignatureKey = res.body.list.request_signature_key;
      });
    });
  },
  linkExistingSignerToDocumet(params) {
    const endpoint = routes.list;
    documentKeys.forEach((documentK) => {
      const body = {
        list: {
          signer_key: Cypress.config('signer_key'),
          sign_as: params['Assinar como'],
          refusable: params.Recusa,
          document_key: documentK,
          rubric_enabled: params.Rubrica,
        },
      };
      if (params.Grupo) { body.list.group = params.Grupo; }
      if (params.Mensagem) { body.list.message = params.Mensagem; }
      requests.post(endpoint, body).then((res) => {
        documentUrl = res.body.list.url;
        listKey = res.body.list.key;
        requestSignatureKey = res.body.list.request_signature_key;
      });
    });
  },
  sendSignerNotification() {
    const endpoint = routes.notifications;
    const body = {
      request_signature_key: requestSignatureKey,
    };
    requests.post(endpoint, body, 202);
  },
  getDocumentKey(i) {
    return documentKeys[i];
  },
  getSignerKey() {
    return signerKey;
  },
  getDocumentUrl() {
    return documentUrl;
  },
  createBatch(summaryx) {
    const endpoint = routes.batch;
    const summaryBoolean = (summaryx === 'colapsada');
    const body = {
      batch: {
        document_keys: documentKeys,
        signer_key: signerKey,
        summary: summaryBoolean,
      },
    };
    requests.post(endpoint, body).then((res) => {
      documentUrl = res.body.batch.url;
    });
  },
  updateDocument(params) {
    const body = {};
    if (params['Idioma do documento']) { body.locale = params['Idioma do documento']; }
    if (params['Finalizar documento automaticamente']) { body.auto_close = params['Finalizar documento automaticamente']; }
    if (params['Ordenação de signatários']) { body.sequence_enabled = params['Ordenação de signatários']; }
    documentKeys.forEach((documentK) => {
      const auxEndpoint = routes.documents.update;
      const endpoint = auxEndpoint.replace('ID', documentK);
      requests.patch(endpoint, body);
    });
  },
  removeSigner() {
    const endpoint = routes.signer.delete.replace('ID', listKey);
    requests.delete(endpoint);
  },
  getStatusDocument(status) {
    const endpoint = routes.documents.update.replace('ID', documentKeys);
    requests.get(endpoint).then((res) => {
      const documentStatus = res.body.document.status;
      expect(documentStatus).to.eq(status);
      return documentStatus;
    });
  },
  cancelDocument() {
    documentKeys.forEach((documentK) => {
      const auxEndpoint = routes.documents.cancel;
      const endpoint = auxEndpoint.replace('ID', documentK);
      requests.patch(endpoint);
    });
  },
  openMyFirstShowDocumentWithStatus(status) {
    cy.get(`[data-testid=${status}DocumentsLink]`).click();

    const firstDocumentKey = this.getDocumentKey(0);
    cy.get(`[data-testid=nodeDocumentLink][href*="${firstDocumentKey}"]`).click();
  },
  creatClauses() {
    const endpoint = routes.clauses.create;
    documentKeys.forEach((documentK) => {
      const body = {
        document_key: documentK,
        clause: {
          title: 'Clausula teste cypress',
          description: 'descricao cypress',
        },
      };
      requests.post(endpoint, body).then((res) => {
        clausesId.push(res.body.clause.id);
      });
    });
  },
  linkClausesToDocument() {
    const endpoint = routes.clauses.linkToDocuments;
    const body = {
      list: {
        key: listKey,
        clause_ids: clausesId,
      },
    };
    requests.patch(endpoint, body);
  },
};
