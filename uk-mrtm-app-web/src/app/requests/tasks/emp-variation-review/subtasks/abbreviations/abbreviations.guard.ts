import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { empCommonQuery, empVariationReviewQuery } from '@requests/common/emp/+state';
import {
  ABBREVIATIONS_SUB_TASK,
  AbbreviationsWizardStep,
  isAbbreviationsCompleted,
} from '@requests/common/emp/subtasks/abbreviations';

export const canActivateAbbreviationsSummary: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const abbreviations = store.select(empCommonQuery.selectAbbreviations)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  const isSubtaskCompleted =
    isAbbreviationsCompleted(abbreviations) &&
    store.select(empVariationReviewQuery.selectSubtaskHasDecision(ABBREVIATIONS_SUB_TASK))();

  return (
    !isEditable ||
    (isEditable && isSubtaskCompleted) ||
    createUrlTreeFromSnapshot(route, ['./', AbbreviationsWizardStep.DECISION])
  );
};
