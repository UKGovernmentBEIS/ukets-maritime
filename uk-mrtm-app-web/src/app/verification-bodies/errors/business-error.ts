import { buildSaveNotFoundError, buildViewNotFoundError, BusinessError } from '@netz/common/error';

const verificationBodyBusinessLink: Pick<BusinessError, 'link' | 'linkText'> = {
  linkText: 'Return to manage verification bodies',
  link: ['/verification-bodies'],
};

export const saveNotFoundVerificationBodyError = buildSaveNotFoundError().withLink(verificationBodyBusinessLink);

export const viewNotFoundVerificationBodyError = buildViewNotFoundError().withLink(verificationBodyBusinessLink);

export const disabledVerificationBodyError = new BusinessError(
  'This action cannot be performed because the verification body has been disabled',
).withLink(verificationBodyBusinessLink);
