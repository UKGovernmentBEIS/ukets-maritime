import { Observable, of } from 'rxjs';

import { WizardFlowManager } from '@netz/common/forms';

import { REVIEW_REPORT_SUMMARY_SUBTASK } from '@requests/common/vir';
import { VirReviewReportSummaryWizardStep } from '@requests/tasks/vir-review/subtasks/report-summary/report-summary.helpers';

export class ReportSummaryFlowManager extends WizardFlowManager {
  public readonly subtask: string = REVIEW_REPORT_SUMMARY_SUBTASK;

  public nextStepPath(currentStep: string): Observable<string> {
    switch (currentStep) {
      case VirReviewReportSummaryWizardStep.REPORT:
        return of('../');
      default:
        return of('../../');
    }
  }
}
