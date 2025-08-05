import {
  buildSaveNotFoundError,
  buildSavePartiallyNotFoundError,
  buildViewNotFoundError,
  BusinessError,
} from '@netz/common/error';

const siteContactBusinessLink: Pick<BusinessError, 'link' | 'linkText' | 'fragment'> = {
  link: ['/user/verifiers'],
  linkText: 'Return to: Site contacts page',
  fragment: 'site-contacts',
};

const verifierBusinessLink: Pick<BusinessError, 'link' | 'linkText' | 'fragment'> = {
  link: ['/user/verifiers'],
  fragment: 'verifier-users',
  linkText: 'Return to manage verifier users page',
};

export const savePartiallyNotFoundSiteContactError =
  buildSavePartiallyNotFoundError().withLink(siteContactBusinessLink);

export const saveNotFoundVerifierError = buildSaveNotFoundError().withLink(verifierBusinessLink);

export const viewNotFoundVerifierError = buildViewNotFoundError().withLink(verifierBusinessLink);
