import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { AerPort } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { AerPortDetailsModel } from '@requests/common/aer/subtasks/aer-ports/aer-port-details/aer-port-details.types';
import { AER_PORTS_SUB_TASK, AerPortsWizardStep } from '@requests/common/aer/subtasks/aer-ports/aer-ports.helpers';
import { TaskItemStatus } from '@requests/common/task-item-status';
import { mergeDatesToString } from '@shared/utils';

export class AerPortDetailsPayloadMutator extends PayloadMutator {
  public readonly subtask = AER_PORTS_SUB_TASK;
  public readonly step = AerPortsWizardStep.PORT_DETAILS;

  public apply(currentPayload: AerSubmitTaskPayload, userInput: AerPortDetailsModel): Observable<any> {
    return of(
      produce(currentPayload, (payload: AerSubmitTaskPayload) => {
        const { uniqueIdentifier, port, country, arrivalTime, arrivalDate, departureTime, departureDate, ...rest } =
          userInput;

        payload.aer.portEmissions.ports = (payload?.aer?.portEmissions?.ports ?? []).map((portItem: AerPort) =>
          portItem?.uniqueIdentifier === uniqueIdentifier
            ? {
                ...portItem,
                portDetails: {
                  arrivalTime: mergeDatesToString(arrivalDate, arrivalTime),
                  departureTime: mergeDatesToString(departureDate, departureTime),
                  visit: {
                    port,
                    country,
                  },
                  ...rest,
                },
              }
            : portItem,
        );

        payload.aerSectionsCompleted[this.subtask] = TaskItemStatus.IN_PROGRESS;
        payload.aerSectionsCompleted[`${this.subtask}-port-call-${uniqueIdentifier}`] = TaskItemStatus.IN_PROGRESS;
      }),
    );
  }
}
