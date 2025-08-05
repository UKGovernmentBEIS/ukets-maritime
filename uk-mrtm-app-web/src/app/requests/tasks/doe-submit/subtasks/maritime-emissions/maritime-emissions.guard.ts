import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { doeCommonQuery } from '@requests/common/doe';
import { MaritimeEmissionsWizardStep } from '@requests/tasks/doe-submit/subtasks/maritime-emissions/maritime-emissions.helper';
import { isWizardCompleted } from '@requests/tasks/doe-submit/subtasks/maritime-emissions/maritime-emissions.wizard';

export const canActivateMaritimeEmissionsStep: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const change = route.queryParamMap.get('change') === 'true';
  const maritimeEmissions = store.select(doeCommonQuery.selectMaritimeEmissions)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return (
    (isEditable && (!isWizardCompleted(maritimeEmissions) || change)) ||
    createUrlTreeFromSnapshot(route, [MaritimeEmissionsWizardStep.SUMMARY])
  );
};

export const canActivateMaritimeEmissionsSummary: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const maritimeEmissions = store.select(doeCommonQuery.selectMaritimeEmissions)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return (
    !isEditable ||
    (isEditable && isWizardCompleted(maritimeEmissions)) ||
    createUrlTreeFromSnapshot(route, ['./', MaritimeEmissionsWizardStep.DETERMINATION_REASON])
  );
};
