import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { NonComplianceInitialPenaltyNoticeRequestTaskPayload } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import {
  NON_COMPLIANCE_INITIAL_PENALTY_NOTICE_UPLOAD_SUB_TASK,
  NonComplianceInitialPenaltyNoticeUploadStep,
} from '@requests/common/non-compliance';
import { UploadedFile } from '@shared/types';
import { transformToTaskAttachments } from '@shared/utils';

export class NonComplianceInitialPenaltyNoticeUploadFormPayloadMutator extends PayloadMutator {
  readonly subtask = NON_COMPLIANCE_INITIAL_PENALTY_NOTICE_UPLOAD_SUB_TASK;
  readonly step = NonComplianceInitialPenaltyNoticeUploadStep.UPLOAD_FORM;

  apply(
    currentPayload: NonComplianceInitialPenaltyNoticeRequestTaskPayload,
    userInput: Pick<NonComplianceInitialPenaltyNoticeRequestTaskPayload, 'comments'> & {
      initialPenaltyNotice: UploadedFile;
    },
  ): Observable<NonComplianceInitialPenaltyNoticeRequestTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        payload.initialPenaltyNotice = userInput.initialPenaltyNotice?.uuid;
        payload.nonComplianceAttachments = {
          ...payload.nonComplianceAttachments,
          ...transformToTaskAttachments([userInput.initialPenaltyNotice]),
        };
        payload.comments = userInput.comments;
      }),
    );
  }
}
