import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { AdditionalDocuments } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { EmpTaskPayload } from '@requests/common/emp/emp.types';
import { TaskItemStatus } from '@requests/common/task-item-status';
import {
  ADDITIONAL_DOCUMENTS_SUB_TASK,
  AdditionalDocumentsWizardStep,
} from '@requests/common/utils/additional-documents';
import { UploadedFile } from '@shared/types';
import { createFileUploadPayload, transformToTaskAttachments } from '@shared/utils/file-upload.utils';

export class AdditionalDocumentsUploadPayloadMutator extends PayloadMutator {
  subtask = ADDITIONAL_DOCUMENTS_SUB_TASK;
  step = AdditionalDocumentsWizardStep.ADDITIONAL_DOCUMENTS_UPLOAD;

  apply(
    currentPayload: EmpTaskPayload,
    userInput: Omit<AdditionalDocuments, 'documents'> & { documents: UploadedFile[] },
  ): Observable<EmpTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        payload.emissionsMonitoringPlan[this.subtask] = {
          exist: userInput?.exist,
          documents: createFileUploadPayload(userInput.documents),
        } as AdditionalDocuments;
        payload.empAttachments = {
          ...payload.empAttachments,
          ...transformToTaskAttachments(userInput.documents),
        };
        payload.empSectionsCompleted[this.subtask] = TaskItemStatus.IN_PROGRESS;
      }),
    );
  }
}
