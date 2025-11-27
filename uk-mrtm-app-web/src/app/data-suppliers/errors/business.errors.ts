import { BusinessError } from '@netz/common/error';

import { DATA_SUPPLIERS_ROUTE_PREFIX } from '@data-suppliers/data-suppliers.constants';

const dataSuppliersLink = function (): Pick<BusinessError, 'link' | 'linkText'> {
  return { linkText: 'Return to: Manage data suppliers', link: [`../${DATA_SUPPLIERS_ROUTE_PREFIX}`] };
};

export const thirdPartyDataProviderNameAlreadyExist = (): BusinessError =>
  new BusinessError('The name of the data supplier already exists. Enter a unique name.').withLink(dataSuppliersLink());

export const thirdPartyDataProviderUrlAlreadyExist = (): BusinessError =>
  new BusinessError('The Public key URL already exists. Enter a unique name.').withLink(dataSuppliersLink());
