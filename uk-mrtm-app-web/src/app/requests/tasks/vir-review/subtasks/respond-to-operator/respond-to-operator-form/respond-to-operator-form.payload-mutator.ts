import { Observable, of } from 'rxjs';
import { produce } from 'immer';
import { isNil } from 'lodash-es';

import { RegulatorImprovementResponse, RegulatorReviewResponse } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { TaskItemStatus } from '@requests/common';
import { RESPOND_TO_OPERATOR_SUBTASK } from '@requests/common/vir';
import { VirRespondToOperatorWizardStep } from '@requests/tasks/vir-review/subtasks/respond-to-operator/respond-to-operator.helpers';
import { RespondToOperatorFormModel } from '@requests/tasks/vir-review/subtasks/respond-to-operator/respond-to-operator-form/respond-to-operator-form.types';
import { VirReviewTaskPayload } from '@requests/tasks/vir-review/vir-review.types';

export class RespondToOperatorFormPayloadMutator extends PayloadMutator {
  public readonly subtask: string = RESPOND_TO_OPERATOR_SUBTASK;
  public readonly step: string = VirRespondToOperatorWizardStep.RESPOND_TO;

  public apply(
    currentPayload: VirReviewTaskPayload,
    userInput: RespondToOperatorFormModel,
  ): Observable<VirReviewTaskPayload> {
    return of(
      produce(currentPayload, (payload: VirReviewTaskPayload) => {
        const { key, ...formData } = userInput;
        if (isNil(payload?.regulatorReviewResponse)) {
          payload.regulatorReviewResponse = {
            regulatorImprovementResponses: {},
          } as RegulatorReviewResponse;
        }

        payload.regulatorReviewResponse.regulatorImprovementResponses[key] = {
          ...(payload.regulatorReviewResponse.regulatorImprovementResponses?.[key] ?? {}),
          ...formData,
          improvementDeadline: formData.improvementRequired ? formData.improvementDeadline : undefined,
        } as RegulatorImprovementResponse;

        payload.sectionsCompleted[`${this.subtask}-${key}`] = TaskItemStatus.IN_PROGRESS;
      }),
    );
  }
}
