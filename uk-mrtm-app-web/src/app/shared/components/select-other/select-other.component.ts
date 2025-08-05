import { NgClass } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  inject,
  Input,
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NgControl, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';

import {
  ConditionalContentDirective,
  FormErrorDirective,
  FormService,
  GovukTextWidthClass,
} from '@netz/govuk-components';

@Component({
  selector: 'mrtm-select-other',
  templateUrl: './select-other.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FormsModule, FormErrorDirective, ReactiveFormsModule, NgClass],
})
export class SelectOtherComponent implements ControlValueAccessor, AfterContentInit {
  readonly ngControl = inject(NgControl);
  private readonly formService = inject(FormService);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  @Input() hint: string;
  @Input() label: string;
  @Input() widthClass: GovukTextWidthClass;
  currentValue: string;
  onChange: (event: Event) => any;
  onBlur: () => any;
  @ContentChild(ConditionalContentDirective) private readonly conditional: ConditionalContentDirective;

  constructor() {
    const ngControl = this.ngControl;

    ngControl.valueAccessor = this;
  }

  get control(): UntypedFormControl {
    return this.ngControl.control as UntypedFormControl;
  }

  get identifier(): string {
    return this.formService.getControlIdentifier(this.ngControl);
  }

  get conditionalId() {
    return `${this.identifier}-conditional`;
  }

  ngAfterContentInit(): void {
    this.toggleChildControls();
  }

  registerOnChange(onChange: (value: string) => any): void {
    this.onChange = (event: Event) => {
      this.currentValue = (event.target as HTMLInputElement).value;
      this.toggleChildControls();
      onChange(this.currentValue);
    };
  }

  registerOnTouched(onBlur: () => any): void {
    this.onBlur = onBlur;
  }

  writeValue(value: string): void {
    this.currentValue = value;
    this.toggleChildControls();
    this.changeDetectorRef.markForCheck();
  }

  private toggleChildControls(): void {
    if (this.conditional) {
      if (this.currentValue === 'OTHER') {
        this.conditional.enableControls();
      } else {
        this.conditional.disableControls();
      }
    }
  }
}
