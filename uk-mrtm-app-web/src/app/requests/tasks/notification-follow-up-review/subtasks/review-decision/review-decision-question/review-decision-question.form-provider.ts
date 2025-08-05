import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';

import { ReviewDecisionRequiredChange } from '@mrtm/api';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { TASK_FORM } from '@requests/common/task-form.token';
import { followUpReviewQuery } from '@requests/tasks/notification-follow-up-review/+state';
import { RequestTaskFileService } from '@shared/services';
import { atLeastOneRequiredValidator, futureDateValidator } from '@shared/validators';

export const reviewDecisionQuestionFormProvider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore, RequestTaskFileService],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore, fileService: RequestTaskFileService) => {
    const requestTaskId = store.select(requestTaskQuery.selectRequestTaskId)();
    const reviewDecision = store.select(followUpReviewQuery.selectReviewDecision)();
    const followUpAttachments = store.select(followUpReviewQuery.selectFollowUpAttachments)();

    return fb.group({
      type: [
        reviewDecision?.type ? reviewDecision?.type : null,
        { validators: [GovukValidators.required('Select a decision')], updateOn: 'change' },
      ],
      notes: [
        reviewDecision?.details?.notes ?? null,
        { validators: [GovukValidators.maxLength(10000, 'Enter up to 10000 characters')] },
      ],
      requiredChanges: fb.array(
        reviewDecision?.details?.requiredChanges?.map((requiredChange) =>
          createAnotherRequiredChange(requestTaskId, fileService, requiredChange, followUpAttachments),
        ) ?? [createAnotherRequiredChange(requestTaskId, fileService)],
      ),
      dueDate: [
        reviewDecision?.details?.dueDate ? new Date(reviewDecision.details.dueDate) : null,
        { validators: [futureDateValidator()] },
      ],
    });
  },
};

export function createAnotherRequiredChange(
  requestTaskId: number,
  requestTaskFileService: RequestTaskFileService,
  requiredChange?: ReviewDecisionRequiredChange,
  followUpAttachments?: { [key: string]: string },
): UntypedFormGroup {
  return new UntypedFormGroup(
    {
      reason: new UntypedFormControl(requiredChange?.reason ?? null, [
        GovukValidators.required('Enter the change required by the operator'),
        GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
      ]),
      files: requestTaskFileService.buildFormControl(
        requestTaskId,
        requiredChange?.files ?? [],
        followUpAttachments,
        'EMP_NOTIFICATION_FOLLOW_UP_UPLOAD_ATTACHMENT',
        false,
      ),
    },
    {
      validators: [atLeastOneRequiredValidator('You must add an item to the list of changes required.')],
    },
  );
}
