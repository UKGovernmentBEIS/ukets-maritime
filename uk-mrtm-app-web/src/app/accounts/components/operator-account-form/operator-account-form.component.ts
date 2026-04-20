import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { DateInputComponent, TextInputComponent } from '@netz/govuk-components';

import { LocationStateFormComponent } from '@shared/components';
import { existingControlContainer } from '@shared/providers/control-container.factory';

/* eslint-disable @angular-eslint/prefer-on-push-component-change-detection */
@Component({
  selector: 'mrtm-operator-account-form',
  templateUrl: './operator-account-form.component.html',
  viewProviders: [existingControlContainer],
  standalone: true,
  imports: [LocationStateFormComponent, ReactiveFormsModule, TextInputComponent, DateInputComponent],
})
export class OperatorAccountFormComponent {
  @Input() formMode: 'EDIT' | 'NEW' = 'NEW';
}
