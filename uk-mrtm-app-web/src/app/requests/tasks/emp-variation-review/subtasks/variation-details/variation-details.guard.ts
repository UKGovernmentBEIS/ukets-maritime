import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { empVariationQuery, empVariationReviewQuery } from '@requests/common';
import { VariationDetailsWizardStep } from '@requests/common/emp/subtasks/variation-details/variation-details.helper';
import { isVariationDetailsWizardCompleted } from '@requests/common/emp/subtasks/variation-details/variation-details.wizard';
import { isNil } from '@shared/utils';

export const canActivateVariationReviewDetailsSummary: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const variationDetails = store.select(empVariationQuery.selectEmpVariationDetails)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  const isSubtaskCompleted =
    isVariationDetailsWizardCompleted(variationDetails) &&
    !isNil(store.select(empVariationReviewQuery.selectEmpVariationDetailsReviewDecision)());

  return (
    !isEditable ||
    (isEditable && isSubtaskCompleted) ||
    createUrlTreeFromSnapshot(route, ['./', VariationDetailsWizardStep.DECISION])
  );
};
