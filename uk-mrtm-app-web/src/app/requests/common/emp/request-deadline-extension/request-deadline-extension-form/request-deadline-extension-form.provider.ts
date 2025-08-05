import { Provider } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  UntypedFormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

import { GovukDatePipe } from '@netz/common/pipes';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { rdeQuery } from '@requests/common/emp/request-deadline-extension/+state';
import {
  RequestDeadlineExtensionFormModel,
  RequestDeadlineExtensionModel,
} from '@requests/common/emp/request-deadline-extension/request-deadline-extension-form/request-deadline-extension-form.types';
import { RequestDeadlineExtensionStore } from '@requests/common/emp/request-deadline-extension/services';
import { TASK_FORM } from '@requests/common/task-form.token';
import { futureDateValidator } from '@shared/validators';

export const requestDeadlineExtensionFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore, RequestDeadlineExtensionStore],
  useFactory: (
    fb: FormBuilder,
    taskStore: RequestTaskStore,
    rdeStore: RequestDeadlineExtensionStore,
  ): FormGroup<RequestDeadlineExtensionFormModel> => {
    const daysRemaining = taskStore.select(requestTaskQuery.selectRequestTask)()?.daysRemaining;
    const rdePayload = rdeStore.select(rdeQuery.selectRde)();

    return fb.group(
      {
        extensionDate: fb.control<RequestDeadlineExtensionModel['extensionDate'] | null>(
          rdePayload?.extensionDate ?? null,
          {
            validators: [extensionDateValidator(daysRemaining), futureDateValidator()],
          },
        ),
        deadline: fb.control<RequestDeadlineExtensionModel['deadline'] | null>(rdePayload?.deadline ?? null, {
          validators: [futureDateValidator()],
        }),
      },
      { validators: [deadlineValidator()] },
    );
  },
};

export function extensionDateValidator(daysRemaining?: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: string } | null => {
    const govukDatePipe = new GovukDatePipe();

    const now = new Date();
    const determinationDueDate = now.setDate(now.getDate() + daysRemaining);
    const determinationDueDateToString = govukDatePipe.transform(new Date(determinationDueDate));

    return control.value && control.value <= determinationDueDate
      ? { invalidDate: `The day must be after ${determinationDueDateToString}` }
      : null;
  };
}

export function deadlineValidator(): ValidatorFn {
  return (group: UntypedFormGroup): ValidationErrors => {
    const extensionDate = group.get('extensionDate').value;
    const isextensionDateValid = group.get('extensionDate').valid;
    const deadline = group.get('deadline').value;

    const govukDatePipe = new GovukDatePipe();
    const extensionDateToString = govukDatePipe.transform(new Date(extensionDate));

    const errors = group.controls['deadline'].errors;

    if (extensionDate && deadline && deadline >= extensionDate && isextensionDateValid) {
      group.controls['deadline'].setErrors({
        ...errors,
        invalidDeadline: `Deadline must be before ${extensionDateToString}`,
      });
      // if the extension date is null or is after the deadline then remove the error
    } else if (!extensionDate || (extensionDate && deadline && deadline < extensionDate)) {
      if (errors) {
        delete errors.invalidDeadline;
      }
      if (errors && Object.keys(errors).length === 0) {
        group.controls['deadline'].setErrors(null);
      }
    }
    return null;
  };
}
