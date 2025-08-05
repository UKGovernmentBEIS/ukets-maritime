import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { PayloadMutator } from '@netz/common/forms';

import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { AerSelectShipFormModel } from '@requests/common/aer/components';
import {
  AER_AGGREGATED_DATA_SUB_TASK,
  AerAggregatedDataWizardStep,
} from '@requests/common/aer/subtasks/aer-aggregated-data/aer-aggregated-data.helpers';
import { TaskItemStatus } from '@requests/common/task-item-status';

export class AerAggregatedDataSelectShipPayloadMutator extends PayloadMutator {
  public readonly subtask: string = AER_AGGREGATED_DATA_SUB_TASK;
  public readonly step: string = AerAggregatedDataWizardStep.SELECT_SHIP;

  apply(
    currentPayload: AerSubmitTaskPayload,
    userInput: Pick<AerSelectShipFormModel, 'imoNumber' | 'uniqueIdentifier'>,
  ): Observable<any> {
    return of(
      produce(currentPayload, (payload: AerSubmitTaskPayload) => {
        const { uniqueIdentifier, imoNumber } = userInput;
        const aggregatedData = payload?.aer?.aggregatedData?.emissions?.find(
          (x) => x.uniqueIdentifier === userInput.uniqueIdentifier,
        );

        if (aggregatedData) {
          payload.aer.aggregatedData.emissions = payload.aer.aggregatedData.emissions.map((data) =>
            data.uniqueIdentifier === uniqueIdentifier
              ? {
                  ...data,
                  imoNumber,
                }
              : data,
          );
        } else {
          payload.aer.aggregatedData = {
            ...payload?.aer?.aggregatedData,
            emissions: [...(payload?.aer?.aggregatedData?.emissions ?? []), { ...userInput } as any],
          };
        }

        payload.aerSectionsCompleted[this.subtask] = TaskItemStatus.IN_PROGRESS;
        payload.aerSectionsCompleted[`${this.subtask}-aggregated-data-${userInput.uniqueIdentifier}`] =
          TaskItemStatus.IN_PROGRESS;
      }),
    );
  }
}
