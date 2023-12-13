export default {
  helpLink: ['clickable'],
  copyQRCodeButton: ['clickable'],
  closeModalButton: ['clickable'],
  sendFeedbackButton: ['clickable'],
  pixFeedbackModal: ['containerable'],
  sectionPixTutorial: ['containerable'],
  cancelSendFeedbackButton: ['clickable'],
  nextStepButton: ['clickable', 'containerable'],
  otherFeedbackOptionRadioInput: ['checkable'],
  feedbackTextArea: ['typeable'],
  pixFeedbackModalCheckOthers() {
    cy.get(':nth-child(3) >>> [data-testid=radioInput0]').click();
  },
  sendFeedbackButtonEnable() {
    cy.get('[data-testid=sendFeedbackButton]').should('be.enabled');
  },
  sendFeedbackButtonDisabled() {
    cy.get('[data-testid=sendFeedbackButton]').should('be.disabled');
  },
};
