import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { TextareaComponent, TextInputComponent } from '@netz/govuk-components';

import { existingControlContainer } from '@shared/providers';

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'mrtm-emp-procedure-form',
  standalone: true,
  imports: [TextareaComponent, ReactiveFormsModule, TextInputComponent],
  viewProviders: [existingControlContainer],
  templateUrl: './emp-procedure-form.component.html',
})
export class EmpProcedureFormComponent {}
