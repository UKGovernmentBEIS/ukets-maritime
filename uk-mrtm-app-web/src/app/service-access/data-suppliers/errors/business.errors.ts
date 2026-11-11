import { BusinessError } from '@netz/common/error';

const dataSuppliersLink = function (): Pick<BusinessError, 'link' | 'linkText' | 'fragment'> {
  return { linkText: 'Return to: Service access', link: ['/service-access'], fragment: 'data-suppliers' };
};

export const thirdPartyDataProviderNameAlreadyExist = (): BusinessError =>
  new BusinessError('The name of the data supplier already exists. Enter a unique name.').withLink(dataSuppliersLink());

export const thirdPartyDataProviderUrlAlreadyExist = (): BusinessError =>
  new BusinessError('The Public key URL already exists. Enter a unique name.').withLink(dataSuppliersLink());
