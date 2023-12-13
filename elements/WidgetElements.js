import { upperFirst, camelCase } from 'lodash';
import { VALIDATIONS } from '../../utils/constants';
import { arrayToObject } from '../../utils/util';

const numberEmails = {};
let env;

const reasons = {
  'Conteúdo do documento': 'content',
  'Dados pessoais incorretos': 'incorrectPersonalInfo',
  'Forma de autenticação': 'selectedAuthentication',
  'Uso da assinatura eletrônica': 'electronicSignatureUse',
  'Outro motivo': 'other',
};

export default {
  signDocumentButton: ['clickable', 'containerable'],
  nextStepInfoButton: ['clickable', 'containerable'],
  pictureStepButton: ['clickable', 'containerable'],
  nextSubstepSelfieButton: ['clickable', 'containerable'],
  nextStepSelfieTakedButton: ['clickable', 'containerable'],
  captureCameraButton: ['clickable', 'containerable'],
  tokenEmailField: ['typeable'],
  takePhotoButton: ['clickable', 'containerable'],
  takeAnotherPhotoButton: ['clickable', 'containerable'],
  goBackWidgetLink: ['clickable', 'containerable'],
  previewDocumentContainer: [],
  finishStepTokenButton: ['clickable', 'containerable'],
  viewToSignButton: ['clickable', 'containerable'],
  stepInfoFinalizeButton: ['clickable', 'containerable'],
  numberSignaturesText: ['containerable'],
  resendTokenLink: ['clickable'],
  nameInput: ['typeable'],
  documentationInput: ['typeable'],
  birthdayInput: ['typeable'],
  certificateLocalButton: ['clickable'],
  signDocButton: ['clickable'],
  formField: ['clickable'],
  visitDocument(page) {
    cy.task('get-env', {}).then((enviroment) => {
      cy.wait(5000);
      if (enviroment === 'development' || enviroment === 'test') {
        cy.mhGetMailsBySubjectRegex(/.*/).mhFirst().mhGetBody().then((body) => {
          const signUrl = body.match(VALIDATIONS.SIGN_URL_FROM_EMAIL)[0];
          cy.visit(signUrl);
        });
      } else {
        cy.task('gmail:check-inbox', {
          options: {
            subject: page['Assunto do email'],
            include_body: true,
          },
        }).then((emails) => {
          const body = emails[0].body.text;
          const signUrl = body.match(VALIDATIONS.SIGN_URL_FROM_EMAIL)[0];
          cy.visit(signUrl);
        });
      }
    });
  },
  clickLatestFinishedDocument() {
    cy.get('[data-testid=nodeDocumentLink]').first().click();
  },
  refuseSignature(params) {
    const refusalCauses = params['Motivo da recusa'].split(', ');
    const comment = params['Comentário'];

    cy.get('[data-testid=refusalSignatureModal] [data-testid=reasonsFieldSelect]').click();

    refusalCauses.forEach((refusalC) => {
      const refusalCause = upperFirst(reasons[refusalC]);
      cy.get(`[data-testid=selectField${refusalCause}Option]`).click();
    });
    cy.get('[data-testid=refusalSignatureModal] [data-testid=reasonsFieldSelect]').click();
    cy.get('[data-testid="refusalSignatureModal"] >').click({ force: true });

    cy.get('[data-testid=refusalSignatureModal] [data-testid=iAgreeRefusalCheckbox]').click();
    if (comment) {
      cy.get('[data-testid=refusalSignatureModal] [data-testid=commentRefusalField]').type(comment);
    }
  },
  verifyEmail(page) {
    cy.task('get-env', {}).then((enviroment) => {
      if (enviroment === 'development' || enviroment === 'test') {
        cy.mhGetMailsBySubject(page['Assunto do email']);
        if (page['Destinatário']) {
          cy.mhGetAllMails().mhFirst().mhGetRecipients().should('contain', page['Destinatário']);
        }
      } else {
        cy.wait(5000);
        cy.task('gmail:check-inbox', {
          options: {
            subject: page['Assunto do email'],
            include_body: true,
          },
        });
      }
    });
  },
  documentsListSummary(summary) {
    if (summary === 'colapsada') {
      cy.get('[data-testid=documentsListSummary]', { timeout: 30000 }).should('be.visible');
    } else {
      cy.get('[data-testid=documentsListSummary]', { timeout: 30000 }).should('not.exist');
    }
  },
  clickSignDocumentButton() {
    cy.get('[data-testid=signDocumentButton]', { timeout: 30000 }).click({ force: true });
  },
  numberEmails(params) {
    const page = arrayToObject(params.rawTable);
    const subject = `${camelCase(page['Assunto do email'])}`;
    cy.task('get-env', {}).then((enviroment) => {
      env = enviroment;
      if (enviroment === 'development' || enviroment === 'test') {
        cy.mhGetMailsBySubjectContains(page['Assunto do email']).then((arrayEmails) => {
          numberEmails[subject] = arrayEmails.length;
        });
      } else {
        cy.googleApiGetMailsBySubject(page['Assunto do email']).then((arrayEmails) => {
          numberEmails[subject] = arrayEmails.length;
        });
      }
    });
  },
  verifyNumberEmails(expect, page) {
    cy.wait(5000);
    const subject = `${camelCase(page['Assunto do email'])}`;
    const numberOfEmailsExpected = numberEmails[subject] + 1;
    if (env === 'development') {
      if (expect === 'recebo') {
        for (let i = 0; i < 4; i += 1) {
          cy.mhGetMailsBySubjectContains(page['Assunto do email']).then((emails) => {
            const numberOfEmails = emails.length;
            if (numberOfEmails === numberOfEmailsExpected) {
              cy.mhGetMailsBySubjectContains(page['Assunto do email']).should('have.length', numberOfEmailsExpected);
              if (page['Destinatário']) {
                cy.mhGetAllMails().mhFirst().mhGetRecipients().should('contain', page['Destinatário']);
              }
              i = 4;
            } else if (numberOfEmails === numberEmails[subject] && i === 4) {
              cy.mhGetMailsBySubjectContains(page['Assunto do email']).should('have.length', numberOfEmailsExpected);
            } else if (numberOfEmails === numberEmails[subject] && i < 4) {
              cy.wait(3000);
            }
          });
        }
      } else if (expect === 'não recebo') {
        cy.mhGetMailsBySubjectContains(page['Assunto do email']).should('have.length', numberEmails[subject]);
      }
    } else if (env !== 'development') {
      if (expect === 'recebo') {
        cy.googleApiGetMailsBySubject(page['Assunto do email']);
        if (page['Destinatário']) {
          // TODO
          // .should('contain', page['Destinatário']);
        }
      } else if (expect === 'não recebo') {
        cy.googleApiGetMailsBySubject(page['Assunto do email']);
      }
    }
  },
  handwrittenSignature() {
    cy.get('[data-testid=canvasContainer] > canvas')
      .trigger('mousemove', 'center')
      .click({ force: true });
  },
  optionsDocumentButtonClick() {
    cy.get('[data-testid=optionsDocumentButton]')
      .last()
      .contains('Opções')
      .click();
  },
  optionsModalClickOnOption(option) {
    cy.get('[data-testid=optionsDocumentModal]')
      .contains(option, { matchCase: false })
      .click();
  },
  refusalSubmitButtonClick() {
    cy.get('[data-testid=refusalSubmitButton]')
      .contains('recusar', { matchCase: false });

    cy.get('[data-testid=refusalSubmitButton]')
      .click();
  },
  refusalSubmitButtonDisabled() {
    cy.get('[data-testid=refusalSubmitButton]')
      .contains('recusar', { matchCase: false });

    cy.get('[data-testid=refusalSubmitButton]')
      .should('be.disabled');
  },
};
