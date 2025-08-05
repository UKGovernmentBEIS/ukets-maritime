import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { TaskItemStatus } from '@requests/common';
import { virReviewQuery } from '@requests/tasks/vir-review/+state';
import {
  isWizardCompleted,
  VirReviewReportSummaryWizardStep,
} from '@requests/tasks/vir-review/subtasks/report-summary/report-summary.helpers';

export const canActivateVirReviewReportSummary: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const store = inject(RequestTaskStore);
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const subtaskStatus = store.select(virReviewQuery.selectStatusForReportSummary)();
  const regulatorResponse = store.select(virReviewQuery.selectPayload)()?.regulatorReviewResponse;

  return (
    !isEditable ||
    (isEditable && (subtaskStatus === TaskItemStatus.COMPLETED || isWizardCompleted(regulatorResponse))) ||
    createUrlTreeFromSnapshot(route, [VirReviewReportSummaryWizardStep.REPORT])
  );
};
