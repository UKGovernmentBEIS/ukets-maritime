import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { PayloadMutator } from '@netz/common/forms';

import { TaskItemStatus } from '@requests/common';
import { REVIEW_REPORT_SUMMARY_SUBTASK } from '@requests/common/vir';
import { VirReviewReportSummaryWizardStep } from '@requests/tasks/vir-review/subtasks/report-summary/report-summary.helpers';
import { ReportSummaryFormModel } from '@requests/tasks/vir-review/subtasks/report-summary/report-summary-form/report-summary-form.types';
import { VirReviewTaskPayload } from '@requests/tasks/vir-review/vir-review.types';

export class ReportSummaryFormPayloadMutator extends PayloadMutator {
  public readonly subtask: string = REVIEW_REPORT_SUMMARY_SUBTASK;
  public readonly step: string = VirReviewReportSummaryWizardStep.REPORT;

  public apply(
    currentPayload: VirReviewTaskPayload,
    userInput: ReportSummaryFormModel,
  ): Observable<VirReviewTaskPayload> {
    return of(
      produce(currentPayload, (payload: VirReviewTaskPayload) => {
        payload.regulatorReviewResponse = {
          ...payload.regulatorReviewResponse,
          ...userInput,
        };

        payload.sectionsCompleted[this.subtask] = TaskItemStatus.IN_PROGRESS;
      }),
    );
  }
}
