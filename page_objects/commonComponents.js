import { faker } from '@faker-js/faker';
import { camelCase } from 'lodash';

const signaturesKind = {
  Assinar: 'sign',
  'Assinar como testemunha': 'witness',
  'Assinar como parte': 'party',
  'Assinar como interveniente': 'intervening',
  'Assinar para acusar recebimento': 'receipt',
  'Assinar para aprovar': 'approve',
  'Assinar como endossante': 'endorser',
  'Assinar como endossatário': 'endorsee',
  'Assinar como administrador': 'administrator',
  'Assinar como avalista': 'guarantor',
  'Assinar como cedente': 'transferor',
  'Assinar como cessionário': 'transferee',
  'Assinar como contratada': 'contractee',
  'Assinar como contratante': 'contractor',
  'Assinar como devedor solidário': 'jointDebtor',
  'Assinar como emitente': 'issuer',
  'Assinar como gestor': 'manager',
  'Assinar como parte compradora': 'buyer',
  'Assinar como parte vendedora': 'seller',
  'Assinar como procurador': 'attorney',
  'Assinar como representante legal': 'legalRepresentative',
  'Assinar como responsável solidário': 'coResponsible',
  'Assinar como validador': 'validator',
  'Assinar como fiador': 'surety',
  'Assinar como locador': 'lessor',
  'Assinar como locatário': 'lessee',
  'Assinar para homologar': 'ratify',
  'Assinou para aprovar': 'signedAsApprove',
  'Assinou como parte': 'signedAsParty',
  'Assinou como testemunha': 'signedAsWitness',
  'Assinou como interveniente': 'signedAsIntervening',
  'Assinou para acusar recebimento': 'signedAsReceipt',
  'Assinou como endossante': 'signedAsEndorser',
  'Assinou como endossatário': 'signedAsEndorsee',
  'Assinou como administrador': 'signedAsAdministrator',
  'Assinou como avalista': 'signedAsGuarantor',
  'Assinou como cedente': 'signedAsTransferor',
  'Assinou como cessionário': 'signedAsTransferee',
  'Assinou como contratada': 'signedAsContractee',
  'Assinou como contratante': 'signedAsContractor',
  'Assinou como devedor solidário': 'signedAsJointDebtor',
  'Assinou como emitente': 'signedAsIssuer',
  'Assinou como gestor': 'signedAsManager',
  'Assinou como parte compradora': 'signedAsBuyer',
  'Assinou como parte vendedora': 'signedAsSeller',
  'Assinou como procurador': 'signedAsAttorney',
  'Assinou como representante legal': 'signedAsLegalRepresentative',
  'Assinou como responsável solidário': 'signedAsCoResponsible',
  'Assinou como validador': 'signedAsValidator',
  'Assinou como fiador': 'signedAsSurety',
  'Assinou como locador': 'signedAsLessor',
  'Assinou como locatário': 'signedAsLessee',
  'Assinou para homologar': 'signedAsRatify',
};

export default {

  clickButton(dataTestId, options) {
    cy.get(`[data-testid=${dataTestId}]`).filter(':visible').click(options);
  },

  clickButtonDataTestIdComplete(dataTestId, options) {
    cy.get(dataTestId)
      .filter(':visible')
      .click(options);
  },

  typeFieldDataTestIdComplete(dataTestId, type) {
    cy.get(dataTestId)
      .filter(':visible')
      .type(type);
  },

  checkCheckbox(dataTestId) {
    cy.get(dataTestId).check({ force: true });
  },

  // Componentes de adição de signatários - comum para setup de documento e show document
  addRandomSignerToDocument() {
    const signerData = {
      Email: faker.internet.exampleEmail(),
      'Nome completo': faker.name.findName(),
      'Autenticação obrigatória': 'Token Via EMail',
    };
    this.addSignerDetails(signerData);
  },

  clickAddSignerButton() {
    this.clickButton('addSignerButton');
  },

  clickEmailFieldAddSignerModal() {
    this.clickButtonDataTestIdComplete('[data-testid=signerEmailField]');
  },

  typeEmailFieldAddSignerModal(email) {
    this.typeFieldDataTestIdComplete('[data-testid=signerEmailField]', email);
  },

  typePhoneNumberAddSignerModal(phone) {
    this.typeFieldDataTestIdComplete('[data-testid=signerPhoneNumberField]', phone);
  },

  typeNameFieldAddSignerModal(name) {
    this.typeFieldDataTestIdComplete('[data-testid=signerNameField]', name);
  },

  selectSignerAuth(auth) {
    const authMap = {
      tokenViaEMail: 'email',
      tokenViaSms: 'sms',
      tokenViaWhatsapp: 'whatsapp',
      pixCpfObrigatorio: 'pix',
      certificadoDigitalCpfObrigatorio: 'icpBrasil',
    };

    const optionDataTestId = camelCase(
      `selectField ${authMap[camelCase(auth)] || auth} Option`,
    );

    this.clickButtonDataTestIdComplete('[data-testid=signerAuthFieldSelect]');
    this.clickButtonDataTestIdComplete(`[data-testid=menuContent] [data-testid=${optionDataTestId}]`);
  },

  selectSignerCommunicateBy(communicateBy) {
    const communicateByMap = {
      eMail: 'email',
    };

    const optionDataTestId = camelCase(
      `selectField ${communicateByMap[camelCase(communicateBy)] || communicateBy} Option`,
    );
    this.clickButtonDataTestIdComplete('[data-testid=signerCommunicateByFieldSelect]');
    this.clickButtonDataTestIdComplete(`[data-testid=menuContent] [data-testid=${optionDataTestId}]`);
  },

  typeCpfFieldAddSignerModal(cpf) {
    this.typeFieldDataTestIdComplete('[data-testid=signerCpfField]', cpf);
  },

  typeBirthdayFieldAddSignerModal(birthday) {
    this.typeFieldDataTestIdComplete('[data-testid=signerBirthdayField]', birthday);
  },

  checkHasDocumentationCheckbox() {
    this.checkCheckbox('[data-testid=hasDocumentationCheckbox] [data-testid=x-checkbox-input]');
  },

  checkSaveAsContactDisabled() {
    cy.get('[data-testid=saveAsContactSwitch]').should('be.not.exist');
  },

  checkSaveAsContactEnabled() {
    cy.get('[data-testid=saveAsContactSwitch]:visible input').should('be.enabled');
  },

  toggleSaveAsContactCheckbox() {
    cy.get('[data-testid=saveAsContactSwitch]:visible').click();
  },

  clickNextStepAddSignerModalButton() {
    cy.get('[data-testid=nextStepAddSignerModalButton]').first().click();
  },

  clickSignerSignAsSelect() {
    this.clickButton('signerSignAsSelect');
  },

  choiceOfAdditionalAuthentication(additionalAuthentication) {
    if (additionalAuthentication === 'Selfie') {
      this.clickSelfieEnabledOption();
    }
    if (additionalAuthentication.includes('Assinatura manuscrita')) {
      this.clickHandwrittenEnabledOption();
    }
    if (additionalAuthentication.includes('Documento oficial')) {
      this.clickOfficialDocumentEnabledOption();
    }
    if (additionalAuthentication === 'Selfie dinâmica') {
      this.clickLivenessEnabledOption();
    }
  },

  clickSelfieEnabledOption() {
    this.clickButtonDataTestIdComplete('[data-testid=selfieEnabledOption]');
  },

  clickHandwrittenEnabledOption() {
    this.clickButtonDataTestIdComplete('[data-testid=handwrittenEnabledOption]');
  },

  clickOfficialDocumentEnabledOption() {
    this.clickButtonDataTestIdComplete('[data-testid=officialDocumentEnabledOption]');
  },

  clickLivenessEnabledOption() {
    this.clickButtonDataTestIdComplete('[data-testid=livenessEnabledOption]');
  },

  typeContactSearchField(text) {
    this.typeFieldDataTestIdComplete('[data-testid=contactSearchInput]', text);
  },

  shouldHaveContactInTable(contact) {
    this.typeContactSearchField(contact);
    cy.wait(3000);
    cy.get('[data-testid=contactsTable]')
      .contains(contact, { timeout: 2000 })
      .should('exist');
  },

  addSignerDetails(params) {
    const communicateBy = params['Método de envio'] || 'e-mail';
    this.selectSignerCommunicateBy(communicateBy);

    this.selectSignerAuth(params['Autenticação obrigatória']);

    if (params['Autenticação adicional']) {
      this.choiceOfAdditionalAuthentication(params['Autenticação adicional']);
    }

    if (params['Número de telefone']) {
      this.typePhoneNumberAddSignerModal(params['Número de telefone']);
    }

    if (camelCase(communicateBy) === 'eMail' && params.Email) {
      this.clickEmailFieldAddSignerModal();
      this.typeEmailFieldAddSignerModal(params.Email);
    }

    this.typeNameFieldAddSignerModal(params['Nome completo']);

    if (params.cpf) {
      this.typeCpfFieldAddSignerModal(params.cpf);
      this.typeBirthdayFieldAddSignerModal(params['Data de nascimento']);
    } else {
      this.checkHasDocumentationCheckbox();
    }

    if (!params['Salvar na agenda']) {
      this.toggleSaveAsContactCheckbox();
    }
  },

  selectSignAs(options) {
    this.clickSignerSignAsSelect();
    options.forEach((o) => {
      const optionDataTestId = camelCase(`selectField ${signaturesKind[o]} option`);
      this.clickButton(optionDataTestId);
    });

    this.clickSignerSignAsSelect();
  },

  saveSelectSignAs(params) {
    this.selectSignAs(params);
    cy.get('[data-testid=nextStepAddSignerModalButton]').first().click();
  },

  clickNextStepBtn() {
    cy.get('[data-testid=nextStepBtn]').first().click();
  },

  addSignerToDocument(params) {
    this.clickAddSignerButton();
    this.addSignerDetails(params);
    this.clickNextStepAddSignerModalButton();
    this.saveSelectSignAs(params['Assinar como']);
  },

  clickNextStepButton() {
    this.clickButton('nextStepButton');
  },

  selectAddClausesOption() {
    cy.get('[data-testid=addClausesRadioButton]').click();
  },

  selectSignerClauseCheckbox(index = 0) {
    cy.get(`[data-testid=clause-checkbox-${index}]`).click();
  },

  clickMenu() {
    cy.get('[data-testid="profileMenu"]').click();
  },

  shouldSignerAreaLink() {
    cy.get('[data-testid="signerAreaLink"]').should('be.visible');
  },

  shouldSignerAreaLinkNotVisible() {
    cy.get('[data-testid="signerAreaLink"]').should('have.length', 0);
  },
};
