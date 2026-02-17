import { Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { DateInputComponent, TextInputComponent } from '@netz/govuk-components';

import { LocationStateFormComponent } from '@shared/components';
import { existingControlContainer } from '@shared/providers/control-container.factory';

/* eslint-disable @angular-eslint/prefer-on-push-component-change-detection */
@Component({
  selector: 'mrtm-operator-account-form',
  imports: [LocationStateFormComponent, ReactiveFormsModule, TextInputComponent, DateInputComponent],
  standalone: true,
  templateUrl: './operator-account-form.component.html',
  viewProviders: [existingControlContainer],
})
export class OperatorAccountFormComponent {
  readonly formMode = input<'EDIT' | 'NEW'>('NEW');
}
