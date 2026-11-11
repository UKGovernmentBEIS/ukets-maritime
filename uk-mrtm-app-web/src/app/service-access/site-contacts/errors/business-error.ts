import { buildSavePartiallyNotFoundError, BusinessError } from '@netz/common/error';

const siteContactBusinessLink: Pick<BusinessError, 'link' | 'linkText' | 'fragment'> = {
  link: ['/service-access'],
  fragment: 'site-contacts',
  linkText: 'Return to site contacts page',
};

export const savePartiallyNotFoundSiteContactError =
  buildSavePartiallyNotFoundError().withLink(siteContactBusinessLink);
