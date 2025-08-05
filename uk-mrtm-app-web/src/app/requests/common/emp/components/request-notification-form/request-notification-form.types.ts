import { FormControl } from '@angular/forms';

import { RdePayload } from '@mrtm/api';

import { SignalStore } from '@netz/common/store';

export type RequestNotificationModel = Pick<RdePayload, 'operators' | 'signatory'>;

export type RequestNotificationFormModel = {
  operators: FormControl;
  signatory: FormControl;
};

export interface RequestNotificationService extends SignalStore<unknown> {
  setNotification(payload: RequestNotificationModel): void;
}
