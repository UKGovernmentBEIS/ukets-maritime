import {
  buildSaveNotFoundError,
  buildSavePartiallyNotFoundError,
  buildViewNotFoundError,
  BusinessError,
} from '@netz/common/error';

const regulatorBusinessLink: Pick<BusinessError, 'link' | 'linkText' | 'fragment'> = {
  link: ['/service-access'],
  fragment: 'regulator-users',
  linkText: 'Return to regulator users page',
};

export const saveNotFoundRegulatorError = buildSaveNotFoundError().withLink(regulatorBusinessLink);

export const savePartiallyNotFoundRegulatorError = buildSavePartiallyNotFoundError().withLink(regulatorBusinessLink);

export const viewNotFoundRegulatorError = buildViewNotFoundError().withLink(regulatorBusinessLink);
