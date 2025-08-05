import { UntypedFormBuilder } from '@angular/forms';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { empCommonQuery } from '@requests/common/emp/+state';
import { TASK_FORM } from '@requests/common/task-form.token';
import { taskActionTypeToUploadSectionTaskActionTypeMap } from '@shared/constants/upload-attachment-request-task-action-type.map';
import { RequestTaskFileService } from '@shared/services';

export const declarationDocumentsFormProvider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore, RequestTaskFileService],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore, fileService: RequestTaskFileService) => {
    const operatorDetails = store.select(empCommonQuery.selectOperatorDetails)();
    const empAttachments = store.select(empCommonQuery.selectEmpAttachments)();
    const isEditable = store.select(requestTaskQuery.selectIsEditable)();
    const requestTaskId = store.select(requestTaskQuery.selectRequestTaskId)();
    const requestTaskType = store.select(requestTaskQuery.selectRequestTaskType)();

    return fb.group(
      {
        exist: fb.control(operatorDetails?.declarationDocuments?.exist ?? null, {
          validators: [
            GovukValidators.required(
              'Select ‘Yes’, if you want to upload any additional documents or information to support your application',
            ),
          ],
        }),
        documents: fileService.buildFormControl(
          requestTaskId,
          operatorDetails?.declarationDocuments?.documents ?? [],
          empAttachments,
          taskActionTypeToUploadSectionTaskActionTypeMap?.[requestTaskType],
          true,
          !isEditable,
        ),
      },
      { updateOn: 'change' },
    );
  },
};
