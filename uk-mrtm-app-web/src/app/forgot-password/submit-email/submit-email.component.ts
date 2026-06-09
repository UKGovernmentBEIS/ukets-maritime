import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';

import { ForgotPasswordService } from '@mrtm/api';

import { GovukValidators, TextInputComponent } from '@netz/govuk-components';

import { EmailSentComponent } from '@forgot-password/email-sent/email-sent.component';
import { WizardStepComponent } from '@shared/components';

@Component({
  selector: 'mrtm-submit-email',
  imports: [ReactiveFormsModule, TextInputComponent, EmailSentComponent, WizardStepComponent],
  standalone: true,
  templateUrl: './submit-email.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubmitEmailComponent {
  private readonly forgotPasswordService = inject(ForgotPasswordService);
  private readonly fb = inject(UntypedFormBuilder);

  readonly isEmailSent = signal(false);

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
    this.forgotPasswordService.sendResetPasswordEmail({ email: this.form.get('email').value }).subscribe(() => {
      this.isEmailSent.update(() => true);
    });
  }

  retryResetPassword() {
    this.isEmailSent.update(() => false);
  }
}
