import { Observable, of } from 'rxjs';

import { EmissionsMonitoringPlanNotification } from '@mrtm/api';

import { WizardFlowManager } from '@netz/common/forms';

import {
  DETAILS_CHANGE_SUB_TASK,
  DetailsChangeWizardStep,
} from '@requests/tasks/notification-submit/subtasks/details-change/details-change.helper';

export class DetailsChangeFlowManager extends WizardFlowManager {
  override subtask: keyof EmissionsMonitoringPlanNotification = DETAILS_CHANGE_SUB_TASK;

  nextStepPath(currentStep: string): Observable<string> {
    switch (currentStep) {
      case DetailsChangeWizardStep.NON_SIGNIFICANT_CHANGE:
        return of(DetailsChangeWizardStep.SUMMARY);

      default:
        return of('../../');
    }
  }
}
