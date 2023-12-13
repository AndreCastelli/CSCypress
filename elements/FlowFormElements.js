export default {
  fillFlowForm(page) {
    Object.keys(page).forEach((item) => {
      cy.contains(item).then((a) => {
        const idTextField = a.prop('for');
        cy.get(`#${idTextField}`).type(page[item]);
      });
    });
    cy.get('[data-testid=submitAnswersButton]').click();
  },
};
