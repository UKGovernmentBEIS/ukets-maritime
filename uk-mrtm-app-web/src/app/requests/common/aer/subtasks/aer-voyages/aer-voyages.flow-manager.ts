import { Observable, of } from 'rxjs';

import { WizardFlowManager } from '@netz/common/forms';

import {
  AER_VOYAGES_SUB_TASK,
  AerVoyagesWizardStep,
} from '@requests/common/aer/subtasks/aer-voyages/aer-voyages.helpers';

export class AerVoyagesFlowManager extends WizardFlowManager {
  public readonly subtask: string = AER_VOYAGES_SUB_TASK;
  nextStepPath(currentStep: string): Observable<string> {
    switch (currentStep) {
      case AerVoyagesWizardStep.VOYAGE_DETAILS:
        return of(`../${AerVoyagesWizardStep.FUEL_EMISSIONS}`);
      case AerVoyagesWizardStep.DIRECT_EMISSIONS:
      case AerVoyagesWizardStep.FUEL_EMISSIONS:
      case AerVoyagesWizardStep.FUEL_EMISSIONS_SUMMARY:
        return of('../');
      case AerVoyagesWizardStep.UPLOAD_VOYAGES:
        return of(`../${AerVoyagesWizardStep.LIST_OF_VOYAGES}`);
      case AerVoyagesWizardStep.DELETE_VOYAGE:
      case AerVoyagesWizardStep.SELECT_SHIP:
      case AerVoyagesWizardStep.DELETE_DIRECT_EMISSIONS:
      case AerVoyagesWizardStep.DELETE_FUEL_CONSUMPTION:
        return of('./');
      default:
        return of('../../');
    }
  }
}
