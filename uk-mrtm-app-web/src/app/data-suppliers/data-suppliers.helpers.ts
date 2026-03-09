import { isNil } from 'lodash-es';

import { ThirdPartyDataProviderCreateDTO } from '@mrtm/api';

export const isDataSupplierValid = (dataSupplier: ThirdPartyDataProviderCreateDTO): boolean =>
  !isNil(dataSupplier?.name);
