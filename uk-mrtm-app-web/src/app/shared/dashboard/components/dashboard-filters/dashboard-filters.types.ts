import { FormControl } from '@angular/forms';

import { AccountSearchResultInfoDTO } from '@mrtm/api';

import { AutocompleteSelectOption } from '@shared/components';
import { MrtmRequestType } from '@shared/types';

export interface DashboardFiltersAndOrderBy {
  accountId?: AutocompleteSelectOption<AccountSearchResultInfoDTO['businessId']>;
  workflowType?: MrtmRequestType;
  orderBy: 'NEWEST_FIRST' | 'NEAREST_DUE_DATE';
}

export type DashboardFiltersFormGroupModel = Record<
  keyof (Omit<DashboardFiltersAndOrderBy, 'accountId'> & { accountId?: AutocompleteSelectOption }),
  FormControl
>;
