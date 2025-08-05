import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { SideEffect } from '@netz/common/forms';

import { TaskItemStatus } from '@requests/common';
import { REVIEW_REPORT_SUMMARY_SUBTASK } from '@requests/common/vir';
import { VirReviewReportSummaryWizardStep } from '@requests/tasks/vir-review/subtasks/report-summary/report-summary.helpers';
import { VirReviewTaskPayload } from '@requests/tasks/vir-review/vir-review.types';

export class ReportSummarySideEffect extends SideEffect {
  public readonly step: VirReviewReportSummaryWizardStep.SUMMARY;
  public readonly subtask: string = REVIEW_REPORT_SUMMARY_SUBTASK;
  public readonly on: [string] = ['SUBMIT_SUBTASK'];

  apply(currentPayload: VirReviewTaskPayload): Observable<VirReviewTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        payload.sectionsCompleted[this.subtask] = TaskItemStatus.COMPLETED;
      }),
    );
  }
}
