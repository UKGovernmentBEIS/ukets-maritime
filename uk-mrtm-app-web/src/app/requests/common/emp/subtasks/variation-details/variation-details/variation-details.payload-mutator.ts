import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { PayloadMutator } from '@netz/common/forms';

import { EmpVariationTaskPayload } from '@requests/common/emp/emp.types';
import {
  VARIATION_DETAILS_SUB_TASK,
  VariationDetailsWizardStep,
} from '@requests/common/emp/subtasks/variation-details/variation-details.helper';
import { EmpVariationDetailsUserInput } from '@requests/common/emp/subtasks/variation-details/variation-details/variation-details.types';
import { TaskItemStatus } from '@requests/common/task-item-status';

export class VariationDetailsPayloadMutator extends PayloadMutator {
  subtask = VARIATION_DETAILS_SUB_TASK;
  step = VariationDetailsWizardStep.DESCRIBE_CHANGES;

  public apply(currentPayload: EmpVariationTaskPayload, userInput: EmpVariationDetailsUserInput): Observable<any> {
    return of(
      produce(currentPayload, (payload) => {
        const { nonSignificantChanges, significantChanges, ...rest } = userInput;
        payload.empVariationDetails = {
          changes: Array.from(new Set([...[nonSignificantChanges ?? []], ...[significantChanges ?? []]].flat())),
          ...rest,
        };
        payload.empSectionsCompleted[this.subtask] = TaskItemStatus.IN_PROGRESS;
        payload.empVariationDetailsCompleted = TaskItemStatus.IN_PROGRESS;
      }),
    );
  }
}
