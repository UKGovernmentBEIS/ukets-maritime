import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { PayloadMutator } from '@netz/common/forms';

import { TaskItemStatus } from '@requests/common';
import { RESPOND_TO_RECOMMENDATION_SUBTASK } from '@requests/common/vir';
import { VirRespondToRecommendationWizardStep } from '@requests/tasks/vir-submit/subtasks/respond-to-recommendation';
import { VirSubmitTaskPayload } from '@requests/tasks/vir-submit/vir-submit.types';

export class RespondToRecommendationSummaryPayloadMutator extends PayloadMutator {
  public readonly step = VirRespondToRecommendationWizardStep.SUMMARY;
  public readonly subtask = RESPOND_TO_RECOMMENDATION_SUBTASK;

  public apply(currentPayload: VirSubmitTaskPayload, userInput: string): Observable<VirSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload: VirSubmitTaskPayload) => {
        payload.sectionsCompleted[`${this.subtask}-${userInput}`] = TaskItemStatus.COMPLETED;
      }),
    );
  }
}
