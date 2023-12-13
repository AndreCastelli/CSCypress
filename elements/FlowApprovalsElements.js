export default {
  activateApprovalRadio: ['clickable'],
  desactivateApprovalRadio: ['clickable'],
  flowsApprovalsMenuOption: ['clickable'],
  flowProccessOption: ['clickable'],
  disapproveButton: ['clickable'],
  approveButton: ['clickable'],
  verifyTitletWithItemCreated(params) {
    cy.get('[data-testid=flowProccessOption]', { timeout: 30000 }).should('be.visible').and('contain', params).click();
  },
  approveFlow() {
    this.approveButton.click();
    cy.contains('Tem certeza que deseja aprovar?');
    cy.contains('Sim, aprovar!').click();
  },
  disapproveFlow() {
    this.disapproveButton.click();
    cy.contains('Tem certeza que deseja reprovar?');
    cy.get('[data-testid=confirmationModalConfirm]').contains('Reprovar').click();
  },
  verifyFlowApprovalsAlert(flowName) {
    cy.wait(5000);
    cy.contains(`FLUXO: ${flowName}`).should('not.exist');
  },
};
