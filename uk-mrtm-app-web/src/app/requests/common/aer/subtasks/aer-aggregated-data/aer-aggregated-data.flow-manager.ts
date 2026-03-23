import { Observable, of } from 'rxjs';

import { WizardFlowManager } from '@netz/common/forms';

import {
  AER_AGGREGATED_DATA_SUB_TASK,
  AerAggregatedDataWizardStep,
} from '@requests/common/aer/subtasks/aer-aggregated-data/aer-aggregated-data.helpers';

export class AerAggregatedDataFlowManager extends WizardFlowManager {
  public readonly subtask: string = AER_AGGREGATED_DATA_SUB_TASK;

  nextStepPath(currentStep: string): Observable<string> {
    switch (currentStep) {
      case AerAggregatedDataWizardStep.DELETE_AGGREGATED_DATA:
        return of('./');
      case AerAggregatedDataWizardStep.FUEL_CONSUMPTION:
        return of(`../${AerAggregatedDataWizardStep.ANNUAL_EMISSIONS}`);
      case AerAggregatedDataWizardStep.ANNUAL_EMISSIONS:
        return of(`../${AerAggregatedDataWizardStep.SHIP_EMISSIONS}`);
      case AerAggregatedDataWizardStep.FETCH_FROM_VOYAGES_AND_PORTS:
      case AerAggregatedDataWizardStep.UPLOAD_AGGREGATED_DATA:
        return of(`../${AerAggregatedDataWizardStep.LIST_OF_AGGREGATED_DATA}`);
      case AerAggregatedDataWizardStep.AGGREGATED_DATA_SUMMARY:
        return of('../');
      default:
        return of('../../');
    }
  }
}
