import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { empCommonQuery } from '@requests/common/emp/+state';
import {
  isManagementProceduresCompleted,
  ManagementProceduresWizardStep,
} from '@requests/common/emp/subtasks/management-procedures';

export const canActivateManagementProceduresStep =
  (fallbackStep: ManagementProceduresWizardStep = ManagementProceduresWizardStep.SUMMARY): CanActivateFn =>
  (route) => {
    const store = inject(RequestTaskStore);
    const change = route.queryParamMap.get('change') === 'true';

    const managementProcedures = store.select(empCommonQuery.selectManagementProcedures)();
    const isEditable = store.select(requestTaskQuery.selectIsEditable)();

    if (!isEditable) return createUrlTreeFromSnapshot(route, [ManagementProceduresWizardStep.SUMMARY]);

    const fallbackRedirect =
      fallbackStep === ManagementProceduresWizardStep.SUMMARY ? [fallbackStep] : ['../', fallbackStep];

    return (
      !isManagementProceduresCompleted(managementProcedures) ||
      change ||
      createUrlTreeFromSnapshot(route, fallbackRedirect)
    );
  };

export const canActivateManagementProceduresDecision: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  if (!isEditable) return createUrlTreeFromSnapshot(route, [ManagementProceduresWizardStep.SUMMARY]);

  return true;
};

export const canActivateManagementProceduresSummary: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const managementProcedures = store.select(empCommonQuery.selectManagementProcedures)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return (
    !isEditable ||
    (isEditable && isManagementProceduresCompleted(managementProcedures)) ||
    createUrlTreeFromSnapshot(route, ['./', ManagementProceduresWizardStep.MONITORING_REPORTING_ROLES])
  );
};
