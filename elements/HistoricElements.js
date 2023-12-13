import { LOG } from '../../utils/constants';
import request from '../requests/Requests';

import { arrayToObject } from '../../utils/util';

export default {
  logText: [],
  compareDocumentCreateLog(params) {
    const page = arrayToObject(params.rawTable);
    const documentKey = request.getDocumentKey(0);
    const logOperator = LOG.OPERATOR_REGISTER.replace('OPERATOR_EMAIL', Cypress.config('operador'));
    let logDocumentConfig = LOG.DOCUMENT.CREATE.replace('DOCUMENT_ID', documentKey);
    logDocumentConfig = logDocumentConfig.replace('AUTOCLOSE', page['Finalização automática']);
    logDocumentConfig = logDocumentConfig.replace('LOCALE', page.Idioma);
    const logList = logDocumentConfig.split('DEADLINE');
    cy.contains(logOperator);
    logList.forEach((log) => {
      cy.contains(log);
    });
  },
  compareDocumentUpdateLog(params) {
    const page = arrayToObject(params.rawTable);
    const logOperator = LOG.OPERATOR_REGISTER.replace('OPERATOR_EMAIL', Cypress.config('operador'));
    let fieldUpdate;
    let valueUpdate;
    if (page['Idioma do documento']) {
      fieldUpdate = 'Idioma';
      valueUpdate = page['Idioma do documento'];
    }
    if (page['Finalizar documento automaticamente']) {
      fieldUpdate = 'Finalização automática após a última assinatura';
      valueUpdate = page['Finalizar documento automaticamente'];
    }
    let logDocumentConfig = LOG.DOCUMENT.UPDATE_CONFIG.replace('FIELD', fieldUpdate);
    logDocumentConfig = logDocumentConfig.replace('VALUE', valueUpdate);
    cy.contains(logOperator);
    cy.contains(logDocumentConfig);
  },
  compareAddSignerLog(params) {
    const page = arrayToObject(params.rawTable);
    const logOperator = LOG.OPERATOR_REGISTER.replace('OPERATOR_EMAIL', Cypress.config('operador'));
    let logDocumentAddSigner = LOG.DOCUMENT.ADD_SIGNER.replace('EMAIL_SIGNER', page['E-mail do signatário']);
    logDocumentAddSigner = logDocumentAddSigner.replace('SIGN_AS', page['Assinar como']);
    let informations = 'Nome Completo;';
    let data = `nome completo ${page['Nome completo']}`;

    switch (page['Autenticar usando']) {
      default:
      case 'email': {
        logDocumentAddSigner = logDocumentAddSigner.replace('AUTH', page['Autenticar usando']);
        if (page.CPF) {
          informations = `${informations} CPF;`;
          const cpfWithMask = page.CPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, '$1.$2.$3-$4');
          data = `${data} e CPF ${cpfWithMask}`;
        }
        break;
      }
      case 'sms': {
        const telefone = page['Número de telefone'].substr(7, 11);
        if (page.CPF) {
          informations = `${informations} CPF;`;
          const cpfWithMask = page.CPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, '$1.$2.$3-$4');
          data = `${data}, CPF ${cpfWithMask} e Telefone celular *******${telefone}, com hash prefixo 7de566(...)`;
        } else {
          data = `${data} e Telefone celular *******${telefone}, com hash prefixo 7de566(...)`;
        }
        logDocumentAddSigner = logDocumentAddSigner.replace('AUTH', 'telefone celular');
        break;
      }
    }
    if (page.Rubrica === 'true') {
      let logDocumentAddSignerRubric = LOG.DOCUMENT.ADD_RUBRIC.replace('EMAIL_SIGNER', page['E-mail do signatário']);
      logDocumentAddSignerRubric = logDocumentAddSignerRubric.replace('SIGN_AS', page['Assinar como']);
      cy.contains(logOperator);
      cy.contains(logDocumentAddSignerRubric);
    }
    if (page.Clausulas) {
      const clauses = page.Clausulas;
      data = `${data} rubricar a Cláusula ${clauses} O operador declarou que a cláusula está presente, de forma idêntica, no documento original`;
    }
    logDocumentAddSigner = logDocumentAddSigner.replace('INFORMATIONS', informations);
    logDocumentAddSigner = logDocumentAddSigner.replace('DATA', data);
    switch (page['Autenticação adicional']) {
      default:
        break;
      case 'Selfie e Assinatura manuscrita': {
        logDocumentAddSigner = logDocumentAddSigner.replace('endereço de IP.', 'endereço de IP; Foto de face & documento; Assinatura manuscrita.');
        break;
      }
      case 'Selfie': {
        logDocumentAddSigner = logDocumentAddSigner.replace('endereço de IP.', 'endereço de IP; Foto de face & documento.');
        break;
      }
      case 'Assinatura manuscrita': {
        logDocumentAddSigner = logDocumentAddSigner.replace('endereço de IP.', 'endereço de IP; Assinatura manuscrita.');
        break;
      }
    }
    cy.contains(logOperator);
    cy.contains(logDocumentAddSigner);
  },
  compareSignatureLog(params) {
    const page = arrayToObject(params.rawTable);
    let logDocumentSignature = LOG.DOCUMENT.SIGNATURE.replace('SIGNER_NAME', page['Nome completo']);

    if (page.Rubrica === 'true') {
      if (page.Clausulas) {
        logDocumentSignature = logDocumentSignature.replace('COMPLEMENT', ` como ${page['Assinar como']} e declarou que leu e concordou com o conteúdo do documento. Rubricou eletrônicamente as cláusulas`);
      } else {
        logDocumentSignature = logDocumentSignature.replace('COMPLEMENT', ` como ${page['Assinar como']} e declarou que leu e concordou com o conteúdo do documento`);
      }
    } else {
      logDocumentSignature = logDocumentSignature.replace('COMPLEMENT', ` como ${page['Assinar como']}`);
    }

    switch (page['Autenticar usando']) {
      default:
      case 'email': {
        logDocumentSignature = logDocumentSignature.replace('AUTH', page['Autenticar usando']);
        logDocumentSignature = logDocumentSignature.replace('AUTH_INFO', page['E-mail do signatário']);
        break;
      }
      case 'sms': {
        logDocumentSignature = logDocumentSignature.replace('AUTH', 'telefone celular');
        const telefone = page['Número de telefone'].substr(7, 11);
        logDocumentSignature = logDocumentSignature.replace('AUTH_INFO', `*******${telefone}`);
        break;
      }
    }

    if (page.CPF) {
      const cpfWithMask = page.CPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, '$1.$2.$3-$4');
      const infor = `CPF informado: ${cpfWithMask}`;
      logDocumentSignature = logDocumentSignature.replace('INFORMATIONS_SIGNER', infor);
    } else {
      logDocumentSignature = logDocumentSignature.replace('INFORMATIONS_SIGNER', '');
    }

    cy.contains(logDocumentSignature);
  },
};
