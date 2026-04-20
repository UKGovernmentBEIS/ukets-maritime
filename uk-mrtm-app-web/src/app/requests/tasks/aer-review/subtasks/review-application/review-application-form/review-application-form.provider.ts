import { Provider } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { AerDataReviewDecision, AerSaveReviewGroupDecisionRequestTaskActionPayload } from '@mrtm/api';
import { ReviewDecisionRequiredChange } from '@mrtm/api';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { TASK_FORM } from '@requests/common';
import { AER_REVIEW_AVAILABLE_OPTIONS, AER_REVIEW_DATA_TYPE, AER_REVIEW_GROUP } from '@requests/tasks/aer-review';
import { aerReviewQuery } from '@requests/tasks/aer-review/+state';
import {
  RequiredChangeFormModel,
  ReviewApplicationFormGroupModel,
  ReviewApplicationFormModel,
} from '@requests/tasks/aer-review/aer-review.types';
import { RequestTaskFileService } from '@shared/services';
import { requestTypeUploadActionMap } from '@shared/types';
import { atLeastOneRequiredValidator } from '@shared/validators';

export const reviewApplicationFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [
    FormBuilder,
    AER_REVIEW_GROUP,
    AER_REVIEW_AVAILABLE_OPTIONS,
    AER_REVIEW_DATA_TYPE,
    RequestTaskStore,
    RequestTaskFileService,
  ],
  useFactory: (
    formBuilder: FormBuilder,
    step_group: AerSaveReviewGroupDecisionRequestTaskActionPayload['group'],
    availableOptions: Array<AerDataReviewDecision['type']>,
    reviewDataType: ReviewApplicationFormModel['reviewDataType'],
    store: RequestTaskStore,
    requestTaskFileService: RequestTaskFileService,
  ): ReviewApplicationFormGroupModel => {
    const group = store.select(aerReviewQuery.selectReviewGroupDecision(step_group))();
    const reviewAttachments = store.select(aerReviewQuery.selectReviewAttachments)();

    return formBuilder.group({
      group: formBuilder.control<ReviewApplicationFormModel['group']>(step_group),
      reviewDataType: formBuilder.control<ReviewApplicationFormModel['reviewDataType']>(reviewDataType),
      type: formBuilder.control<ReviewApplicationFormModel['type']>(group?.type, {
        validators: [GovukValidators.required('Select a decision for this review group')],
        updateOn: 'change',
      }),
      notes: formBuilder.control<ReviewApplicationFormModel['notes']>(group?.details?.notes, {
        validators: [GovukValidators.maxLength(10000, 'Enter up to 10000 characters')],
      }),
      requiredChanges: formBuilder.array<FormGroup<RequiredChangeFormModel>>(
        (group?.details as ReviewApplicationFormModel)?.requiredChanges?.map((requiredChange) =>
          createAnotherRequiredChange(
            store,
            requestTaskFileService,
            requiredChange as any as ReviewDecisionRequiredChange,
            reviewAttachments,
          ),
        ) ??
          [
            availableOptions.includes('OPERATOR_AMENDS_NEEDED')
              ? createAnotherRequiredChange(store, requestTaskFileService)
              : [],
          ].flat(),
      ),
    });
  },
};

export function createAnotherRequiredChange(
  store: RequestTaskStore,
  requestTaskFileService: RequestTaskFileService,
  requiredChange?: ReviewDecisionRequiredChange,
  followUpAttachments?: { [key: string]: string },
): FormGroup<RequiredChangeFormModel> {
  const requestTaskId = store.select(requestTaskQuery.selectRequestTaskId)();
  const uploadPermissionKey = requestTypeUploadActionMap[store.select(requestTaskQuery.selectRequestTaskType)()];

  return new FormGroup(
    {
      reason: new FormControl(requiredChange?.reason ?? null, [
        GovukValidators.required('Enter the change required by the operator'),
        GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
      ]),
      files: requestTaskFileService.buildFormControl(
        requestTaskId,
        requiredChange?.files ?? [],
        followUpAttachments,
        uploadPermissionKey,
        false,
      ),
    },
    {
      validators: [atLeastOneRequiredValidator('You must add an item to the list of changes required.')],
    },
  );
}
