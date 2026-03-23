import { NgClass } from '@angular/common';
import { Component, ContentChild, inject, Input } from '@angular/core';
import { ControlContainer, ControlValueAccessor, NgControl, ReactiveFormsModule } from '@angular/forms';

import { FormErrorDirective, LabelDirective } from '../directives';
import { ErrorMessageComponent } from '../error-message';
import { FormService } from '../form';
import { FormInput } from '../form/form-input';
import { LabelSizeType } from '../text-input/label-size.type';
import { GovukSelectOption } from './select.interface';
import { GovukSelectWidthClass } from './select.type';

/*
  eslint-disable
  @angular-eslint/prefer-on-push-component-change-detection,
  @typescript-eslint/no-empty-function,
  @angular-eslint/component-selector
*/
@Component({
  selector: 'div[govuk-select]',
  standalone: true,
  templateUrl: './select.component.html',
  imports: [ReactiveFormsModule, NgClass, FormErrorDirective, ErrorMessageComponent],
})
export class SelectComponent extends FormInput implements ControlValueAccessor {
  @Input() hint: string;
  @Input() options: GovukSelectOption[];
  @Input() widthClass: GovukSelectWidthClass;
  @Input() isLabelHidden = true;
  @ContentChild(LabelDirective) templateLabel: LabelDirective;
  currentLabel = 'Select';
  currentLabelSize = 'govuk-label';

  constructor() {
    const ngControl = inject(NgControl, { self: true, optional: true })!;
    const formService = inject(FormService);
    const container = inject(ControlContainer, { optional: true })!;

    super(ngControl, formService, container);
  }

  @Input() set label(label: string) {
    this.currentLabel = label;
    this.isLabelHidden = false;
  }

  @Input() set labelSize(size: LabelSizeType) {
    switch (size) {
      case 'small':
        this.currentLabelSize = 'govuk-label govuk-label--s';
        break;
      case 'medium':
        this.currentLabelSize = 'govuk-label govuk-label--m';
        break;
      case 'large':
        this.currentLabelSize = 'govuk-label govuk-label--l';
        break;
      default:
        this.currentLabelSize = 'govuk-label';
        break;
    }
  }

  writeValue(): void {}

  registerOnChange(): void {}

  registerOnTouched(): void {}
}
