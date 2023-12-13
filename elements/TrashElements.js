export default {
  cancelDocumentButton: ['clickable'],
  cancelDocumentCheckbox: ['clickable'],
  cancelDocumentModalButton: ['clickable'],
  deleteSelectedNodesButton: ['clickable'],
  deleteDocumentButtonModal: ['clickable'],
  nodeActionHardDeleteOption: ['clickable'],
  hardDeleteConfirmButton: ['clickable'],
  nodesActionsDropdown: ['clickable'],
  nodeActionMoveOption: ['clickable'],
  selectAllNodesCheckbox: ['clickable'],
  trashDocumentsLink: ['clickable'],
  pageTitle: ['shouldable'],
  accessTrashPage() {
    this.trashDocumentsLink.click();
    this.pageTitle.should('be.visible');
  },
  hardDeleteNode() {
    this.nodesActionsDropdown.click();
    this.nodeActionHardDeleteOption.click();
  },
};
