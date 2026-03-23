import { ThirdPartyDataProviderCreateDTO } from '@mrtm/api';

import { DataSupplierItem } from '@data-suppliers/data-suppliers.types';

export const mockDataSuppliers: Array<DataSupplierItem> = [
  {
    name: 'Maritime Analytics Ltd',
    clientId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    clientSecret: '1a2b3c4d-5678-90ef-gh12-3456789ijklm',
  },
  {
    name: 'Ocean Data Solutions',
    clientId: 'f7e8d9c0-b1a2-3456-789a-bcdef0123456',
    clientSecret: '1a2b3c4d-5678-90ef-gh12-3456789ijklm',
  },
];

export const singleDataSupplierItemCreateDTO: ThirdPartyDataProviderCreateDTO = {
  name: 'Vessel Tracking Systems Inc',
};
