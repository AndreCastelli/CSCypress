export default {
  searchFilterMenuButton: ['clickable'],
  searchFilterStatusSelect: ['clickable'],
  searchFilterDocumentationInput: ['clickable', 'typeable'],
  searchFilterCreatedAtInput: ['clickable'],
  searchFilterFinishedAtInput: ['clickable'],
  searchFilterDeadlineAtInput: ['clickable'],
  searchFilterType(kind) {
    const filterElements = {
      status: this.searchFilterStatusSelect,
      documentation: this.searchFilterDocumentationInput,
      createdAt: this.searchFilterCreatedAtInput,
      finishedAt: this.searchFilterFinishedAtInput,
      deadlineAt: this.searchFilterDeadlineAtInput,
    };
    filterElements[kind].click();
  },
  selectFieldOption(text) {
    cy.get(`[data-testid=selectField${text}Option]`).click();
  },
  checkFirstDocumentCreatedAtDate(date) {
    cy.get('[data-testid=nodeDocument1CreatedAtDate]').contains(date);
  },
  checkFirstDocumentDeadlineOrFinishedDate(date) {
    cy.get('[data-testid=nodeDocument1Date]').contains(date);
  },
  checkAllDocumentsStatus(status) {
    cy.get('[data-testid=documentsRowList] > li').each(($el) => {
      cy.wrap($el).contains(status);
    });
  },
  // FIXME: 'selectMonth', 'selectDay' and 'selectDate'
  // Replace class selector for 'data-testid' after refacting the 'XDateTimePicker' component
  // to accept the attribute correctly
  selectMonth(month) {
    cy.get('.datetimepicker.visible').find('.date-buttons').first().click();
    cy.get('.year-month-selector').find('.month-button').eq(month).click()
      .wait(400);
  },
  selectDay(day) {
    cy.get('.datetimepicker.visible').find('.datepicker-day').contains(day)
      .click({ force: true });
    cy.get('.datetimepicker.visible').find('.datepicker-button.validate').click();
  },
  selectDate(day, month) {
    if (month) this.selectMonth(month);
    this.selectDay(day);
  },
};
