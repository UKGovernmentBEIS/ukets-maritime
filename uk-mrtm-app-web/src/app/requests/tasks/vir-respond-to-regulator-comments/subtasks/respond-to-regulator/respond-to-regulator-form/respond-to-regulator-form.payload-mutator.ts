import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { OperatorImprovementFollowUpResponse } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { TaskItemStatus } from '@requests/common';
import { RESPOND_TO_REGULATOR_SUBTASK } from '@requests/common/vir';
import { VirRespondToRegulatorWizardStep } from '@requests/tasks/vir-respond-to-regulator-comments/subtasks/respond-to-regulator';
import { RespondToRegulatorFormModel } from '@requests/tasks/vir-respond-to-regulator-comments/subtasks/respond-to-regulator/respond-to-regulator-form/respond-to-regulator-form.types';
import { VirRespondToRegulatorCommentsTaskPayload } from '@requests/tasks/vir-respond-to-regulator-comments/vir-respond-to-regulator-comments.types';
import { isNil } from '@shared/utils';

export class RespondToRegulatorFormPayloadMutator extends PayloadMutator {
  subtask: string = RESPOND_TO_REGULATOR_SUBTASK;
  step: string = VirRespondToRegulatorWizardStep.FORM;

  apply(
    currentPayload: VirRespondToRegulatorCommentsTaskPayload,
    userInput: RespondToRegulatorFormModel,
  ): Observable<VirRespondToRegulatorCommentsTaskPayload> {
    return of(
      produce(currentPayload, (payload: VirRespondToRegulatorCommentsTaskPayload) => {
        const { key, ...formData } = userInput;
        if (isNil(payload?.operatorImprovementFollowUpResponses)) {
          payload.operatorImprovementFollowUpResponses = {};
        }

        payload.operatorImprovementFollowUpResponses[key] = {
          ...(payload.operatorImprovementFollowUpResponses[key] ?? {}),
          ...formData,
          dateCompleted: formData.improvementCompleted ? formData.dateCompleted : undefined,
          reason: !formData.improvementCompleted ? formData.reason : undefined,
        } as OperatorImprovementFollowUpResponse;

        payload.sectionsCompleted[`${this.subtask}-${key}`] = TaskItemStatus.IN_PROGRESS;
      }),
    );
  }
}
