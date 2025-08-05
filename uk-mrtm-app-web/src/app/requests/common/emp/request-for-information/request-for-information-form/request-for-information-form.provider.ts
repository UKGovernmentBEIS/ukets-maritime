import { Provider } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { rfiQuery } from '@requests/common/emp/request-for-information/+state';
import {
  RequestForInformationFormModel,
  RequestForInformationModel,
} from '@requests/common/emp/request-for-information/request-for-information-form/request-for-information-form.types';
import { RequestForInformationStore } from '@requests/common/emp/request-for-information/services';
import { TASK_FORM } from '@requests/common/task-form.token';
import { RequestTaskFileService } from '@shared/services';
import { UploadedFile } from '@shared/types';
import { futureDateValidator } from '@shared/validators';

export const addQuestion = (value?: string): FormControl<string | null> =>
  new FormControl<string | null>(value ?? null, {
    validators: [
      GovukValidators.required('Enter a question'),
      GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
    ],
  });

export const requestForInformationFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestForInformationStore, RequestTaskStore, RequestTaskFileService],
  useFactory: (
    fb: FormBuilder,
    store: RequestForInformationStore,
    taskStore: RequestTaskStore,
    requestTaskFileService: RequestTaskFileService,
  ): FormGroup<RequestForInformationFormModel> => {
    const requestTaskId = taskStore.select(requestTaskQuery.selectRequestTaskId)();
    const rfiPayload = store.select(rfiQuery.selectRfi)();
    const uploadedFiles = rfiPayload?.files as unknown as UploadedFile[];
    const attachments = (uploadedFiles ?? [])
      .map((uploadedFile) => ({ [uploadedFile?.uuid]: uploadedFile?.file?.name }))
      .reduce((acc, fileObject) => {
        const [key, value] = Object.entries(fileObject)[0];
        acc[key] = value;
        return acc;
      }, {});

    return fb.group({
      deadline: fb.control<RequestForInformationModel['deadline'] | null>(rfiPayload?.deadline ?? null, {
        validators: [GovukValidators.required('Enter a date'), futureDateValidator()],
      }),
      questions: fb.array<FormControl<string | null>>(
        (rfiPayload?.questions ?? ['']).map((question) => addQuestion(question)),
      ),
      files: requestTaskFileService.buildFormControl(
        requestTaskId,
        (uploadedFiles ?? []).map((uploadedFile) => uploadedFile?.uuid),
        attachments,
        'RFI_UPLOAD_ATTACHMENT',
        false,
      ),
    });
  },
};
