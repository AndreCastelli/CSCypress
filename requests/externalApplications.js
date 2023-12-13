import { VALIDATIONS } from '../../utils/constants';

const baseUrl = Cypress.config('baseUrl');
const account = Cypress.config('account');
const folderAll = Cypress.config('folderAll');
const destinationFolder = Cypress.config('destinationFolder');
const signerEmail = Cypress.config('signerEmail');
let csrfToken = '';
let cookieTemp = '';

// let env;

export default {
  getTokenGmail(email) {
    const signerEmailAux = email || signerEmail;
    cy.task('gmail:get-messages', {
      options: {
        to: signerEmailAux,
        subject: 'Token',
        include_body: true,
      },
    }).then((TokenAux) => {
      const body = TokenAux[0].subject;
      const token = body.match(VALIDATIONS.TOKEN_FROM_EMAIL)[1];
      cy.get('[data-testid=tokenEmailField]:nth-child(1)').clear().type(token);
      cy.get('[data-testid=stepInfoFinalizeButton]').click();
    });
  },
  fillToken(email) {
    cy.task('get-env', {}).then((enviroment) => {
      cy.wait(3000);
      if (enviroment === 'development' || enviroment === 'test') {
        cy.mhGetMailsBySubjectRegex(VALIDATIONS.TOKEN_SUBJECT).mhFirst().mhGetSubject()
          .then((subject) => {
            const token = subject.match(VALIDATIONS.TOKEN_FROM_EMAIL)[1];
            cy.get('[data-testid=tokenEmailField]:nth-child(1)').type(token);
            cy.get('[data-testid="stepInfoFinalizeButton"]').click();
          });
      } else {
        this.getTokenGmail(email);
        cy.wait(4000);
        cy.get('body').then(($body) => {
          if ($body.find('[data-testid="stepInfoFinalizeButton"]').length === 1) {
            cy.get('[data-testid="resendTokenLink"]').click();
            cy.wait(4000);
            this.getTokenGmail(email);
          }
        });
      }
    });
  },
  getAuthenticationData() {
    cy.intercept('GET', '**/accounts/*/documents/running', (resultado) => {
      cookieTemp = resultado.headers.cookie;
      csrfToken = resultado.headers['x-csrf-token'];
    });
    cy.get('[data-testid=runningDocumentsLink]').click();
    cy.wait(1000);
  },
  runCleanupScript(script) {
    const headers = {
      accept: 'application/json',
      'content-type': 'application/json',
      'x-csrf-token': csrfToken,
      'User-Agent': 'Cypress',
      cookie: cookieTemp,
    };
    cy.task(script, {
      headers,
      baseUrl,
      account,
      folderAll,
      destinationFolder,
    });
    cy.wait(20000);
  },
};
