import { ThirdPartyDataManagementAvailableToImportItem, ThirdPartyDataManagementImportRequestDTO } from '@mrtm/api';

export type ImportDataState = Partial<
  ThirdPartyDataManagementImportRequestDTO & { rawItems: Array<ThirdPartyDataManagementAvailableToImportItem> }
>;
