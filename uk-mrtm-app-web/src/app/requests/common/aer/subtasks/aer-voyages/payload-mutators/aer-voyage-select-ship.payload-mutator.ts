import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { PayloadMutator } from '@netz/common/forms';

import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { AerSelectShipFormModel } from '@requests/common/aer/components';
import {
  AER_VOYAGES_SUB_TASK,
  AerVoyagesWizardStep,
} from '@requests/common/aer/subtasks/aer-voyages/aer-voyages.helpers';
import { TaskItemStatus } from '@requests/common/task-item-status';

export class AerVoyageSelectShipPayloadMutator extends PayloadMutator {
  public readonly subtask: string = AER_VOYAGES_SUB_TASK;
  public readonly step: string = AerVoyagesWizardStep.SELECT_SHIP;

  apply(
    currentPayload: AerSubmitTaskPayload,
    userInput: Pick<AerSelectShipFormModel, 'imoNumber' | 'uniqueIdentifier'>,
  ): Observable<any> {
    return of(
      produce(currentPayload, (payload: AerSubmitTaskPayload) => {
        const { uniqueIdentifier, imoNumber } = userInput;
        const voyage = payload?.aer?.voyageEmissions?.voyages?.find(
          (x) => x.uniqueIdentifier === userInput.uniqueIdentifier,
        );

        if (voyage) {
          payload.aer.voyageEmissions.voyages = payload.aer.voyageEmissions.voyages.map((voyage) =>
            voyage.uniqueIdentifier === uniqueIdentifier
              ? {
                  ...voyage,
                  imoNumber,
                }
              : voyage,
          );
        } else {
          payload.aer.voyageEmissions = {
            ...payload?.aer?.voyageEmissions,
            voyages: [...(payload?.aer?.voyageEmissions?.voyages ?? []), { ...userInput } as any],
          };
        }

        payload.aerSectionsCompleted[this.subtask] = TaskItemStatus.IN_PROGRESS;
        payload.aerSectionsCompleted[`${this.subtask}-voyage-${userInput.uniqueIdentifier}`] =
          TaskItemStatus.IN_PROGRESS;
      }),
    );
  }
}
