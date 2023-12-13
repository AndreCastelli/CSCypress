import {
  When as Quando,
  Then as Então,
} from 'cypress-cucumber-preprocessor/steps';

import requests from '../../requests/externalApplications';

Quando('obtenho os dados de autenticação', () => {
  requests.getAuthenticationData();
});

Então('executo o script {string} para realizar a limpeza de {string}', (script) => {
  requests.runCleanupScript(script);
});
