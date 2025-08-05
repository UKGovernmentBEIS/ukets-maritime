import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { produce } from 'immer';

import { SignalStore } from '@netz/common/store';

import { initialNotificationBannerState, NotificationBannerState } from '@shared/components/notification-banner';

@Injectable({ providedIn: 'root' })
export class NotificationBannerStore extends SignalStore<NotificationBannerState> {
  constructor() {
    super(initialNotificationBannerState);
  }

  setSuccessMessages(messages: NotificationBannerState['successMessages']) {
    this.setState(
      produce(this.state, (state) => {
        state.successMessages = messages;
        state.type = 'success';
      }),
    );
  }

  setInvalidForm(form: NotificationBannerState['invalidForm']) {
    // Create a new form to contain the form errors. This is done to detach the errors being displayed in the banner
    // from the form, which is being edited in real time. Also, only the errors are copied over to the new form to
    // optimize performance.
    const errorForm = new FormGroup({});
    errorForm.setErrors(form?.errors);
    this.setState(
      produce(this.state, (state) => {
        state.invalidForm = errorForm;
        state.type = 'error';
      }),
    );
  }

  reset(): void {
    this.setState(initialNotificationBannerState);
  }
}
