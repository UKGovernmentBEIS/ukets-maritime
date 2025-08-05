import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { empCommonQuery } from '@requests/common/emp/+state';
import { EmissionSourcesWizardStep } from '@requests/common/emp/subtasks/emission-sources/emission-sources.helper';
import { isEmissionSourcesCompleted } from '@requests/common/emp/subtasks/emission-sources/emission-sources.wizard';

export const canActivateEmissionSourcesStep =
  (fallbackStep: EmissionSourcesWizardStep = EmissionSourcesWizardStep.SUMMARY): CanActivateFn =>
  (route) => {
    const store = inject(RequestTaskStore);
    const change = route.queryParamMap.get('change') === 'true';

    const emissionSources = store.select(empCommonQuery.selectEmissionSources)();
    const isEditable = store.select(requestTaskQuery.selectIsEditable)();

    if (!isEditable) return createUrlTreeFromSnapshot(route, [EmissionSourcesWizardStep.SUMMARY]);

    const fallbackRedirect =
      fallbackStep === EmissionSourcesWizardStep.SUMMARY ? [fallbackStep] : ['../', fallbackStep];

    return !isEmissionSourcesCompleted(emissionSources) || change || createUrlTreeFromSnapshot(route, fallbackRedirect);
  };

export const canActivateEmissionSourcesDecision: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  if (!isEditable) return createUrlTreeFromSnapshot(route, [EmissionSourcesWizardStep.SUMMARY]);

  return true;
};

export const canActivateEmissionSourcesSummary: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const empMonitoringEmissionSources = store.select(empCommonQuery.selectEmissionSources)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return (
    !isEditable ||
    (isEditable && isEmissionSourcesCompleted(empMonitoringEmissionSources)) ||
    createUrlTreeFromSnapshot(route, ['./', EmissionSourcesWizardStep.LIST_COMPLETION])
  );
};
