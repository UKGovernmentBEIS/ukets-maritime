import { Component, inject, input, signal } from '@angular/core';
import { ControlContainer, FormGroupDirective, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ButtonDirective, TagComponent, TextInputComponent } from '@netz/govuk-components';

import { PasswordStrengthMeterComponent } from '@shared/components/password-strength-meter';

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'mrtm-password',
  imports: [
    TextInputComponent,
    FormsModule,
    ReactiveFormsModule,
    ButtonDirective,
    PasswordStrengthMeterComponent,
    TagComponent,
  ],
  standalone: true,
  templateUrl: './password.component.html',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class PasswordComponent {
  readonly formGroupDirective = inject(FormGroupDirective);

  readonly passwordLabel = input('Password');
  readonly confirmPasswordLabel = input('Re-enter your password');
  readonly includeActivationMessage = input(true);

  protected readonly showLabel = signal<'Show' | 'Hide'>('Show');
  protected readonly passwordInputType = signal<'password' | 'text'>('password');
  protected readonly passwordStrength = signal<number | null>(null);

  togglePassword() {
    if (this.showLabel() === 'Show') {
      this.showLabel.set('Hide');
      this.passwordInputType.set('text');
    } else {
      this.showLabel.set('Show');
      this.passwordInputType.set('password');
    }
  }
}
