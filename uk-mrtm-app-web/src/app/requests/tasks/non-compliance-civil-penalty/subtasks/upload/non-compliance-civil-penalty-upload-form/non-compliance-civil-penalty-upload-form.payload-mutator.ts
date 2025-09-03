import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { NonComplianceCivilPenaltyRequestTaskPayload } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import {
  NON_COMPLIANCE_CIVIL_PENALTY_UPLOAD_SUB_TASK,
  NonComplianceCivilPenaltyUploadStep,
} from '@requests/common/non-compliance';
import { UploadedFile } from '@shared/types';
import { transformToTaskAttachments } from '@shared/utils';

export class NonComplianceCivilPenaltyUploadFormPayloadMutator extends PayloadMutator {
  readonly subtask = NON_COMPLIANCE_CIVIL_PENALTY_UPLOAD_SUB_TASK;
  readonly step = NonComplianceCivilPenaltyUploadStep.UPLOAD_FORM;

  apply(
    currentPayload: NonComplianceCivilPenaltyRequestTaskPayload,
    userInput: Pick<NonComplianceCivilPenaltyRequestTaskPayload, 'comments' | 'dueDate' | 'penaltyAmount'> & {
      civilPenalty: UploadedFile;
    },
  ): Observable<NonComplianceCivilPenaltyRequestTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        payload.civilPenalty = userInput.civilPenalty?.uuid;
        payload.nonComplianceAttachments = {
          ...payload.nonComplianceAttachments,
          ...transformToTaskAttachments([userInput.civilPenalty]),
        };
        payload.comments = userInput.comments;
        payload.dueDate = userInput.dueDate;
        payload.penaltyAmount = userInput.penaltyAmount;
      }),
    );
  }
}
