import { TEMPLATE_VARIABLES } from '../../utils/constants';

export default {
  fillDocumentVarJsonField() {
    cy.get('[data-testid=documentVarJsonField]').type(TEMPLATE_VARIABLES.JSON, { parseSpecialCharSequences: false });
  },
};
