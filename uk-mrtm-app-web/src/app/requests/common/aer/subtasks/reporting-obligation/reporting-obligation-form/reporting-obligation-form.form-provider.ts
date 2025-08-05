import { Provider } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { aerCommonQuery } from '@requests/common/aer/+state';
import { TASK_FORM } from '@requests/common/task-form.token';
import { RequestTaskFileService } from '@shared/services';
import { requestTypeUploadActionMap } from '@shared/types';

export const reportingObligationFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore, RequestTaskFileService],
  useFactory: (formBuilder: FormBuilder, store: RequestTaskStore, requestTaskFileService: RequestTaskFileService) => {
    const requestTaskId = store.select(requestTaskQuery.selectRequestTaskId)();
    const isEditable = store.select(requestTaskQuery.selectIsEditable)();
    const reportingRequired = store.select(aerCommonQuery.selectReportingRequired)();
    const reportingObligationDetails = store.select(aerCommonQuery.selectReportingObligationDetails)();
    const aerAttachments = store.select(aerCommonQuery.selectAerAttachments)();
    const uploadPermissionKey = requestTypeUploadActionMap[store.select(requestTaskQuery.selectRequestTaskType)()];

    return formBuilder.group({
      reportingRequired: formBuilder.control<boolean>(reportingRequired, {
        updateOn: 'change',
        validators: [GovukValidators.required('Select yes if you are required to submit a report')],
      }),
      noReportingReason: formBuilder.control<string>(
        {
          value: reportingObligationDetails?.noReportingReason ?? null,
          disabled: !!reportingRequired,
        },
        {
          validators: [
            GovukValidators.required('Please provide information to support your reason for not reporting.'),
            GovukValidators.maxLength(10000, 'Explanation must be 10000 characters or less.'),
          ],
        },
      ),
      supportingDocuments: requestTaskFileService.buildFormControl(
        requestTaskId,
        reportingObligationDetails?.supportingDocuments ?? [],
        aerAttachments,
        uploadPermissionKey,
        false,
        !isEditable,
      ),
    });
  },
};
