import { Observable, of } from 'rxjs';
import { produce, WritableDraft } from 'immer';

import { PayloadMutator } from '@netz/common/forms';

import { empCommonQuery } from '@requests/common';
import { EMISSIONS_SUB_TASK } from '@requests/common/components/emissions/emissions.helpers';
import { EmpTaskPayload } from '@requests/common/emp/emp.types';
import { EmissionsWizardStep } from '@requests/common/emp/subtasks/emissions/emissions.helpers';
import { TaskItemStatus } from '@requests/common/task-item-status';

export class ShipSummaryPayloadMutator extends PayloadMutator {
  subtask = EMISSIONS_SUB_TASK;
  step = EmissionsWizardStep.SHIP_SUMMARY;

  apply(currentPayload: EmpTaskPayload, userInput: string): Observable<any> {
    return of(
      produce(currentPayload, (payload: EmpTaskPayload) => {
        const shipImoNumber = this.store.select(empCommonQuery.selectShip(userInput))()?.details?.imoNumber;

        this.updateMandate(payload, shipImoNumber);

        payload.empSectionsCompleted[`${this.subtask}-ship-${userInput}`] = TaskItemStatus.COMPLETED;
        payload.empSectionsCompleted[this.subtask] = TaskItemStatus.IN_PROGRESS;
      }),
    );
  }

  /**
   * Update the Mandate task and all its registeredOwners.ships
   * when an update happens in the name of the ship
   */
  private updateMandate(payload: WritableDraft<EmpTaskPayload>, shipImoNumber: string) {
    const shipOwnerDetailsFoundInMandate = payload?.emissionsMonitoringPlan?.mandate?.registeredOwners?.find((owner) =>
      owner?.ships?.some((ship) => ship.imoNumber === shipImoNumber),
    );

    if (shipOwnerDetailsFoundInMandate) {
      const updatedOwnerShipDetails = this.store.select(
        empCommonQuery.selectRegisteredOwnerShipDetailByImoNumber(shipImoNumber),
      )();
      payload.emissionsMonitoringPlan.mandate.registeredOwners =
        payload.emissionsMonitoringPlan.mandate.registeredOwners.map((owner) => ({
          ...owner,
          ships: owner?.ships?.map((ship) => (ship?.imoNumber === shipImoNumber ? updatedOwnerShipDetails : ship)),
        }));
    }
  }
}
