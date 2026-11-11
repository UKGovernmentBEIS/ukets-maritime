import { buildSaveNotFoundError, buildViewNotFoundError, BusinessError } from '@netz/common/error';

const externalContactBusinessLink: Pick<BusinessError, 'link' | 'linkText' | 'fragment'> = {
  link: ['/service-access'],
  fragment: 'external-contacts',
  linkText: 'Return to external contacts page',
};

export const viewNotFoundExternalContactError = buildViewNotFoundError().withLink(externalContactBusinessLink);

export const saveNotFoundExternalContactError = buildSaveNotFoundError().withLink(externalContactBusinessLink);
