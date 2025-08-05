import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { OperatorImprovementResponse } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { TaskItemStatus } from '@requests/common';
import { RESPOND_TO_RECOMMENDATION_SUBTASK } from '@requests/common/vir';
import { VirRespondToRecommendationWizardStep } from '@requests/tasks/vir-submit/subtasks/respond-to-recommendation';
import { UploadEvidenceFormModel } from '@requests/tasks/vir-submit/subtasks/respond-to-recommendation/upload-evidence-form/upload-evidence-form.types';
import { VirSubmitTaskPayload } from '@requests/tasks/vir-submit/vir-submit.types';
import { createFileUploadPayload, transformToTaskAttachments } from '@shared/utils';

export class UploadEvidenceFormPayloadMutator extends PayloadMutator {
  subtask: string = RESPOND_TO_RECOMMENDATION_SUBTASK;
  step: string = VirRespondToRecommendationWizardStep.UPLOAD_EVIDENCE_FORM;

  apply(currentPayload: VirSubmitTaskPayload, userInput: UploadEvidenceFormModel): Observable<VirSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload: VirSubmitTaskPayload) => {
        const { key, files } = userInput;

        payload.operatorImprovementResponses[key] = {
          ...(payload.operatorImprovementResponses[key] ?? {}),
          files: createFileUploadPayload(files),
        } as OperatorImprovementResponse;
        payload.virAttachments = {
          ...payload.virAttachments,
          ...transformToTaskAttachments(files),
        };
        payload.sectionsCompleted[`${this.subtask}-${key}`] = TaskItemStatus.IN_PROGRESS;
      }),
    );
  }
}
