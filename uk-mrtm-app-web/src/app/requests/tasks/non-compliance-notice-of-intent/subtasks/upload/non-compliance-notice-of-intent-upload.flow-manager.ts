import { Observable, of } from 'rxjs';

import { WizardFlowManager } from '@netz/common/forms';

import {
  NON_COMPLIANCE_NOTICE_OF_INTENT_UPLOAD_SUB_TASK,
  NonComplianceNoticeOfIntentUploadStep,
} from '@requests/common/non-compliance';

export class NonComplianceNoticeOfIntentUploadFlowManager extends WizardFlowManager {
  readonly subtask = NON_COMPLIANCE_NOTICE_OF_INTENT_UPLOAD_SUB_TASK;

  nextStepPath(currentStep: string): Observable<string> {
    switch (currentStep) {
      case NonComplianceNoticeOfIntentUploadStep.UPLOAD_FORM:
        return of(NonComplianceNoticeOfIntentUploadStep.SUMMARY);

      case NonComplianceNoticeOfIntentUploadStep.SUMMARY:
        return of('../');

      default:
        return of('../../');
    }
  }
}
