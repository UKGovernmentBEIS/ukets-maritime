import { isNil } from 'lodash-es';

import { buildSavePartiallyNotFoundError, BusinessError } from '@netz/common/error';

const verificationBodyBusinessLink = (
  verificationBodyId: number,
): Pick<BusinessError, 'link' | 'linkText' | 'fragment'> => ({
  link: ['/verification-bodies/', verificationBodyId],
  fragment: 'contacts',
  linkText: 'Return to manage verification bodies page',
});

const verifierBusinessLink: Pick<BusinessError, 'link' | 'linkText' | 'fragment'> = {
  link: ['/user/verifiers'],
  fragment: 'verifier-users',
  linkText: 'Return to manage verifier users page',
};

export const deleteUniqueActiveVerifierError = (verificationBodyId?: number) =>
  new BusinessError('You must have an active verifier admin on your account').withLink(
    !isNil(verificationBodyId) ? verificationBodyBusinessLink(verificationBodyId) : verifierBusinessLink,
  );

export const savePartiallyNotFoundVerifierError = buildSavePartiallyNotFoundError().withLink(verifierBusinessLink);
