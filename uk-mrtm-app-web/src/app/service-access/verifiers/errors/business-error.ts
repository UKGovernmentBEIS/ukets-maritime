import { buildSaveNotFoundError, buildViewNotFoundError, BusinessError } from '@netz/common/error';

const verifierBusinessLink: Pick<BusinessError, 'link' | 'linkText' | 'fragment'> = {
  link: ['/service-access'],
  fragment: 'verifier-users',
  linkText: 'Return to: Service access',
};

export const saveNotFoundVerifierError = buildSaveNotFoundError().withLink(verifierBusinessLink);

export const viewNotFoundVerifierError = buildViewNotFoundError().withLink(verifierBusinessLink);
