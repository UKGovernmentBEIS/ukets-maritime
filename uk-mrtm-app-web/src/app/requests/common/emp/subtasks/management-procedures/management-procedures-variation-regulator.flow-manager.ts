import { Observable, of } from 'rxjs';

import { EmissionsMonitoringPlan } from '@mrtm/api';

import { WizardFlowManager } from '@netz/common/forms';

import {
  MANAGEMENT_PROCEDURES_SUB_TASK,
  ManagementProceduresWizardStep,
} from '@requests/common/emp/subtasks/management-procedures';

export class ManagementProceduresVariationRegulatorFlowManager extends WizardFlowManager {
  override subtask: keyof EmissionsMonitoringPlan = MANAGEMENT_PROCEDURES_SUB_TASK;

  nextStepPath(currentStep: string): Observable<string> {
    switch (currentStep) {
      case ManagementProceduresWizardStep.MONITORING_REPORTING_ROLES:
        return of(`../${ManagementProceduresWizardStep.REGULAR_CHECK_OF_ADEQUACY}`);
      case ManagementProceduresWizardStep.REGULAR_CHECK_OF_ADEQUACY:
        return of(`../${ManagementProceduresWizardStep.DATA_FLOW_ACTIVITIES}`);
      case ManagementProceduresWizardStep.DATA_FLOW_ACTIVITIES:
        return of(`../${ManagementProceduresWizardStep.RISK_ASSESSMENT_PROCEDURES}`);
      case ManagementProceduresWizardStep.RISK_ASSESSMENT_PROCEDURES:
        return of(`../${ManagementProceduresWizardStep.VARIATION_REGULATOR_DECISION}`);
      case ManagementProceduresWizardStep.VARIATION_REGULATOR_DECISION:
        return of(ManagementProceduresWizardStep.SUMMARY);
      default:
        return of('../../');
    }
  }
}
