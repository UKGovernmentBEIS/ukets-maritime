import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { empCommonQuery } from '@requests/common/emp/+state';
import { DataGapsWizardStep, isDataGapsCompleted } from '@requests/common/emp/subtasks/data-gaps';

export const canActivateDataGapsStep =
  (fallbackStep: DataGapsWizardStep = DataGapsWizardStep.SUMMARY): CanActivateFn =>
  (route) => {
    const store = inject(RequestTaskStore);
    const change = route.queryParamMap.get('change') === 'true';

    const dataGaps = store.select(empCommonQuery.selectDataGaps)();
    const isEditable = store.select(requestTaskQuery.selectIsEditable)();

    if (!isEditable) return createUrlTreeFromSnapshot(route, [DataGapsWizardStep.SUMMARY]);

    const fallbackRedirect = fallbackStep === DataGapsWizardStep.SUMMARY ? [fallbackStep] : ['../', fallbackStep];

    return !isDataGapsCompleted(dataGaps) || change || createUrlTreeFromSnapshot(route, fallbackRedirect);
  };

export const canActivateDataGapsDecision: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  if (!isEditable) return createUrlTreeFromSnapshot(route, [DataGapsWizardStep.SUMMARY]);

  return true;
};

export const canActivateDataGapsSummary: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const dataGaps = store.select(empCommonQuery.selectDataGaps)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return (
    !isEditable ||
    (isEditable && isDataGapsCompleted(dataGaps)) ||
    createUrlTreeFromSnapshot(route, ['./', DataGapsWizardStep.DATA_GAPS_METHOD])
  );
};
