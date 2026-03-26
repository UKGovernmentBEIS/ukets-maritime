import { ThirdPartyDataProviderCreateDTO } from '@mrtm/api';

import { isNil } from '@shared/utils';

export const isDataSupplierValid = (dataSupplier: ThirdPartyDataProviderCreateDTO): boolean =>
  !isNil(dataSupplier?.name);
