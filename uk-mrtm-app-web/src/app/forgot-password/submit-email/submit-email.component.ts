import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';

import { ForgotPasswordService } from '@mrtm/api';

import { ButtonDirective, GovukValidators, TextInputComponent } from '@netz/govuk-components';

import { EmailSentComponent } from '@forgot-password/email-sent/email-sent.component';
import { BackToTopComponent } from '@shared/components';

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'mrtm-submit-email',
  templateUrl: './submit-email.component.html',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TextInputComponent,
    ButtonDirective,
    BackToTopComponent,
    EmailSentComponent,
  ],
})
export class SubmitEmailComponent {
  private readonly forgotPasswordService = inject(ForgotPasswordService);
  private readonly fb = inject(UntypedFormBuilder);

  isSummaryDisplayed: boolean;
  isEmailSent: boolean;

  form = this.fb.group({
    email: [
      null,
      [
        GovukValidators.required('Enter your email address'),
        GovukValidators.email('Enter an email address in the correct format, like name@example.com'),
        GovukValidators.maxLength(255, 'Enter an email address with a maximum of 255 characters'),
      ],
    ],
  });

  onSubmit(): void {
    if (this.form.valid) {
      this.forgotPasswordService.sendResetPasswordEmail({ email: this.form.get('email').value }).subscribe(() => {
        this.isEmailSent = true;
      });
    } else {
      this.isSummaryDisplayed = true;
    }
  }

  retryResetPassword() {
    this.isEmailSent = false;
  }
}
