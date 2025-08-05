import { UntypedFormBuilder } from '@angular/forms';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { aerCommonQuery } from '@requests/common/aer/+state';
import { TASK_FORM } from '@requests/common/task-form.token';
import { taskActionTypeToUploadSectionTaskActionTypeMap } from '@shared/constants/upload-attachment-request-task-action-type.map';
import { RequestTaskFileService } from '@shared/services';

export const aerAdditionalDocumentsUploadFormProvider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore, RequestTaskFileService],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore, fileService: RequestTaskFileService) => {
    const aerAdditionalDocuments = store.select(aerCommonQuery.selectAerAdditionalDocuments)();
    const aerAttachments = store.select(aerCommonQuery.selectAerAttachments)();
    const isEditable = store.select(requestTaskQuery.selectIsEditable)();
    const requestTaskId = store.select(requestTaskQuery.selectRequestTaskId)();
    const requestTaskType = store.select(requestTaskQuery.selectRequestTaskType)();

    return fb.group(
      {
        exist: fb.control(aerAdditionalDocuments?.exist ?? null, {
          validators: [
            GovukValidators.required('Select ‘Yes’, if you want to upload any additional documents or information'),
          ],
        }),
        documents: fileService.buildFormControl(
          requestTaskId,
          aerAdditionalDocuments?.documents ?? [],
          aerAttachments,
          taskActionTypeToUploadSectionTaskActionTypeMap?.[requestTaskType],
          true,
          !isEditable,
        ),
      },
      { updateOn: 'change' },
    );
  },
};
