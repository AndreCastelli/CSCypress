export default class {
  constructor(elements) {
    this.interactions = {
      clickable: {
        click() {
          cy.get(`[data-testid=${this.id}]`, { timeout: 30000 }).click();
        },
      },
      clearable: {
        clear() {
          cy.get(`[data-testid=${this.id}]`).clear();
        },
      },
      containerable: {
        contains(value, params) {
          cy.get(`[data-testid=${this.id}]`, { timeout: 20000 }).contains(value, params);
        },
      },
      selectable: {
        select(value) {
          cy.get(`[data-testid=${this.id}]`, { timeout: 20000 }).select(value);
        },
      },
      typeable: {
        type(value) {
          cy.get(`[data-testid=${this.id}]`, { timeout: 10000 }).type(value);
        },
      },
      checkable: {
        check() {
          cy.get(`[data-testid=${this.id}]`, { timeout: 10000 }).check();
        },
      },
      shouldable: {
        should(value) {
          cy.get(`[data-testid=${this.id}]`, { timeout: 30000 }).should(value);
        },
      },
      default: {
        get() {
          return cy.get(`[data-testid=${this.id}]`, { timeout: 15000 });
        },
      },
    };

    this.elements = elements;

    for (const element in this.elements) {
      if (Object.prototype.hasOwnProperty.call(this.elements, element)) {
        const actions = {};
        Object.assign(actions, { id: element });
        Object.assign(actions, this.interactions.default);

        if (Array.isArray(this.elements[element])) {
          this.elements[element].forEach(
            (type) => { Object.assign(actions, this.interactions[type]); },
          );

          this[element] = actions;
        } else {
          this[element] = this.elements[element];
        }
      }
    }
  }
}
