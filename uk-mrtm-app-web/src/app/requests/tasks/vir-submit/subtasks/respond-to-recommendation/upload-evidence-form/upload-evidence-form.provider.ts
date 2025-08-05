import { Provider } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { TASK_FORM } from '@requests/common';
import { virCommonQuery } from '@requests/common/vir/+state';
import {
  UploadEvidenceFormGroup,
  UploadEvidenceFormModel,
} from '@requests/tasks/vir-submit/subtasks/respond-to-recommendation/upload-evidence-form/upload-evidence-form.types';
import { taskActionTypeToUploadSectionTaskActionTypeMap } from '@shared/constants/upload-attachment-request-task-action-type.map';
import { RequestTaskFileService } from '@shared/services';

export const uploadEvidenceFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore, ActivatedRoute, RequestTaskFileService],
  useFactory: (
    formBuilder: FormBuilder,
    store: RequestTaskStore,
    activatedRoute: ActivatedRoute,
    fileService: RequestTaskFileService,
  ): FormGroup<UploadEvidenceFormGroup> => {
    const key = activatedRoute.snapshot.params?.['key'];
    const requestTaskId = store.select(requestTaskQuery.selectRequestTaskId)();
    const requestTaskType = store.select(requestTaskQuery.selectRequestTaskType)();
    const virAttachments = store.select(virCommonQuery.selectVirAttachments)();
    const operatorResponse = store.select(virCommonQuery.selectOperatorResponseData(key))();
    const isEditable = store.select(requestTaskQuery.selectIsEditable)();

    return formBuilder.group({
      key: formBuilder.control<UploadEvidenceFormModel['key'] | null>(key),
      files: fileService.buildFormControl(
        requestTaskId,
        operatorResponse?.files ?? [],
        virAttachments,
        taskActionTypeToUploadSectionTaskActionTypeMap?.[requestTaskType],
        true,
        !isEditable,
      ),
    });
  },
};
