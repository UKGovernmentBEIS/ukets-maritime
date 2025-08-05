import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { PayloadMutator } from '@netz/common/forms';

import { TaskItemStatus } from '@requests/common';
import { RESPOND_TO_OPERATOR_SUBTASK } from '@requests/common/vir';
import { VirRespondToOperatorWizardStep } from '@requests/tasks/vir-review/subtasks/respond-to-operator/respond-to-operator.helpers';
import { VirSubmitTaskPayload } from '@requests/tasks/vir-submit/vir-submit.types';

export class RespondToOperatorSummaryPayloadMutator extends PayloadMutator {
  public readonly step = VirRespondToOperatorWizardStep.SUMMARY;
  public readonly subtask = RESPOND_TO_OPERATOR_SUBTASK;

  public apply(currentPayload: VirSubmitTaskPayload, userInput: string): Observable<VirSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload: VirSubmitTaskPayload) => {
        payload.sectionsCompleted[`${this.subtask}-${userInput}`] = TaskItemStatus.COMPLETED;
      }),
    );
  }
}
