import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { PayloadMutator } from '@netz/common/forms';

import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { AerEmissionsWizardStep } from '@requests/common/aer/subtasks/aer-emissions/aer-emissions.helpers';
import { EMISSIONS_SUB_TASK } from '@requests/common/components/emissions/emissions.helpers';

export class AerEmissionSourcesAndFuelTypesUsedListPayloadMutator extends PayloadMutator {
  readonly subtask = EMISSIONS_SUB_TASK;
  step = AerEmissionsWizardStep.EMISSION_SOURCES_LIST;

  apply(currentPayload: AerSubmitTaskPayload, userInput: string): Observable<any> {
    return of(
      produce(currentPayload, (payload: AerSubmitTaskPayload) => {
        payload.aer[this.subtask].ships = [
          ...payload.aer[this.subtask].ships.map((ship) => ({
            ...ship,
            emissionsSources: ship.emissionsSources.filter((source) => source.uniqueIdentifier !== userInput),
          })),
        ];
      }),
    );
  }
}
