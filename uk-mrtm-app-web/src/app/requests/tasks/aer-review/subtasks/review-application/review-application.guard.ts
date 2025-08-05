import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { TaskItemStatus } from '@requests/common';
import { AER_REVIEW_GROUP, AER_REVIEW_SUBTASK, AerReviewWizardSteps } from '@requests/tasks/aer-review';
import { aerReviewQuery } from '@requests/tasks/aer-review/+state';

export const canActivateReviewApplication: CanActivateFn = (activatedRouteSnapshot: ActivatedRouteSnapshot) => {
  const subtask = inject(AER_REVIEW_SUBTASK);
  const group = inject(AER_REVIEW_GROUP);
  const store = inject(RequestTaskStore);

  const editable = store.select(requestTaskQuery.selectIsEditable)();
  const subtaskStatus = store.select(aerReviewQuery.selectStatusForSubtask(subtask))();
  const hasReviewDecision = store.select(aerReviewQuery.selectSubtaskHasDecision(group))();

  return (
    !editable ||
    subtaskStatus === TaskItemStatus.ACCEPTED ||
    hasReviewDecision ||
    createUrlTreeFromSnapshot(activatedRouteSnapshot, ['./', AerReviewWizardSteps.FORM])
  );
};
