import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { empCommonQuery, empReviewQuery } from '@requests/common/emp/+state';
import { DATA_GAPS_SUB_TASK, DataGapsWizardStep, isDataGapsCompleted } from '@requests/common/emp/subtasks/data-gaps';

export const canActivateDataGapsSummary: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const dataGaps = store.select(empCommonQuery.selectDataGaps)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const isSubtaskCompleted =
    isDataGapsCompleted(dataGaps) && store.select(empReviewQuery.selectSubtaskHasDecision(DATA_GAPS_SUB_TASK))();

  return (
    !isEditable ||
    (isEditable && isSubtaskCompleted) ||
    createUrlTreeFromSnapshot(route, ['./', DataGapsWizardStep.DECISION])
  );
};
