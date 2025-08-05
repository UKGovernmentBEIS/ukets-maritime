import { FormGroup, NgForm } from '@angular/forms';

export interface NotificationBannerState {
  type: 'success' | 'error' | null;
  successMessages: string[];
  invalidForm: NgForm | FormGroup | null;
}

export const initialNotificationBannerState: NotificationBannerState = {
  type: null,
  successMessages: [],
  invalidForm: null,
};
