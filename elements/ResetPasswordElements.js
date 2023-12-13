import { VALIDATIONS } from '../../utils/constants';

export default {
  passwordField: ['typeable'],
  submitButton: ['clickable'],
  emailField: ['typeable', 'clearable'],
  forgotPasswordLink: ['clickable'],
  backToLoginLink: ['clickable'],

  visitDocument(page) {
    cy.task('get-env', {}).then((enviroment) => {
      cy.wait(5000);
      if (enviroment === 'development') {
        cy.mhGetMailsBySubjectRegex(/.*/).mhFirst().mhGetBody().then((body) => {
          let signUrl = body.match(VALIDATIONS.RESET_PASSWORD_URL)[0];
          signUrl = signUrl.replace('=', '/edit');
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
          let signUrl = body.match(VALIDATIONS.RESET_PASSWORD_URL)[0];
          signUrl = signUrl.replace('=', '/edit');
          cy.visit(signUrl);
        });
      }
    });
  },
};
