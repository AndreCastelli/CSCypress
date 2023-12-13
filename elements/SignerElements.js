import { camelCase } from 'lodash';
import commonComponents from '../page_objects/commonComponents';

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
  addSignerButton: ['clickable'],
  signerSignAsField: ['clickable'],
  nextStepAddSignerModalButton: ['clickable'],
  pendingSignerNameLabel: [],
  pendingSignerEmailLabel: [],
  pendingSignedAsLabel: [],
  addRandomSignerDetails(params) {
    const mappedParams = {
      Email: params.email,
      'Nome completo': params.name,
      'Autenticação obrigatória': params.auth,
      'Método de envio': 'e-mail',
    };

    commonComponents.addSignerDetails(mappedParams);
  },

  selectSignAs(options) {
    cy.get('[data-testid="signerSignAsSelect"]').click();
    options.forEach((o) => {
      const optionDataTestId = camelCase(`selectField ${signaturesKind[o]} option`);
      cy.get(`[data-testid="${optionDataTestId}"]`).click();
    });

    cy.get('[data-testid="signerSignAsSelect"]').click();
  },
};
