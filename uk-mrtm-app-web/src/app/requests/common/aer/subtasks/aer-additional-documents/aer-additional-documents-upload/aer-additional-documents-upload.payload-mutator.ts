import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { AdditionalDocuments } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { TaskItemStatus } from '@requests/common/task-item-status';
import {
  ADDITIONAL_DOCUMENTS_SUB_TASK,
  AdditionalDocumentsWizardStep,
} from '@requests/common/utils/additional-documents/additional-documents.helper';
import { UploadedFile } from '@shared/types';
import { createFileUploadPayload, transformToTaskAttachments } from '@shared/utils/file-upload.utils';

export class AerAdditionalDocumentsUploadPayloadMutator extends PayloadMutator {
  subtask = ADDITIONAL_DOCUMENTS_SUB_TASK;
  step = AdditionalDocumentsWizardStep.ADDITIONAL_DOCUMENTS_UPLOAD;

  apply(
    currentPayload: AerSubmitTaskPayload,
    userInput: Omit<AdditionalDocuments, 'documents'> & { documents: UploadedFile[] },
  ): Observable<AerSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        payload.aer[this.subtask] = {
          exist: userInput?.exist,
          documents: createFileUploadPayload(userInput.documents),
        } as AdditionalDocuments;
        payload.aerAttachments = {
          ...payload.aerAttachments,
          ...transformToTaskAttachments(userInput.documents),
        };
        payload.aerSectionsCompleted[this.subtask] = TaskItemStatus.IN_PROGRESS;
      }),
    );
  }
}
