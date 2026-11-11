import { ActivatedRoute } from '@angular/router';

import { from, map, Observable, of } from 'rxjs';

import { WizardFlowManager } from '@netz/common/forms';

import {
  AER_VOYAGES_SUB_TASK,
  AerVoyagesWizardStep,
} from '@requests/common/aer/subtasks/aer-voyages/aer-voyages.helpers';

export class AerVoyagesFlowManager extends WizardFlowManager {
  public readonly subtask: string = AER_VOYAGES_SUB_TASK;

  /**
   * Adding direct emissions completes the entry, so the emissions page guard would redirect to the summary
   * unless it is opened in change mode.
   */
  nextStep(currentStep: string, route: ActivatedRoute): Observable<string> {
    if (currentStep !== AerVoyagesWizardStep.DIRECT_EMISSIONS) {
      return super.nextStep(currentStep, route);
    }

    return from(
      this.router.navigate(['../'], { relativeTo: route, queryParams: { change: true }, fragment: 'directEmissions' }),
    ).pipe(map(() => '../'));
  }

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
      case AerVoyagesWizardStep.NEW_FUEL_EMISSIONS_SUMMARY:
      default:
        return of('../../');
    }
  }
}
