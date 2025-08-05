import { InjectionToken, Provider, Signal } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { AuthStore, selectUserId } from '@netz/common/auth';
import { GovukValidators } from '@netz/govuk-components';

import {
  RequestNotificationFormModel,
  RequestNotificationModel,
  RequestNotificationService,
} from '@requests/common/emp/components/request-notification-form/request-notification-form.types';
import { TASK_FORM } from '@requests/common/task-form.token';

export const REQUEST_NOTIFICATION_SERVICE: InjectionToken<RequestNotificationService> =
  new InjectionToken<RequestNotificationService>('Request notification service');

export const REQUEST_NOTIFICATION_DATA: InjectionToken<Signal<RequestNotificationModel>> = new InjectionToken<
  Signal<RequestNotificationModel>
>('Request notification data');

export const requestNotificationFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, REQUEST_NOTIFICATION_DATA, AuthStore],
  useFactory: (
    fb: FormBuilder,
    requestData: Signal<RequestNotificationModel>,
    authStore: AuthStore,
  ): FormGroup<RequestNotificationFormModel> => {
    const currentUserId = authStore.select(selectUserId)();

    return fb.group<RequestNotificationFormModel>({
      signatory: fb.control<RequestNotificationModel['signatory'] | null>(requestData()?.signatory ?? currentUserId, {
        validators: [GovukValidators.required('Select a name to appear on the official notice document.')],
      }),
      operators: fb.control<string[]>(requestData()?.operators ?? []),
    });
  },
};
