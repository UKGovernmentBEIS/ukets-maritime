import { Observable, of } from 'rxjs';

import { WizardFlowManager } from '@netz/common/forms';

import { AER_PORTS_SUB_TASK, AerPortsWizardStep } from '@requests/common/aer/subtasks/aer-ports/aer-ports.helpers';

export class AerPortsFlowManager extends WizardFlowManager {
  readonly subtask: string = AER_PORTS_SUB_TASK;

  nextStepPath(currentStep: string): Observable<string> {
    switch (currentStep) {
      case AerPortsWizardStep.SELECT_SHIP:
        return of('./');
      case AerPortsWizardStep.PORT_DETAILS:
        return of(`../${AerPortsWizardStep.IN_PORT_EMISSIONS}`);
      case AerPortsWizardStep.DIRECT_EMISSIONS:
      case AerPortsWizardStep.FUEL_CONSUMPTION:
        return of(`../`);
      case AerPortsWizardStep.UPLOAD_PORTS:
        return of(`../${AerPortsWizardStep.LIST_OF_PORTS}`);
      case AerPortsWizardStep.DELETE_PORT:
      case AerPortsWizardStep.DELETE_DIRECT_EMISSIONS:
      case AerPortsWizardStep.DELETE_FUEL_CONSUMPTION:
        return of(`.`);
      case AerPortsWizardStep.IN_PORT_EMISSIONS:
      case AerPortsWizardStep.PORT_CALL_SUMMARY:
        return of('../');
      default:
        return of('../../');
    }
  }
}
