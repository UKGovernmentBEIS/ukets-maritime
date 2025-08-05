import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { PayloadMutator } from '@netz/common/forms';

import { TaskItemStatus } from '@requests/common';
import { RESPOND_TO_REGULATOR_SUBTASK } from '@requests/common/vir';
import { VirRespondToRegulatorWizardStep } from '@requests/tasks/vir-respond-to-regulator-comments/subtasks/respond-to-regulator';
import { VirRespondToRegulatorCommentsTaskPayload } from '@requests/tasks/vir-respond-to-regulator-comments/vir-respond-to-regulator-comments.types';

export class RespondToRegulatorSummaryPayloadMutator extends PayloadMutator {
  public readonly step = VirRespondToRegulatorWizardStep.SUMMARY;
  public readonly subtask = RESPOND_TO_REGULATOR_SUBTASK;

  public apply(
    currentPayload: VirRespondToRegulatorCommentsTaskPayload,
    userInput: string,
  ): Observable<VirRespondToRegulatorCommentsTaskPayload> {
    return of(
      produce(currentPayload, (payload: VirRespondToRegulatorCommentsTaskPayload) => {
        payload.sectionsCompleted[`${this.subtask}-${userInput}`] = TaskItemStatus.COMPLETED;
      }),
    );
  }
}
