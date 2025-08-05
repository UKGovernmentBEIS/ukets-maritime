import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { TaskItemStatus } from '@requests/common';
import { virRespondToRegulatorCommentsQuery } from '@requests/tasks/vir-respond-to-regulator-comments/+state';
import {
  isWizardCompleted,
  VirRespondToRegulatorWizardStep,
} from '@requests/tasks/vir-respond-to-regulator-comments/subtasks/respond-to-regulator/respond-to-regulator.helpers';

export const canActivateVirRespondToRegulatorSummary: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const store = inject(RequestTaskStore);
  const key = route.params?.['key'];
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const subtaskStatus = store.select(
    virRespondToRegulatorCommentsQuery.selectStatusForOperatorImprovementResponseData(key),
  )();
  const operatorResponse = store.select(
    virRespondToRegulatorCommentsQuery.selectOperatorImprovementResponseData(key),
  )();

  return (
    !isEditable ||
    (isEditable && (subtaskStatus === TaskItemStatus.COMPLETED || isWizardCompleted(operatorResponse))) ||
    createUrlTreeFromSnapshot(route, [VirRespondToRegulatorWizardStep.FORM])
  );
};
