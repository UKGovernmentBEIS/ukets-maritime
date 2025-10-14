import { Provider } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn } from '@angular/forms';

import { EmissionsMonitoringPlan, ReviewDecisionRequiredChange } from '@mrtm/api';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { empVariationReviewQuery } from '@requests/common/emp/+state';
import { EmpVariationReviewTaskPayload } from '@requests/common/emp/emp.types';
import { subtaskReviewGroupMap } from '@requests/common/emp/utils';
import {
  RequiredChangeFormModel,
  ReviewDecisionFormModel,
  VARIATION_REVIEW_DECISION_FORM,
} from '@requests/tasks/emp-variation-review/components/review-decision';
import { RequestTaskFileService } from '@shared/services';
import { EmpVariationReviewDecisionUnion, requestTypeUploadActionMap } from '@shared/types';
import { atLeastOneRequiredValidator } from '@shared/validators';

const empReviewDecisionFormGroupBuilder = (
  fb: FormBuilder,
  reviewDecision: EmpVariationReviewDecisionUnion,
  reviewAttachments: EmpVariationReviewTaskPayload['reviewAttachments'],
  store: RequestTaskStore,
  requestTaskFileService: RequestTaskFileService,
  extraFormGroupValidators?: Array<() => ValidatorFn>,
): ReviewDecisionFormModel =>
  fb.group(
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
      variationScheduleItems: fb.array(
        (reviewDecision?.details?.variationScheduleItems ?? []).map((item) => createAnotherVariationSchedule(item)),
      ),
    },
    {
      validators: (extraFormGroupValidators ?? []).map((validatorFn) => validatorFn()),
    },
  );

export const reviewEmpSubtaskDecisionFormProvider = (
  subTask: keyof EmissionsMonitoringPlan,
  extraFormGroupValidators?: Array<() => ValidatorFn>,
): Provider => {
  return {
    provide: VARIATION_REVIEW_DECISION_FORM,
    deps: [FormBuilder, RequestTaskStore, RequestTaskFileService],
    useFactory: (
      fb: FormBuilder,
      store: RequestTaskStore,
      requestTaskFileService: RequestTaskFileService,
    ): ReviewDecisionFormModel => {
      const reviewGroup = subtaskReviewGroupMap[subTask];
      const reviewDecision = store.select(empVariationReviewQuery.selectReviewGroupDecisions)()?.[reviewGroup];
      const reviewAttachments = store.select(empVariationReviewQuery.selectReviewAttachments)();

      return empReviewDecisionFormGroupBuilder(
        fb,
        reviewDecision,
        reviewAttachments,
        store,
        requestTaskFileService,
        extraFormGroupValidators,
      );
    },
  };
};

export const reviewEmpVariationDetailsDecisionFormProvider: Provider = {
  provide: VARIATION_REVIEW_DECISION_FORM,
  deps: [FormBuilder, RequestTaskStore, RequestTaskFileService],
  useFactory: (
    fb: FormBuilder,
    store: RequestTaskStore,
    requestTaskFileService: RequestTaskFileService,
  ): ReviewDecisionFormModel => {
    const reviewDecision = store.select(
      empVariationReviewQuery.selectEmpVariationDetailsReviewDecision,
    )() as EmpVariationReviewDecisionUnion;
    const reviewAttachments = store.select(empVariationReviewQuery.selectReviewAttachments)();

    return empReviewDecisionFormGroupBuilder(fb, reviewDecision, reviewAttachments, store, requestTaskFileService);
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

export const createAnotherVariationSchedule = (variationSchedule?: string): FormControl<string> =>
  new FormControl(variationSchedule ?? null, [
    GovukValidators.required('Enter the change included in the variation schedule'),
    GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
  ]);
