export default {
  standardPlanButton: ['clickable'],

  fillForm(Name, Cpf, Phone, Email, ZipCode, ZipNumber, Address, Neighborhood, City) {
    cy.get('[id=radio-input-2]').click();
    cy.get('[data-testid=nameInput]').clear().type(Name);
    cy.get('[data-testid=cpfInput]').clear().type(Cpf);
    cy.get('[data-testid=phoneInput]').clear().type(Phone);
    cy.get('[data-testid=emailInput]').clear().type(Email);
    cy.get('[data-testid=zipCodeInput]').clear().type(ZipCode);
    cy.get('[data-testid=addressInput]').clear().type(Address);
    cy.get('[data-testid=zipNumberInput]').clear().type(ZipNumber);
    cy.get('[data-testid=neighborhoodInput]').clear().type(Neighborhood);
    cy.get('[data-testid=regionInput]').select('AC');
    cy.get('[data-testid=cityInput]').clear().type(City);
    cy.get('[data-testid=subscriptionFormNextButton]').click();
  },
};
