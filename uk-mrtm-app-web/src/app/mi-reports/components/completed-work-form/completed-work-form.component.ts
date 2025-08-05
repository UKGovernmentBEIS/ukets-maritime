import { Component, input } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';

import {
  ConditionalContentDirective,
  RadioComponent,
  RadioOptionComponent,
  TextInputComponent,
} from '@netz/govuk-components';

import { DatePickerComponent } from '@shared/components';
import { existingControlContainer } from '@shared/providers';

/* eslint-disable @angular-eslint/prefer-on-push-component-change-detection */
@Component({
  selector: 'mrtm-completed-work-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RadioComponent,
    RadioOptionComponent,
    ConditionalContentDirective,
    TextInputComponent,
    DatePickerComponent,
  ],
  templateUrl: './completed-work-form.component.html',
  viewProviders: [existingControlContainer],
})
export class CompletedWorkFormComponent {
  formGroup = input<UntypedFormGroup>(new UntypedFormGroup({}));
}
