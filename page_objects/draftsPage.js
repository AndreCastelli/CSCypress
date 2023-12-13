export default {

  clickButton(id, options) {
    cy.get(`[data-testid=${id}]`).click(options);
  },

  shouldBe(id, should, value, options) {
    cy.get(`[data-testid=${id}]`, options).should(should, value);
  },

  goDraftstPage() {
    this.clickDraftsLinkMenu();
    this.shouldBe('pageTitle', 'be.visible');
  },

  clickDraftsLinkMenu() {
    this.clickButton('draftsListLink');
  },

  deleteDraft() {
    cy.wait(1000);
    cy.get('[data-testid=openDeleteDraftModalButton]').first().click();
    cy.get('[data-testid=confirmDraftDeleteButton]').click();
  },

  checkDraftNotExists(params) {
    cy.wait(1000);
    cy.get('[data-testid=draftList]').should('not.contain', params.email);
  },

  checkFirstDraft(params) {
    cy.wait(1000);
    cy.get('[data-testid=draftList]').first().contains('contrato.pdf');
    cy.get('[data-testid=draftList]').first().contains(params.email);
  },

};
