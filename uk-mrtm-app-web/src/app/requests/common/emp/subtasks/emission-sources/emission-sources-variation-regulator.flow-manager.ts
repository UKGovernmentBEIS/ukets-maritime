import { Observable, of } from 'rxjs';

import { EmissionsMonitoringPlan } from '@mrtm/api';

import { WizardFlowManager } from '@netz/common/forms';

import {
  EMISSION_SOURCES_SUB_TASK,
  EmissionSourcesWizardStep,
} from '@requests/common/emp/subtasks/emission-sources/emission-sources.helper';

export class EmissionSourcesVariationRegulatorFlowManager extends WizardFlowManager {
  override subtask: keyof EmissionsMonitoringPlan = EMISSION_SOURCES_SUB_TASK;

  nextStepPath(currentStep: string): Observable<string> {
    switch (currentStep) {
      case EmissionSourcesWizardStep.LIST_COMPLETION:
        return of(`../${EmissionSourcesWizardStep.EMISSION_FACTORS}`);
      case EmissionSourcesWizardStep.EMISSION_FACTORS:
        return of(`../${EmissionSourcesWizardStep.VARIATION_REGULATOR_DECISION}`);
      case EmissionSourcesWizardStep.VARIATION_REGULATOR_DECISION:
        return of(EmissionSourcesWizardStep.SUMMARY);
      default:
        return of('../../');
    }
  }
}
