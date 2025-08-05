import { Routes } from '@angular/router';

import { EmailLinkInvalidComponent } from '@forgot-password/email-link-invalid/email-link-invalid.component';
import { ResetPasswordComponent } from '@forgot-password/reset-password/reset-password.component';
import { SubmitEmailComponent } from '@forgot-password/submit-email/submit-email.component';
import { SubmitOtpComponent } from '@forgot-password/submit-otp/submit-otp.component';

export const FORGOT_PASSWORD_ROUTES: Routes = [
  {
    path: '',
    title: 'Forgot password',
    data: { breadcrumb: true },
    component: SubmitEmailComponent,
  },
  {
    path: 'invalid-link',
    title: 'This link is invalid',
    data: { breadcrumb: true },
    component: EmailLinkInvalidComponent,
  },
  {
    path: 'reset-password',
    title: 'Reset password',
    data: { breadcrumb: true },
    component: ResetPasswordComponent,
  },
  {
    path: 'otp',
    title: 'Submit otp',
    data: { breadcrumb: true },
    component: SubmitOtpComponent,
  },
];
