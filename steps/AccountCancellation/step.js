import {
  Given as Dado,
  When as Quando,
  Then as Então,
  And as E,
} from 'cypress-cucumber-preprocessor/steps';

import accountPaymentsPage from '../../page_objects/accountPaymentsPage';
import cancellationPage from '../../page_objects/cancellationPage';

Dado('que estou autenticado com a conta empresarial', () => {
  accountPaymentsPage.loginAccountBusiness();
});

E('estou na aba cobranças', () => {
  accountPaymentsPage.accessPayments();
});

E('clico em "Solicitar cancelamento de conta"', () => {
  accountPaymentsPage.clickRequestCancellation();
});

Quando('escolho a opção {string}', () => {
  accountPaymentsPage.reasonsOptions();
  accountPaymentsPage.clickConfirmCancellation();
});

E('vejo o modal de confirmação', () => {
  accountPaymentsPage.verifyConfirmModalCancellation();
  accountPaymentsPage.acceptTermsCancellationInModal();
});

Então('estou na página de confirmação do cancelamento da conta', () => {
  cancellationPage.checkPageCanceled();
  cancellationPage.reactivateAccount();
  cancellationPage.confirmReactivateAccount();
});

E('cancelo a conta', () => {
  accountPaymentsPage.accessPayments();
  accountPaymentsPage.clickRequestCancellation();
  accountPaymentsPage.reasonsOptions();
  accountPaymentsPage.clickConfirmCancellation();
  accountPaymentsPage.verifyConfirmModalCancellation();
  accountPaymentsPage.acceptTermsCancellationInModal();
});

Quando('reativo a conta', () => {
  cancellationPage.verifyModalReactivateAccount();
  cancellationPage.reactivateAccount();
  cancellationPage.confirmReactivateAccount();
});

Então('estou na página de dashboard da conta', () => {
  cancellationPage.redirectionDashboard();
  cancellationPage.logoutAccount();
});

Dado('que estou autenticado com a conta Trial', () => {
  accountPaymentsPage.loginTrial();
});

Quando('cancelo a conta trial', () => {
  cancellationPage.verifyModalReactivateAccount();
  cancellationPage.reactivateAccount();
  cancellationPage.confirmReactivateAccount();
});

Então('estou na pagina de login', () => {
  cancellationPage.checkPageCanceled();
});
