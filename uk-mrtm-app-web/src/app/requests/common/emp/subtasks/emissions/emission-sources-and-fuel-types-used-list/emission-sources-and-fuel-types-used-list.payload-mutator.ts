import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { EmpEmissionsSources, EmpShipEmissions } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { EMISSIONS_SUB_TASK } from '@requests/common/components/emissions/emissions.helpers';
import { EmpTaskPayload } from '@requests/common/emp/emp.types';
import { EmissionsWizardStep } from '@requests/common/emp/subtasks/emissions/emissions.helpers';

export class EmissionSourcesAndFuelTypesUsedListPayloadMutator extends PayloadMutator {
  subtask = EMISSIONS_SUB_TASK;
  step = EmissionsWizardStep.EMISSION_SOURCES_LIST;

  apply(currentPayload: EmpTaskPayload, userInput: string): Observable<any> {
    return of(
      produce(currentPayload, (payload: EmpTaskPayload) => {
        payload.emissionsMonitoringPlan[this.subtask].ships = [
          ...payload.emissionsMonitoringPlan[this.subtask].ships.map((ship: EmpShipEmissions) => ({
            ...ship,
            emissionsSources: ship.emissionsSources.filter(
              (source: EmpEmissionsSources) => source.uniqueIdentifier !== userInput,
            ),
          })),
        ];
      }),
    );
  }
}
