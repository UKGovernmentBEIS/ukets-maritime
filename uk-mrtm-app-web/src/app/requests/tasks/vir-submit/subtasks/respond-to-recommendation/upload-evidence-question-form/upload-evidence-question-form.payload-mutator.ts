import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { OperatorImprovementResponse } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { TaskItemStatus } from '@requests/common';
import { RESPOND_TO_RECOMMENDATION_SUBTASK } from '@requests/common/vir';
import { VirRespondToRecommendationWizardStep } from '@requests/tasks/vir-submit/subtasks/respond-to-recommendation';
import { UploadEvidenceQuestionFormModel } from '@requests/tasks/vir-submit/subtasks/respond-to-recommendation/upload-evidence-question-form/upload-evidence-question-form.types';
import { VirSubmitTaskPayload } from '@requests/tasks/vir-submit/vir-submit.types';

export class UploadEvidenceQuestionFormPayloadMutator extends PayloadMutator {
  subtask: string = RESPOND_TO_RECOMMENDATION_SUBTASK;
  step: string = VirRespondToRecommendationWizardStep.UPLOAD_EVIDENCE_QUESTION;

  apply(
    currentPayload: VirSubmitTaskPayload,
    userInput: UploadEvidenceQuestionFormModel,
  ): Observable<VirSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload: VirSubmitTaskPayload) => {
        const { key, ...formData } = userInput;

        payload.operatorImprovementResponses[key] = {
          ...(payload.operatorImprovementResponses[key] ?? {}),
          ...formData,
          files: formData?.uploadEvidence ? (payload.operatorImprovementResponses[key]?.files ?? []) : [],
        } as OperatorImprovementResponse;

        payload.sectionsCompleted[`${this.subtask}-${key}`] = TaskItemStatus.IN_PROGRESS;
      }),
    );
  }
}
