import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { SideEffect } from '@netz/common/forms';

import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { AER_PORTS_SUB_TASK } from '@requests/common/aer/subtasks/aer-ports/aer-ports.helpers';
import { LIST_OF_SHIPS_DELETE_STEP } from '@requests/common/components/emissions/delete-ships/delete-ships.helper';
import { EMISSIONS_SUB_TASK } from '@requests/common/components/emissions/emissions.helpers';
import { TaskItemStatus } from '@requests/common/task-item-status';

export class AerPortEmissionShipDeletedSideEffect extends SideEffect {
  public readonly subtask = EMISSIONS_SUB_TASK;
  public readonly step = LIST_OF_SHIPS_DELETE_STEP;

  public apply(currentPayload: AerSubmitTaskPayload): Observable<AerSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload: AerSubmitTaskPayload) => {
        if (!payload?.aer?.portEmissions?.ports?.length) {
          return;
        }

        const ships = (payload.aer?.emissions?.ships ?? []).map((x) => x.details?.imoNumber).filter(Boolean);
        const portsToDelete = payload.aer.portEmissions.ports
          .filter((port) => !ships.includes(port?.imoNumber))
          .map((x) => x.uniqueIdentifier);

        if (!portsToDelete.length) {
          return;
        }

        payload.aer.portEmissions.ports = payload.aer.portEmissions.ports.filter(
          (x) => !portsToDelete.includes(x.uniqueIdentifier),
        );

        for (const port of portsToDelete) {
          payload.aerSectionsCompleted[`${AER_PORTS_SUB_TASK}-port-call-${port}`] = undefined;
        }

        payload.aerSectionsCompleted[AER_PORTS_SUB_TASK] = payload.aer.portEmissions.ports.length
          ? TaskItemStatus.NEEDS_REVIEW
          : undefined;
      }),
    );
  }
}
