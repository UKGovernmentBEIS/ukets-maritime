import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { empCommonQuery, empReviewQuery } from '@requests/common/emp/+state';
import {
  EMISSION_SOURCES_SUB_TASK,
  EmissionSourcesWizardStep,
  isEmissionSourcesCompleted,
} from '@requests/common/emp/subtasks/emission-sources';

export const canActivateEmissionSourcesSummary: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const emissionSources = store.select(empCommonQuery.selectEmissionSources)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const isSubtaskCompleted =
    isEmissionSourcesCompleted(emissionSources) &&
    store.select(empReviewQuery.selectSubtaskHasDecision(EMISSION_SOURCES_SUB_TASK))();

  return (
    !isEditable ||
    (isEditable && isSubtaskCompleted) ||
    createUrlTreeFromSnapshot(route, ['./', EmissionSourcesWizardStep.DECISION])
  );
};
