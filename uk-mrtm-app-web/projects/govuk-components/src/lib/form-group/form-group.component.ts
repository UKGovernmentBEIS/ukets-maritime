/* eslint-disable @angular-eslint/prefer-on-push-component-change-detection */
/* eslint-disable @angular-eslint/component-selector */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, DestroyRef, HostBinding, inject, input, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlContainer, FormGroupDirective, NgForm, UntypedFormGroup } from '@angular/forms';

import { ErrorMessageComponent } from '../error-message';
import { FieldsetDirective, LegendDirective, LegendSizeType } from '../fieldset';

@Component({
  selector: 'div[govuk-form-group]',
  standalone: true,
  imports: [ErrorMessageComponent, FieldsetDirective, LegendDirective],
  templateUrl: './form-group.component.html',
})
export class FormGroupComponent implements OnInit {
  private readonly container = inject(ControlContainer, { self: true, optional: true });
  private readonly destroyRef = inject(DestroyRef);
  private isSubmitted = false;

  readonly legend = input<string>();
  readonly legendSize = input<LegendSizeType>('medium');

  @HostBinding('class.govuk-!-display-block') readonly govukDisplayBlock = true;
  @HostBinding('class.govuk-form-group') readonly govukFormGroupClass = true;
  @HostBinding('class.govuk-form-group--error') get govukFormGroupErrorClass(): boolean {
    return this.shouldDisplayErrors;
  }

  constructor() {
    if (!this.container) {
      console.error('###FormGroupComponent### :: Could not find ControlContainer');
    }
  }

  get identifier(): string {
    return this.container?.path?.join('.') ?? '';
  }

  get group(): UntypedFormGroup {
    return this.container?.control as UntypedFormGroup;
  }

  get shouldDisplayErrors(): boolean {
    return this.group?.invalid && (!this.form || this.isSubmitted);
  }

  private get form(): FormGroupDirective | NgForm | null {
    return this.container &&
      (this.container.formDirective instanceof FormGroupDirective || this.container.formDirective instanceof NgForm)
      ? this.container.formDirective
      : null;
  }

  ngOnInit(): void {
    this.form?.ngSubmit.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => (this.isSubmitted = true));
  }
}
