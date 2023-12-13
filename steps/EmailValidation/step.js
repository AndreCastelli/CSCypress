import {
  And as E,
} from 'cypress-cucumber-preprocessor/steps';

import emailConfirmationModal from '../../page_objects/Modal/emailConfirmationModal';
import onboardingPage from '../../page_objects/onboardingPage';

/* STEPS */

E('que cadastro um novo usuário', () => {
  onboardingPage.fillCredentialsInformationsOnboarding();
  onboardingPage.verifyAccountInformationsOnboardingModal();
  onboardingPage.fillAccountInformationsOnboarding();
});

E('verifico obrigatoriedade do campo de e-mail', () => {
  emailConfirmationModal.clearEmail();
  emailConfirmationModal.verifyRequiredFieldMessage();
  emailConfirmationModal.typeEmail('texto de exemplo');
  emailConfirmationModal.verifyInvalidEmailMessage();
  emailConfirmationModal.clearEmail();
});

E('estou na modal de confirmação de e-mail', () => {
  emailConfirmationModal.verifyEmailValidationModalIsVisible();
});

E('faço a mudança do meu endereço de email', () => {
  emailConfirmationModal.verifyEmailValidationModalIsVisible();
  emailConfirmationModal.clearEmail();
  emailConfirmationModal.typeEmail('user@example.com');
});

E('faço o reenvio do e-mail de validação', () => {
  emailConfirmationModal.resendEmail();
  emailConfirmationModal.veritySucessResendEmailMessage();
});
