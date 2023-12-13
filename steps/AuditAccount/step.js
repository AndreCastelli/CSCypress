import {
  When as Quando,
  Then as Então,
  And as E,
} from 'cypress-cucumber-preprocessor/steps';

import auditAccountPage from '../../page_objects/auditAccountPage';

Quando('estou na tela de auditoria de conta', () => {
  auditAccountPage.accessAuditAccount();
});

Então('vejo o modal de Upgrade de plano', () => {
  auditAccountPage.modalAuditAccount();
  auditAccountPage.logoutAccount();
});

Quando('clico no botão "Baixar relátorio"', () => {
  auditAccountPage.downloadAudit();
});

Então('vejo o download do arquivo', () => {
  auditAccountPage.checkDownloadedFile();
});

E('vejo a tabela de auditoria de conta', () => {
  auditAccountPage.accessAuditAccount();
});
