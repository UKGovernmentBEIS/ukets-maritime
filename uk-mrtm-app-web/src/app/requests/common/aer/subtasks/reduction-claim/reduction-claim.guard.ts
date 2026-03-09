import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { aerCommonQuery } from '@requests/common/aer/+state';
import {
  aerReductionClaimStepsCompleted,
  isWizardCompleted,
  ReductionClaimWizardStep,
} from '@requests/common/aer/subtasks/reduction-claim/reduction-claim.helpers';
import { TaskItemStatus } from '@requests/common/task-item-status';

export const canActivateReductionClaimSubtask: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const store: RequestTaskStore = inject(RequestTaskStore);
  const status = store.select(aerCommonQuery.selectStatusForReductionClaim)();

  return status !== TaskItemStatus.CANNOT_START_YET || createUrlTreeFromSnapshot(route, ['../']);
};

export const canActivateReductionClaimSummary: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const store: RequestTaskStore = inject(RequestTaskStore);
  const status = store.select(aerCommonQuery.selectStatusForReductionClaim)();
  const reductionClaim = store.select(aerCommonQuery.selectReductionClaim)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return (
    !isEditable ||
    (isEditable && (status === TaskItemStatus.COMPLETED || isWizardCompleted(reductionClaim))) ||
    createUrlTreeFromSnapshot(route, ['./', ReductionClaimWizardStep.EXIST])
  );
};

export const canActivateReductionClaimDetails: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const store: RequestTaskStore = inject(RequestTaskStore);
  const reductionClaim = store.select(aerCommonQuery.selectReductionClaim)();

  return (
    aerReductionClaimStepsCompleted['exist'](reductionClaim) ||
    createUrlTreeFromSnapshot(route, ['../', ReductionClaimWizardStep.EXIST])
  );
};
