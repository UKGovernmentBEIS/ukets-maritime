import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { empCommonQuery, empReviewQuery } from '@requests/common/emp/+state';
import {
  isManagementProceduresCompleted,
  MANAGEMENT_PROCEDURES_SUB_TASK,
  ManagementProceduresWizardStep,
} from '@requests/common/emp/subtasks/management-procedures';

export const canActivateManagementProceduresSummary: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const managementProcedures = store.select(empCommonQuery.selectManagementProcedures)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const isSubtaskCompleted =
    isManagementProceduresCompleted(managementProcedures) &&
    store.select(empReviewQuery.selectSubtaskHasDecision(MANAGEMENT_PROCEDURES_SUB_TASK))();

  return (
    !isEditable ||
    (isEditable && isSubtaskCompleted) ||
    createUrlTreeFromSnapshot(route, ['./', ManagementProceduresWizardStep.DECISION])
  );
};
