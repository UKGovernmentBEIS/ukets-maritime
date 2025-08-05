import { Observable, of } from 'rxjs';

import { EmissionsMonitoringPlan } from '@mrtm/api';

import { WizardFlowManager } from '@netz/common/forms';

import {
  GREENHOUSE_GAS_SUB_TASK,
  GreenhouseGasWizardStep,
} from '@requests/common/emp/subtasks/greenhouse-gas/greenhouse-gas.helper';

export class GreenhouseGasVariationRegulatorFlowManager extends WizardFlowManager {
  override subtask: keyof EmissionsMonitoringPlan = GREENHOUSE_GAS_SUB_TASK;

  nextStepPath(currentStep: string): Observable<string> {
    switch (currentStep) {
      case GreenhouseGasWizardStep.FUEL:
        return of(`../${GreenhouseGasWizardStep.CROSS_CHECK}`);
      case GreenhouseGasWizardStep.CROSS_CHECK:
        return of(`../${GreenhouseGasWizardStep.INFORMATION}`);
      case GreenhouseGasWizardStep.INFORMATION:
        return of(`../${GreenhouseGasWizardStep.QA_EQUIPMENT}`);
      case GreenhouseGasWizardStep.QA_EQUIPMENT:
        return of(`../${GreenhouseGasWizardStep.VOYAGES}`);
      case GreenhouseGasWizardStep.VOYAGES:
        return of(`../${GreenhouseGasWizardStep.VARIATION_REGULATOR_DECISION}`);
      case GreenhouseGasWizardStep.VARIATION_REGULATOR_DECISION:
        return of(GreenhouseGasWizardStep.SUMMARY);
      default:
        return of('../../');
    }
  }
}
