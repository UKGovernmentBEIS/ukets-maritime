import { Observable, of } from 'rxjs';

import { WizardFlowManager } from '@netz/common/forms';

import { AerEmissionsWizardStep } from '@requests/common/aer/subtasks/aer-emissions/aer-emissions.helpers';
import { EMISSIONS_SUB_TASK } from '@requests/common/components/emissions/emissions.helpers';

export class AerEmissionsFlowManager extends WizardFlowManager {
  readonly subtask = EMISSIONS_SUB_TASK;

  nextStepPath(currentStep: string): Observable<string> {
    switch (currentStep) {
      case AerEmissionsWizardStep.LIST_OF_SHIPS:
        return of(AerEmissionsWizardStep.SUMMARY);
      case AerEmissionsWizardStep.BASIC_DETAILS:
        return of(`../${AerEmissionsWizardStep.FUELS_AND_EMISSIONS_LIST}`);
      case AerEmissionsWizardStep.FUELS_AND_EMISSIONS_FORM:
        return of(`../../${AerEmissionsWizardStep.FUELS_AND_EMISSIONS_LIST}`);
      case AerEmissionsWizardStep.FUELS_AND_EMISSIONS_LIST:
        return of('./');
      case AerEmissionsWizardStep.EMISSION_SOURCES_FORM:
        return of(`../../${AerEmissionsWizardStep.EMISSION_SOURCES_LIST}`);
      case AerEmissionsWizardStep.EMISSION_SOURCES_LIST:
        return of('./');
      case AerEmissionsWizardStep.UNCERTAINTY_LEVEL:
        return of(`../${AerEmissionsWizardStep.DEROGATIONS}`);
      case AerEmissionsWizardStep.DEROGATIONS:
        return of(`../`);
      case AerEmissionsWizardStep.UPLOAD_SHIPS:
      case AerEmissionsWizardStep.DELETE_SHIPS:
        return of(`../${AerEmissionsWizardStep.LIST_OF_SHIPS}`);
      case AerEmissionsWizardStep.SHIP_SUMMARY:
        return of(`../../${AerEmissionsWizardStep.LIST_OF_SHIPS}`);
      default:
        return of('../../');
    }
  }
}
