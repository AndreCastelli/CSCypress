const myHeaders = new Headers({
  'Content-Type': 'application/json',
});

export default {

  post(endpoint, bodyx, statusCode = 201) {
    const URL = `${Cypress.config('baseUrl')}/api/${endpoint}?access_token=${Cypress.config('accessToken')}`;
    return cy.request({
      method: 'POST',
      url: URL,
      headers: myHeaders,
      body: bodyx,
    }).then((resp) => {
      expect(resp.status).to.eq(statusCode);
    });
  },

  patch(endpoint, bodyx = '') {
    const URL = `${Cypress.config('baseUrl')}/api/${endpoint}?access_token=${Cypress.config('accessToken')}`;
    if (bodyx === '') {
      return cy.request({
        method: 'PATCH',
        url: URL,
        headers: myHeaders,
      }).then((resp) => {
        expect(resp.status).to.eq(200);
      });
    }
    return cy.request({
      method: 'PATCH',
      url: URL,
      headers: myHeaders,
      body: bodyx,
    }).then((resp) => {
      expect(resp.status).to.eq(200);
    });
  },

  delete(endpoint) {
    const URL = `${Cypress.config('baseUrl')}/api/${endpoint}?access_token=${Cypress.config('accessToken')}`;
    return cy.request({
      method: 'DELETE',
      url: URL,
      headers: myHeaders,
    }).then((resp) => {
      expect(resp.status).to.eq(200);
    });
  },

  get(endpoint) {
    const URL = `${Cypress.config('baseUrl')}/api/${endpoint}?access_token=${Cypress.config('accessToken')}`;
    return cy.request({
      method: 'GET',
      url: URL,
      headers: myHeaders,
    }).then((resp) => {
      expect(resp.status).to.eq(200);
    });
  },

};
