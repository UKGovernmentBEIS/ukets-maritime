import { Provider } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { RdeDecisionPayload, RdeForceDecisionPayload } from '@mrtm/api';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { rdeDetailsQuery } from '@requests/common/emp/request-deadline-extension/+state/request-deadline-details.selectors';
import { RequestDeadlineExtensionDecisionFormModel } from '@requests/common/emp/request-deadline-extension/request-deadline-extension-decision/request-deadline-extension-decision.types';
import { TASK_FORM } from '@requests/common/task-form.token';
import { RequestTaskFileService } from '@shared/services';
import { requestTypeUploadActionMap } from '@shared/types';

export const requestDeadlineExtensionDecisionFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore, RequestTaskFileService],
  useFactory: (
    fb: FormBuilder,
    store: RequestTaskStore,
    requestTaskFileService: RequestTaskFileService,
  ): FormGroup<RequestDeadlineExtensionDecisionFormModel> => {
    const requestTaskId = store.select(requestTaskQuery.selectRequestTaskId)();
    const isRegulatorTask = store.select(rdeDetailsQuery.selectIsRegulatorTask)();
    const attachments = store.select(rdeDetailsQuery.selectRdeAttachments)();
    const uploadPermissionKey = requestTypeUploadActionMap[store.select(requestTaskQuery.selectRequestTaskType)()];
    const disabled = !store.select(requestTaskQuery.selectIsEditable)();
    const isReasonDisabled = !store.select(requestTaskQuery.selectIsEditable)() || isRegulatorTask;

    return fb.group<RequestDeadlineExtensionDecisionFormModel>({
      decision: fb.control<RdeForceDecisionPayload['decision'] | null>(
        { value: null, disabled: disabled },
        {
          validators: [GovukValidators.required('Select a decision')],
        },
      ),
      evidence: fb.control<RdeForceDecisionPayload['decision']>(
        { value: null, disabled: disabled },
        {
          validators: isRegulatorTask
            ? [
                GovukValidators.required('Enter details'),
                GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
              ]
            : undefined,
        },
      ),
      reason: fb.control<RdeDecisionPayload['reason'] | null>(
        { value: null, disabled: isReasonDisabled },
        {
          validators: [
            GovukValidators.required('Enter a reason'),
            GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
          ],
        },
      ),
      files: requestTaskFileService.buildFormControl(
        requestTaskId,
        [],
        attachments,
        uploadPermissionKey,
        false,
        disabled,
      ),
    });
  },
};
