import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { EmpCarbonCapture, EmpCarbonCaptureTechnologies, EmpShipEmissions } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { EMISSIONS_SUB_TASK } from '@requests/common/components/emissions/emissions.helpers';
import { EmpTaskPayload } from '@requests/common/emp/emp.types';
import { EmissionsWizardStep } from '@requests/common/emp/subtasks/emissions/emissions.helpers';
import { TaskItemStatus } from '@requests/common/task-item-status';
import { UploadedFile } from '@shared/types';
import { createFileUploadPayload, transformToTaskAttachments } from '@shared/utils';

interface CarbonCaptureUserInput {
  carbonCapture: {
    exist: boolean;
    technologies?: {
      description: string;
      files?: UploadedFile[];
      technologyEmissionSources: Array<string>;
    };
  };
  shipId: EmpShipEmissions['uniqueIdentifier'];
}

export class CarbonCapturePayloadMutator extends PayloadMutator {
  subtask = EMISSIONS_SUB_TASK;
  step = EmissionsWizardStep.CARBON_CAPTURE;

  apply(currentPayload: EmpTaskPayload, userInput: CarbonCaptureUserInput): Observable<EmpTaskPayload> {
    return of(
      produce(currentPayload, (payload: EmpTaskPayload) => {
        const { shipId, carbonCapture } = userInput;
        const carbonCapturePayload: EmpCarbonCapture = {
          exist: carbonCapture?.exist,
          ...(carbonCapture?.exist === true && {
            technologies: {
              ...carbonCapture?.technologies,
              files: createFileUploadPayload(carbonCapture?.technologies?.files),
            } as EmpCarbonCaptureTechnologies,
          }),
        };

        payload.emissionsMonitoringPlan[this.subtask].ships = [
          ...payload.emissionsMonitoringPlan[this.subtask].ships.map((ship: EmpShipEmissions) =>
            ship.uniqueIdentifier !== shipId
              ? ship
              : {
                  ...ship,
                  carbonCapture: carbonCapturePayload,
                },
          ),
        ];

        payload.empAttachments = {
          ...payload.empAttachments,
          ...transformToTaskAttachments(carbonCapture?.technologies?.files),
        };

        payload.empSectionsCompleted[`${this.subtask}-ship-${userInput.shipId}`] = TaskItemStatus.IN_PROGRESS;
        payload.empSectionsCompleted[this.subtask] = TaskItemStatus.IN_PROGRESS;
      }),
    );
  }
}
