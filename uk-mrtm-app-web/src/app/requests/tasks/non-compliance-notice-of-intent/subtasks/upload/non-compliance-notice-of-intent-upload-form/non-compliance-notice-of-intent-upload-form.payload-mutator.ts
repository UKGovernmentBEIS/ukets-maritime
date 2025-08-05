import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { NonComplianceNoticeOfIntentRequestTaskPayload } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import {
  NON_COMPLIANCE_NOTICE_OF_INTENT_UPLOAD_SUB_TASK,
  NonComplianceNoticeOfIntentUploadStep,
} from '@requests/common/non-compliance';
import { UploadedFile } from '@shared/types';
import { transformToTaskAttachments } from '@shared/utils';

export class NonComplianceNoticeOfIntentUploadFormPayloadMutator extends PayloadMutator {
  readonly subtask = NON_COMPLIANCE_NOTICE_OF_INTENT_UPLOAD_SUB_TASK;
  readonly step = NonComplianceNoticeOfIntentUploadStep.UPLOAD_FORM;

  apply(
    currentPayload: NonComplianceNoticeOfIntentRequestTaskPayload,
    userInput: Pick<NonComplianceNoticeOfIntentRequestTaskPayload, 'comments'> & {
      noticeOfIntent: UploadedFile;
    },
  ): Observable<NonComplianceNoticeOfIntentRequestTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        payload.noticeOfIntent = userInput.noticeOfIntent?.uuid;
        payload.nonComplianceAttachments = {
          ...payload.nonComplianceAttachments,
          ...transformToTaskAttachments([userInput.noticeOfIntent]),
        };
        payload.comments = userInput.comments;
      }),
    );
  }
}
