import { Observable, of } from 'rxjs';
import { produce, WritableDraft } from 'immer';

import { SideEffect, SubtaskOperation } from '@netz/common/forms';

import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { AER_AGGREGATED_DATA_SUB_TASK } from '@requests/common/aer/subtasks/aer-aggregated-data/aer-aggregated-data.helpers';
import { AerEmissionsWizardStep } from '@requests/common/aer/subtasks/aer-emissions';
import { AER_PORTS_SUB_TASK } from '@requests/common/aer/subtasks/aer-ports/aer-ports.helpers';
import { AER_TOTAL_EMISSIONS_SUB_TASK } from '@requests/common/aer/subtasks/aer-total-emissions/aer-total-emissions.helpers';
import { AER_VOYAGES_SUB_TASK } from '@requests/common/aer/subtasks/aer-voyages/aer-voyages.helpers';
import { EMISSIONS_SUB_TASK } from '@requests/common/components/emissions/emissions.helpers';
import { TaskItemStatus } from '@requests/common/task-item-status';

export class AerUploadShipsSideEffect extends SideEffect {
  subtask = EMISSIONS_SUB_TASK;
  step = AerEmissionsWizardStep.UPLOAD_SHIPS;
  on: SubtaskOperation[] = ['SAVE_SUBTASK'];

  apply(currentPayload: AerSubmitTaskPayload): Observable<any> {
    return of(
      produce(currentPayload, (payload) => {
        this.updateShips(payload);
        this.updateVoyages(payload);
        this.updatePorts(payload);
        this.updateAggregatedData(payload);
        this.updateTotalEmissions(payload);
      }),
    );
  }

  /**
   * Delete from aerSectionsCompleted emissions-ship-{{uniqueIdentifier}} that do not exist
   * Update aerSectionsCompleted[emissions] to IN_PROGRESS
   */
  private updateShips(payload: WritableDraft<AerSubmitTaskPayload>) {
    const existingShipIds = payload?.aer?.emissions?.ships?.map((ship) => `emissions-ship-${ship.uniqueIdentifier}`);
    const sectionsCompletedShipIds = payload?.aerSectionsCompleted
      ? Object.keys(payload?.aerSectionsCompleted).filter((key) => key.startsWith('emissions-ship-'))
      : [];
    for (const sectionShipId of sectionsCompletedShipIds) {
      if (!existingShipIds.includes(sectionShipId)) {
        delete payload.aerSectionsCompleted[sectionShipId];
      }
    }
  }

  /**
   * Update all keys in aerSectionsCompleted starting with voyages-voyage- to IN_PROGRESS
   * Update aerSectionsCompleted[voyages] to IN_PROGRESS
   */
  private updateVoyages(payload: WritableDraft<AerSubmitTaskPayload>) {
    for (const key of Object.keys(payload?.aerSectionsCompleted)) {
      if (key.startsWith('voyages-voyage')) {
        payload.aerSectionsCompleted[key] = TaskItemStatus.NEEDS_REVIEW;
      }
    }
    if (payload.aerSectionsCompleted?.[AER_VOYAGES_SUB_TASK]) {
      payload.aerSectionsCompleted[AER_VOYAGES_SUB_TASK] = TaskItemStatus.NEEDS_REVIEW;
    }
  }

  /**
   * Update all keys in aerSectionsCompleted starting with ports-port-call- to IN_PROGRESS
   * Update aerSectionsCompleted[voyages] to IN_PROGRESS
   */
  private updatePorts(payload: WritableDraft<AerSubmitTaskPayload>) {
    for (const key of Object.keys(payload?.aerSectionsCompleted)) {
      if (key.startsWith('ports-port-call-')) {
        payload.aerSectionsCompleted[key] = TaskItemStatus.NEEDS_REVIEW;
      }
    }
    if (payload.aerSectionsCompleted?.[AER_PORTS_SUB_TASK]) {
      payload.aerSectionsCompleted[AER_PORTS_SUB_TASK] = TaskItemStatus.NEEDS_REVIEW;
    }
  }

  /**
   * Update all keys in aerSectionsCompleted starting with aggregatedData-aggregated-data- to IN_PROGRESS
   * Update aerSectionsCompleted[aggregatedData] to IN_PROGRESS
   */
  private updateAggregatedData(payload: WritableDraft<AerSubmitTaskPayload>) {
    for (const key of Object.keys(payload?.aerSectionsCompleted)) {
      if (key.startsWith('aggregatedData-aggregated-data-')) {
        payload.aerSectionsCompleted[key] = TaskItemStatus.NEEDS_REVIEW;
      }
    }
    if (payload.aerSectionsCompleted?.[AER_AGGREGATED_DATA_SUB_TASK]) {
      payload.aerSectionsCompleted[AER_AGGREGATED_DATA_SUB_TASK] = TaskItemStatus.NEEDS_REVIEW;
    }
  }

  private updateTotalEmissions(payload: WritableDraft<AerSubmitTaskPayload>) {
    if (payload.aerSectionsCompleted?.[AER_TOTAL_EMISSIONS_SUB_TASK] === TaskItemStatus.COMPLETED) {
      payload.aerSectionsCompleted[AER_TOTAL_EMISSIONS_SUB_TASK] = TaskItemStatus.NEEDS_REVIEW;
    }
  }
}
