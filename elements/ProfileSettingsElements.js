export default {
  nameInput: ['typeable', 'clearable'],
  inputEmail: ['typeable', 'clearable'],
  changePasswordButton: ['clickable'],
  closeSection: ['clickable'],
  createPasswordLink: ['clickable'],
  saveInformationButton: ['clickable'],
  changePasswordAction: ['clickable'],
  currentPasswordInput: ['typeable'],
  newPasswordInput: ['typeable'],
  savePasswordButton: ['clickable'],
  saveNotificationsButton: ['clickable'],
  tabInformações: ['clickable'],
  tabSenha: ['clickable'],
  tabNotificações: ['clickable'],
  profileMenu: ['clickable'],
  operatorsLink: ['clickable'],
  firstQuestionRadio() {
    cy.get('[data-testid=radioInput0]').eq(0).click();
  },
  secondQuestionRadio() {
    cy.get('[data-testid=radioInput0]').eq(1).click();
  },
};
