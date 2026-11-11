import { ThirdPartyDataProviderCreateDTO } from '@mrtm/api';

export type DataSupplierItem = ThirdPartyDataProviderCreateDTO & { clientId?: string };

export interface DataSuppliersState {
  isEditable?: boolean;
  items?: Array<DataSupplierItem>;
  newItem?: ThirdPartyDataProviderCreateDTO;
}
