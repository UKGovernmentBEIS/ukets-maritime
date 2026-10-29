import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

import { ErrorMessageComponent, MessageValidationErrors } from '@netz/govuk-components';

import {
  FeedbackOption,
  FeedbackReviewGroup,
  NO_FEEDBACK_REVIEW_GROUP,
} from '@feedback/request-feedback/request-feedback.config';

@Component({
  selector: 'mrtm-feedback-review-groups',
  imports: [ErrorMessageComponent],
  standalone: true,
  templateUrl: './feedback-review-groups.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedbackReviewGroupsComponent implements ControlValueAccessor {
  private readonly ngControl = inject(NgControl, { self: true });

  readonly legend = input.required<string>();
  readonly hint = input<string>();
  readonly options = input.required<FeedbackOption<FeedbackReviewGroup>[]>();
  readonly showErrors = input(false);

  readonly noFeedbackReviewGroup = NO_FEEDBACK_REVIEW_GROUP;
  readonly selected = signal<FeedbackReviewGroup[]>([]);
  readonly isDisabled = signal(false);

  private onChange: (value: FeedbackReviewGroup[]) => void = () => {};
  onTouched: () => void = () => {};

  constructor() {
    this.ngControl.valueAccessor = this;
  }

  get identifier(): string {
    return String(this.ngControl.name);
  }

  get errors(): MessageValidationErrors {
    return this.ngControl.control?.errors as MessageValidationErrors;
  }

  get hasErrors(): boolean {
    return this.showErrors() && !!this.ngControl.control?.invalid;
  }

  onToggle(value: FeedbackReviewGroup, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    const current = this.selected();

    const next = !isChecked
      ? current.filter((group) => group !== value)
      : value === NO_FEEDBACK_REVIEW_GROUP
        ? [NO_FEEDBACK_REVIEW_GROUP]
        : [...current.filter((group) => group !== NO_FEEDBACK_REVIEW_GROUP), value];

    const ordered = this.options()
      .map((option) => option.value)
      .filter((group) => next.includes(group));

    this.selected.set(ordered);
    this.onChange(ordered);
  }

  writeValue(value: FeedbackReviewGroup[] | null): void {
    this.selected.set(value ?? []);
  }

  registerOnChange(onChange: (value: FeedbackReviewGroup[]) => void): void {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: () => void): void {
    this.onTouched = onTouched;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }
}
