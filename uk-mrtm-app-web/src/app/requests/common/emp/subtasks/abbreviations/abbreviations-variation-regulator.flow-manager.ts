import { Observable, of } from 'rxjs';

import { EmissionsMonitoringPlan } from '@mrtm/api';

import { WizardFlowManager } from '@netz/common/forms';

import {
  ABBREVIATIONS_SUB_TASK,
  AbbreviationsWizardStep,
} from '@requests/common/emp/subtasks/abbreviations/abbreviations.helper';

export class AbbreviationsVariationRegulatorFlowManager extends WizardFlowManager {
  override subtask: keyof EmissionsMonitoringPlan = ABBREVIATIONS_SUB_TASK;

  nextStepPath(currentStep: string): Observable<string> {
    switch (currentStep) {
      case AbbreviationsWizardStep.ABBREVIATIONS_QUESTION:
        return of(`../${AbbreviationsWizardStep.VARIATION_REGULATOR_DECISION}`);
      case AbbreviationsWizardStep.VARIATION_REGULATOR_DECISION:
        return of(AbbreviationsWizardStep.SUMMARY);
      default:
        return of('../../');
    }
  }
}
