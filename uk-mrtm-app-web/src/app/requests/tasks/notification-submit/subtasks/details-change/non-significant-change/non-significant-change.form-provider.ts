import { Provider } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

import { isAfter } from 'date-fns';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { TASK_FORM } from '@requests/common/task-form.token';
import { notificationQuery } from '@requests/tasks/notification-submit/+state';
import { NonSignificantChangeFormType } from '@requests/tasks/notification-submit/subtasks/details-change/non-significant-change/non-significant-change.types';
import { RequestTaskFileService } from '@shared/services';
import { isNil } from '@shared/utils';

const validEndDateLaterThenStartDateValidator = (): ValidatorFn => {
  return (group: UntypedFormGroup): ValidationErrors => {
    const startDateValue = group.get('startDate')?.value;
    const endDateValue = group.get('endDate')?.value;
    const validations: {
      invalidStartDate?: string;
      invalidEndDate?: string;
    } = {};

    // Only create Date objects if the values are truthy and not empty strings
    const startDate = startDateValue ? new Date(startDateValue) : null;
    const endDate = endDateValue ? new Date(endDateValue) : null;

    if (!(endDate == null || startDate == null || isAfter(endDate, startDate))) {
      validations.invalidEndDate = 'End date must be later than start date';
    }

    return Object.keys(validations).length === 0 ? null : validations;
  };
};

export const nonSignificantChangeFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore, RequestTaskFileService],
  useFactory: (formBuilder: FormBuilder, store: RequestTaskStore, fileService: RequestTaskFileService): FormGroup => {
    const detailsOfChange = store.select(notificationQuery.selectDetailsOfChange)();
    const requestTaskId = store.select(requestTaskQuery.selectRequestTaskId)();
    const attachments = store.select(notificationQuery.selectAttachments)();
    const isEditable = store.select(requestTaskQuery.selectIsEditable)();

    return formBuilder.group(
      {
        description: formBuilder.control<NonSignificantChangeFormType['description']>(
          detailsOfChange?.description ?? null,
          {
            validators: [
              GovukValidators.required('Enter the non significant change description'),
              GovukValidators.maxLength(
                10000,
                'The non significant change description should contain a maximum of 10000 characters',
              ),
            ],
          },
        ),
        justification: formBuilder.control<NonSignificantChangeFormType['justification']>(
          detailsOfChange?.justification ?? null,
          {
            validators: [
              GovukValidators.required('Enter the justification for not submitting a variation'),
              GovukValidators.maxLength(
                10000,
                'The justification for not submitting a variation should contain a maximum of 10000 characters',
              ),
            ],
          },
        ),
        startDate: formBuilder.control<NonSignificantChangeFormType['startDate'] | Date>(
          !isNil(detailsOfChange?.startDate) ? new Date(detailsOfChange?.startDate) : null,
        ),
        endDate: formBuilder.control<NonSignificantChangeFormType['endDate'] | Date>(
          !isNil(detailsOfChange?.endDate) ? new Date(detailsOfChange?.endDate) : null,
        ),
        documents: fileService.buildFormControl(
          requestTaskId,
          detailsOfChange?.documents ?? [],
          attachments,
          'EMP_NOTIFICATION_UPLOAD_SECTION_ATTACHMENT',
          false,
          !isEditable,
        ),
      },
      {
        updateOn: 'change',
        validators: [validEndDateLaterThenStartDateValidator()],
      },
    );
  },
};
