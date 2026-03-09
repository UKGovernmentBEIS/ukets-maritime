import { Component, inject, input } from '@angular/core';
import { ControlContainer, FormGroupDirective, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PasswordStrengthMeterComponent } from 'angular-password-strength-meter';

import { ButtonDirective, TagComponent, TextInputComponent } from '@netz/govuk-components';

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'mrtm-password',
  templateUrl: './password.component.html',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  standalone: true,
  imports: [
    TextInputComponent,
    FormsModule,
    ReactiveFormsModule,
    ButtonDirective,
    PasswordStrengthMeterComponent,
    TagComponent,
  ],
})
export class PasswordComponent {
  readonly formGroupDirective = inject(FormGroupDirective);

  passwordLabel = input('Password');
  confirmPasswordLabel = input('Re-enter your password');
  includeActivationMessage = input(true);
  showLabel: 'Show' | 'Hide' = 'Show';
  passwordInputType: 'password' | 'text' = 'password';
  passwordStrength: number;

  togglePassword() {
    if (this.showLabel === 'Show') {
      this.showLabel = 'Hide';
      this.passwordInputType = 'text';
    } else {
      this.showLabel = 'Show';
      this.passwordInputType = 'password';
    }
  }
}
