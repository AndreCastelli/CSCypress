export default {
  newFolderButton: ['clickable'],
  formFolderModal: ['containerable'],
  editFolderModal: ['containerable'],
  submitFolderFormButton: ['clickable'],
  nodesActionsDropdown: ['clickable'],
  nodeActionRenameOption: ['clickable'],
  nodeActionMoveOption: ['clickable'],
  nodeActionPermissionOption: ['clickable'],

  verifyPermissionFolder() {
    this.nodesActionsDropdown.click();
    this.nodeActionPermissionOption.click();
  },
  setPermissionFolder(typePermission) {
    // TOGGLE_NODES_LIST_REFACTOR_ENABLED
    // TODO: Remove 'getToggle' wrapper, conditionals and keep only 'isEnabled' inner code
    cy.getToggle('toggleNodesListRefactorEnabled').then((isEnabled) => {
      if (isEnabled) {
        cy.get('[data-testid=privacyTypeSelect]').click();
        switch (typePermission) {
          case 'privada':
            cy.get('[data-testid=selectFieldAcessoApenasParaUsuariosSelecionadosOption]').click();
            break;
          case 'publica':
            cy.get('[data-testid=selectFieldAcessoParaTodosOsUsuariosDaContaOption]').click();
            break;
          default:
            cy.log(`O parâmetro ${typePermission} é invalido!`);
        }
      } else {
        switch (typePermission) {
          case 'privada':
            cy.get('[data-testid=privacyTypeSelect]').select('true');
            break;
          case 'publica':
            cy.get('[data-testid=privacyTypeSelect]').select('false');
            break;
          default:
            cy.log(`O parâmetro ${typePermission} é invalido!`);
        }
      }
    });
  },
  savePermissionFolder() {
    cy.get('[data-testid=saveFolderPrivacyButton]').click();
  },
  removePermissionFolder(member) {
    cy.get(`[data-testid=${member}PermissionCheckbox]`, { timeout: 15000 }).click();
  },
};
