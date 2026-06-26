import { FormControl } from '@angular/forms';

import { AutocompleteSelectOption } from '@shared/components';
import { DashboardFiltersAndOrderBy } from '@shared/dashboard';

export type DashboardFiltersFormGroupModel = Record<
  keyof (Omit<DashboardFiltersAndOrderBy, 'accountId'> & { accountId?: AutocompleteSelectOption }),
  FormControl
>;
