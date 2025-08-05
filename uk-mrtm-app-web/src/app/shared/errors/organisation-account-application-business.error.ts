import { BusinessError, dashboardLink } from '@netz/common/error';

const organisationAccountErrorFactory = (errorFactory: () => BusinessError) => errorFactory().withLink(dashboardLink);

const buildAccountRegistrationNumberExistsError = () => new BusinessError(accountRegistrationNumberExistsMessageError);

export const accountRegistrationNumberExistsMessageError =
  'An organisation account already exists with the same registration number';

export const accountRegistrationNumberExistsError = organisationAccountErrorFactory(
  buildAccountRegistrationNumberExistsError,
);
