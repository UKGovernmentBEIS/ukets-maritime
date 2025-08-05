import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { RequestTaskStore } from '@netz/common/store';

import { empVariationRegulatorQuery } from '@requests/common/emp/+state';

export const canActivateEmpVariationRegulatorActions: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);

  const hasAccess = store.select(empVariationRegulatorQuery.selectAreAllSectionsAccepted)();

  return hasAccess || createUrlTreeFromSnapshot(route, ['../../']);
};
