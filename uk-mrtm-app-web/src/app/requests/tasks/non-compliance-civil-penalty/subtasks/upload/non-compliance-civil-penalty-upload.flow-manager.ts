import { Observable, of } from 'rxjs';

import { WizardFlowManager } from '@netz/common/forms';

import {
  NON_COMPLIANCE_CIVIL_PENALTY_UPLOAD_SUB_TASK,
  NonComplianceCivilPenaltyUploadStep,
} from '@requests/common/non-compliance';

export class NonComplianceCivilPenaltyUploadFlowManager extends WizardFlowManager {
  readonly subtask = NON_COMPLIANCE_CIVIL_PENALTY_UPLOAD_SUB_TASK;

  nextStepPath(currentStep: string): Observable<string> {
    switch (currentStep) {
      case NonComplianceCivilPenaltyUploadStep.UPLOAD_FORM:
        return of(NonComplianceCivilPenaltyUploadStep.SUMMARY);

      case NonComplianceCivilPenaltyUploadStep.SUMMARY:
        return of('../');

      default:
        return of('../../');
    }
  }
}
