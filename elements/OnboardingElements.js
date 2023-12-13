import { faker } from '@faker-js/faker';

export default {
  onboardingModal: ['containerable'],
  nameField: ['typeable'],
  segmentSelect: ['selectable'],
  documentsAmountSelect: ['selectable'],
  reasonSelect: ['selectable'],
  phoneNumberField: ['typeable'],
  submitButton: ['clickable'],
  accountTypePersonalButton: ['clickable'],
  accountTypeBusinessButton: ['clickable'],
  loadingAccountModal: ['containerable'],
  chooseAccountTypeModal: ['containerable'],
  formAccountInfoModal: ['containerable'],
  emailValidationModal: ['containerable'],
  getCompanyName() {
    return faker.commerce.productName();
  },
  getUserName() {
    return `${faker.name.firstName()} ${faker.name.lastName()}`;
  },
  getUserEmail() {
    return faker.internet.email();
  },
  getPhoneNumber() {
    return faker.phone.phoneNumber('(99) 99###-####');
  },
};
