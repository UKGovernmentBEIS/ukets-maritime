import { Provider } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { rfiRespondQuery } from '@requests/common/emp/request-for-information/+state';
import { RequestForInformationRespondFormModel } from '@requests/common/emp/request-for-information/request-for-information-respond-form/request-for-information-respond-form.types';
import { TASK_FORM } from '@requests/common/task-form.token';
import { RequestTaskFileService } from '@shared/services';
import { requestTypeUploadActionMap } from '@shared/types';

export const requestForInformationRespondFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore, RequestTaskFileService],
  useFactory: (
    fb: FormBuilder,
    store: RequestTaskStore,
    requestTaskFileService: RequestTaskFileService,
  ): FormGroup<RequestForInformationRespondFormModel> => {
    const questionsPayload = store.select(rfiRespondQuery.selectQuestion)();
    const attachments = store.select(rfiRespondQuery.selectAttachments)();
    const uploadPermissionKey = requestTypeUploadActionMap[store.select(requestTaskQuery.selectRequestTaskType)()];
    const requestTaskId = store.select(requestTaskQuery.selectRequestTaskId)();

    return fb.group({
      answers: fb.array<FormControl<string | null>>(
        (questionsPayload?.questions ?? []).map(() =>
          fb.control<string | null>(null, {
            validators: [
              GovukValidators.required('Enter a response'),
              GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
            ],
          }),
        ),
      ),
      files: requestTaskFileService.buildFormControl(requestTaskId, [], attachments, uploadPermissionKey, false),
    });
  },
};
