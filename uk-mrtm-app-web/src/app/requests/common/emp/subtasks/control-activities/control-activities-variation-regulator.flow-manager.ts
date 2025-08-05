import { Observable, of } from 'rxjs';

import { EmissionsMonitoringPlan } from '@mrtm/api';

import { WizardFlowManager } from '@netz/common/forms';

import {
  CONTROL_ACTIVITIES_SUB_TASK,
  ControlActivitiesWizardStep,
} from '@requests/common/emp/subtasks/control-activities/control-activities.helpers';

export class ControlActivitiesVariationRegulatorFlowManager extends WizardFlowManager {
  override subtask: keyof EmissionsMonitoringPlan = CONTROL_ACTIVITIES_SUB_TASK;

  nextStepPath(currentStep: string): Observable<string> {
    switch (currentStep) {
      case ControlActivitiesWizardStep.QUALITY_ASSURANCE:
        return of(`../${ControlActivitiesWizardStep.INTERNAL_REVIEWS}`);
      case ControlActivitiesWizardStep.INTERNAL_REVIEWS:
        return of(`../${ControlActivitiesWizardStep.CORRECTIONS}`);
      case ControlActivitiesWizardStep.CORRECTIONS:
        return of(`../${ControlActivitiesWizardStep.OUTSOURCED_ACTIVITIES}`);
      case ControlActivitiesWizardStep.OUTSOURCED_ACTIVITIES:
        return of(`../${ControlActivitiesWizardStep.DOCUMENTATION}`);
      case ControlActivitiesWizardStep.DOCUMENTATION:
        return of(`../${ControlActivitiesWizardStep.VARIATION_REGULATOR_DECISION}`);
      case ControlActivitiesWizardStep.VARIATION_REGULATOR_DECISION:
        return of(ControlActivitiesWizardStep.SUMMARY);
      default:
        return of('../../');
    }
  }
}
