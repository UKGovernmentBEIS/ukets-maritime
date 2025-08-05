import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { empVariationQuery } from '@requests/common/emp/+state/emp-variation.selectors';
import { empVariationAmendsQuery } from '@requests/common/emp/+state/emp-variation-amends.selectors';

export const sendVariationApplicationGuard: CanActivateFn = (route) => {
  const store: RequestTaskStore = inject(RequestTaskStore);
  const isEmpSectionCompleted =
    store.select(requestTaskQuery.selectRequestTaskType)() === 'EMP_VARIATION_APPLICATION_SUBMIT'
      ? store.select(empVariationQuery.selectIsEmpSectionCompleted)()
      : store.select(empVariationAmendsQuery.selectIsEmpSectionCompleted)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return (isEmpSectionCompleted && isEditable) || createUrlTreeFromSnapshot(route, ['../../']);
};
