import { Observable, of } from 'rxjs';

import { WizardFlowManager } from '@netz/common/forms';

import {
  MONITORING_PLAN_CHANGES_SUB_TASK,
  MonitoringPlanChangesWizardStep,
} from '@requests/common/aer/subtasks/monitoring-plan-changes/monitoring-plan-changes.helpers';

export class MonitoringPlanChangesFlowManager extends WizardFlowManager {
  override subtask = MONITORING_PLAN_CHANGES_SUB_TASK;

  nextStepPath(currentStep: string): Observable<string> {
    switch (currentStep) {
      case MonitoringPlanChangesWizardStep.FORM:
        return of(MonitoringPlanChangesWizardStep.SUMMARY);
      default:
        return of('../../');
    }
  }
}
