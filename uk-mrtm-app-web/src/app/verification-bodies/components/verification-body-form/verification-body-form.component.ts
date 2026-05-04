import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { TextInputComponent } from '@netz/govuk-components';

import { existingControlContainer } from '@shared/providers/control-container.factory';

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'mrtm-verification-body-form',
  imports: [TextInputComponent, ReactiveFormsModule],
  standalone: true,
  templateUrl: './verification-body-form.component.html',
  viewProviders: [existingControlContainer],
})
export class VerificationBodyFormComponent {}
