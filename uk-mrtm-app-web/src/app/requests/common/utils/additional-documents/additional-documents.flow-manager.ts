import { Observable, of } from 'rxjs';

import { EmissionsMonitoringPlan } from '@mrtm/api';

import { WizardFlowManager } from '@netz/common/forms';

import {
  ADDITIONAL_DOCUMENTS_SUB_TASK,
  AdditionalDocumentsWizardStep,
} from '@requests/common/utils/additional-documents';

export class AdditionalDocumentsFlowManager extends WizardFlowManager {
  override subtask: keyof EmissionsMonitoringPlan = ADDITIONAL_DOCUMENTS_SUB_TASK;

  nextStepPath(currentStep: string): Observable<string> {
    switch (currentStep) {
      case AdditionalDocumentsWizardStep.ADDITIONAL_DOCUMENTS_UPLOAD:
        return of(AdditionalDocumentsWizardStep.SUMMARY);
      default:
        return of('../../');
    }
  }
}
