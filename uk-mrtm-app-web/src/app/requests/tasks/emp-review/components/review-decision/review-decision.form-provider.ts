import { Provider } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn } from '@angular/forms';

import { EmissionsMonitoringPlan, ReviewDecisionRequiredChange } from '@mrtm/api';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { empReviewQuery } from '@requests/common/emp/+state';
import { subtaskReviewGroupMap } from '@requests/common/emp/utils';
import {
  RequiredChangeFormModel,
  REVIEW_DECISION_FORM,
  ReviewDecisionFormModel,
} from '@requests/tasks/emp-review/components/review-decision';
import { RequestTaskFileService } from '@shared/services';
import { requestTypeUploadActionMap } from '@shared/types';
import { atLeastOneRequiredValidator } from '@shared/validators';

export function reviewDecisionFormProvider(
  subTask: keyof EmissionsMonitoringPlan,
  extraFormGroupValidators?: Array<() => ValidatorFn>,
): Provider {
  return {
    provide: REVIEW_DECISION_FORM,
    deps: [FormBuilder, RequestTaskStore, RequestTaskFileService],
    useFactory: (
      fb: FormBuilder,
      store: RequestTaskStore,
      requestTaskFileService: RequestTaskFileService,
    ): ReviewDecisionFormModel => {
      const reviewGroup = subtaskReviewGroupMap[subTask];
      const reviewDecision = store.select(empReviewQuery.selectReviewGroupDecisions)()?.[reviewGroup];
      const reviewAttachments = store.select(empReviewQuery.selectReviewAttachments)();

      return fb.group(
        {
          type: fb.control(reviewDecision?.type ?? null, {
            validators: [GovukValidators.required('Select a decision for this review group')],
            updateOn: 'change',
          }),
          notes: fb.control(reviewDecision?.details?.notes ?? null, [
            GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
          ]),
          requiredChanges: fb.array(
            reviewDecision?.details?.requiredChanges?.map((requiredChange) =>
              createAnotherRequiredChange(store, requestTaskFileService, requiredChange, reviewAttachments),
            ) ?? [createAnotherRequiredChange(store, requestTaskFileService)],
          ),
        },
        {
          validators: (extraFormGroupValidators ?? []).map((fn) => fn()),
        },
      );
    },
  };
}

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
