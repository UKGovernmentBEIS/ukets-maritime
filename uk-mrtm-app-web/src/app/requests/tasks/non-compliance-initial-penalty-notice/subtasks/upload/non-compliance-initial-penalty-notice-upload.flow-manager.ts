import { Observable, of } from 'rxjs';

import { WizardFlowManager } from '@netz/common/forms';

import {
  NON_COMPLIANCE_INITIAL_PENALTY_NOTICE_UPLOAD_SUB_TASK,
  NonComplianceInitialPenaltyNoticeUploadStep,
} from '@requests/common/non-compliance';

export class NonComplianceInitialPenaltyNoticeUploadFlowManager extends WizardFlowManager {
  readonly subtask = NON_COMPLIANCE_INITIAL_PENALTY_NOTICE_UPLOAD_SUB_TASK;

  nextStepPath(currentStep: string): Observable<string> {
    switch (currentStep) {
      case NonComplianceInitialPenaltyNoticeUploadStep.UPLOAD_FORM:
        return of(NonComplianceInitialPenaltyNoticeUploadStep.SUMMARY);

      case NonComplianceInitialPenaltyNoticeUploadStep.SUMMARY:
        return of('../');

      default:
        return of('../../');
    }
  }
}
