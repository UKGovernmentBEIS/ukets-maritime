import { Component, HostBinding, inject, Input } from '@angular/core';
import { ControlValueAccessor, FormsModule, NgControl, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';

import { FormService } from '@netz/govuk-components';

/* eslint-disable
   @angular-eslint/prefer-on-push-component-change-detection,
   @typescript-eslint/no-empty-function,
   @typescript-eslint/no-unused-vars
*/
@Component({
  selector: 'div[mrtm-radio-option]',
  templateUrl: './radio-option.component.html',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
})
export class RadioOptionComponent implements ControlValueAccessor {
  readonly ngControl = inject(NgControl, { self: true, optional: true })!;
  private readonly formService = inject(FormService);

  @Input() index: string;
  @Input() value: string;
  @Input() label: string;
  @Input() isDisabled: boolean;

  @HostBinding('class.govuk-radios__item') readonly govukRadiosItem = true;

  constructor() {
    const ngControl = this.ngControl;

    ngControl.valueAccessor = this;
  }

  get identifier(): string {
    return this.formService.getControlIdentifier(this.ngControl);
  }

  get control(): UntypedFormControl {
    return this.ngControl.control as UntypedFormControl;
  }

  writeValue = (_: any): void => {};

  registerOnChange = (_: any): void => {};

  registerOnTouched = (_: any): void => {};
}
