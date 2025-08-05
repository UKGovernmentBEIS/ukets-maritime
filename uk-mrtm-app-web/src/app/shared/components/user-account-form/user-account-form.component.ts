import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { TextInputComponent } from '@netz/govuk-components';

import { PhoneInputComponent } from '@shared/components';
import { existingControlContainer } from '@shared/providers/control-container.factory';

/* eslint-disable @angular-eslint/prefer-on-push-component-change-detection */
@Component({
  selector: 'mrtm-user-account-form',
  standalone: true,
  imports: [ReactiveFormsModule, TextInputComponent, PhoneInputComponent],
  viewProviders: [existingControlContainer],
  templateUrl: './user-account-form.component.html',
})
export class UserAccountFormComponent {
  @Input() formMode: 'CREATE' | 'EDIT' = 'CREATE';
  @Input() emailHint: string;
  @Input() phoneType: 'full' | 'national';
}
