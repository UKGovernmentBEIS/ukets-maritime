import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, input } from '@angular/core';
import { ControlValueAccessor, NgControl, UntypedFormControl } from '@angular/forms';

@Component({
  selector: 'div[mrtm-multi-select-item]',
  standalone: true,
  template: `
    <input
      type="checkbox"
      class="govuk-checkboxes__input"
      [attr.value]="itemValue()"
      [id]="id"
      [name]="groupIdentifier"
      [checked]="isChecked"
      [disabled]="isDisabled"
      (change)="onChange($event)"
      (blur)="onBlur()" />
    <label class="govuk-label govuk-checkboxes__label" [for]="id">{{ label() }}</label>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.govuk-checkboxes__item]': 'govukCheckboxesItem' },
})
export class MultiSelectItemComponent implements ControlValueAccessor {
  readonly cdRef = inject(ChangeDetectorRef);
  private readonly ngControl = inject(NgControl);

  readonly label = input<string>();
  readonly itemValue = input<string>();

  readonly govukCheckboxesItem = true;

  isChecked: boolean;
  index: number;
  isDisabled: boolean;
  groupIdentifier: string;

  onBlur: () => any;
  onChange: (event: Event) => any;

  get control(): UntypedFormControl {
    return this.ngControl.control as UntypedFormControl;
  }

  get id() {
    return `${this.groupIdentifier}-${this.index}`;
  }

  registerOnChange(onChange: () => any): void {
    this.onChange = (event) => {
      this.writeValue((event.target as HTMLInputElement).checked);
      onChange();
    };
  }

  registerOnTouched(fn: any): void {
    this.onBlur = fn;
  }

  writeValue(value: boolean): void {
    this.isChecked = value;
    this.cdRef.markForCheck();
  }

  setDisabledState(isDisabled: boolean) {
    this.isDisabled = isDisabled;
    this.cdRef.markForCheck();
  }
}
