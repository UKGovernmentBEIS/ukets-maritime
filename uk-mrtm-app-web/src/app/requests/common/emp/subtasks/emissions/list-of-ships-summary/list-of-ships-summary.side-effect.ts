import { inject } from '@angular/core';

import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { EmpIssuanceApplicationSubmitRequestTaskPayload } from '@mrtm/api';

import { SideEffect, SubtaskOperation } from '@netz/common/forms';

import { EMISSIONS_SUB_TASK } from '@requests/common/components/emissions/emissions.helpers';
import { MANDATE_SUB_TASK } from '@requests/common/emp/subtasks/mandate';
import { SECTIONS_COMPLETE_MAP } from '@requests/common/section-completed-map.token';
import { TaskItemStatus } from '@requests/common/task-item-status';

export class ListOfShipsSummarySideEffect extends SideEffect {
  private readonly sectionsCompletedMap = inject(SECTIONS_COMPLETE_MAP, { optional: true });
  subtask = EMISSIONS_SUB_TASK;
  step = undefined;
  on: SubtaskOperation[] = ['SUBMIT_SUBTASK'];

  override apply(currentPayload: EmpIssuanceApplicationSubmitRequestTaskPayload): Observable<any> {
    return of(
      produce(currentPayload, (payload) => {
        payload.empSectionsCompleted[this.sectionsCompletedMap?.[this.subtask] ?? this.subtask] =
          TaskItemStatus.COMPLETED;

        if (
          payload.empSectionsCompleted[MANDATE_SUB_TASK] !== TaskItemStatus.IN_PROGRESS &&
          !this.allShipsIncluded(payload)
        ) {
          payload.empSectionsCompleted[MANDATE_SUB_TASK] = TaskItemStatus.NEEDS_REVIEW;
        }
      }),
    );
  }

  private allShipsIncluded(payload: EmpIssuanceApplicationSubmitRequestTaskPayload) {
    const roShips = payload?.emissionsMonitoringPlan?.mandate?.registeredOwners?.flatMap((ro) =>
      ro.ships.map((ship) => ship.imoNumber),
    );
    const ismShips = payload?.emissionsMonitoringPlan?.emissions?.ships
      ?.filter((ship) => ship?.details?.natureOfReportingResponsibility === 'ISM_COMPANY')
      ?.map((ship) => ship?.details?.imoNumber);

    return ismShips?.every((imoNumber) => roShips?.includes(imoNumber));
  }
}
