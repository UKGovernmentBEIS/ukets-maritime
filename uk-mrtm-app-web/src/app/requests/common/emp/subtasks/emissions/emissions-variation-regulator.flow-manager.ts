import { Observable, of } from 'rxjs';

import { EmissionsMonitoringPlan } from '@mrtm/api';

import { WizardFlowManager } from '@netz/common/forms';

import { EMISSIONS_SUB_TASK } from '@requests/common/components/emissions/emissions.helpers';
import { EmissionsWizardStep } from '@requests/common/emp/subtasks/emissions/emissions.helpers';

export class EmissionsVariationRegulatorFlowManager extends WizardFlowManager {
  subtask: keyof EmissionsMonitoringPlan = EMISSIONS_SUB_TASK;

  nextStepPath(currentStep: string): Observable<string> {
    switch (currentStep) {
      case EmissionsWizardStep.BASIC_DETAILS:
        return of(`../${EmissionsWizardStep.FUELS_AND_EMISSIONS_LIST}`);
      case EmissionsWizardStep.FUELS_AND_EMISSIONS_FORM:
        return of(`../../${EmissionsWizardStep.FUELS_AND_EMISSIONS_LIST}`);
      case EmissionsWizardStep.FUELS_AND_EMISSIONS_LIST:
        return of('./');
      case EmissionsWizardStep.EMISSION_SOURCES_FORM:
        return of(`../../${EmissionsWizardStep.EMISSION_SOURCES_LIST}`);
      case EmissionsWizardStep.EMISSION_SOURCES_LIST:
        return of('./');
      case EmissionsWizardStep.UNCERTAINTY_LEVEL:
        return of(`../${EmissionsWizardStep.MEASUREMENTS}`);
      case EmissionsWizardStep.MEASUREMENTS:
        return of(`../${EmissionsWizardStep.CARBON_CAPTURE}`);
      case EmissionsWizardStep.CARBON_CAPTURE:
        return of(`../${EmissionsWizardStep.EXEMPTION_CONDITIONS}`);
      case EmissionsWizardStep.EXEMPTION_CONDITIONS:
        return of(`../`);
      case EmissionsWizardStep.UPLOAD_SHIPS:
      case EmissionsWizardStep.DELETE_SHIPS:
        return of(`../${EmissionsWizardStep.LIST_OF_SHIPS}`);
      case EmissionsWizardStep.VARIATION_REGULATOR_DECISION:
        return of(EmissionsWizardStep.SUMMARY);
      default:
        return of('../../');
    }
  }
}
