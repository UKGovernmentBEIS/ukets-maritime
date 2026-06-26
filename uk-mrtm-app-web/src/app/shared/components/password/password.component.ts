import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';

import { ButtonDirective, TextInputComponent } from '@netz/govuk-components';

import { PasswordStrengthMeterComponent } from '@shared/components/password-strength-meter';

@Component({
  selector: 'mrtm-password',
  imports: [TextInputComponent, ReactiveFormsModule, ButtonDirective, PasswordStrengthMeterComponent],
  standalone: true,
  templateUrl: './password.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class PasswordComponent {
  readonly formGroupDirective = inject(FormGroupDirective);

  readonly passwordLabel = input('Password');
  readonly confirmPasswordLabel = input('Re-enter your password');
  readonly includeActivationMessage = input(true);

  readonly showLabel = signal<'Show' | 'Hide'>('Show');
  readonly passwordInputType = signal<'password' | 'text'>('password');

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
