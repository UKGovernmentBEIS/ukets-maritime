import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, ElementRef, inject, input } from '@angular/core';

import { CalendarDate } from '@shared/components/date-picker/date-picker.interface';

@Component({
  selector: 'mrtm-date-picker-button',
  standalone: true,
  imports: [DatePipe],
  template: `
    <button
      class="moj-datepicker__button moj-datepicker__calendar-day"
      type="button"
      [style]="calendarDate().isHidden ? 'display: none' : 'display: block'"
      [tabIndex]="calendarDate().isTabbable ? 0 : -1"
      [class.moj-datepicker__button--current]="calendarDate().isCurrent"
      [class.moj-datepicker__button--selected]="calendarDate().isSelected"
      [class.moj-datepicker__button--today]="calendarDate().isToday"
      [attr.aria-disabled]="calendarDate().isDisabled">
      <span class="govuk-visually-hidden">
        {{ calendarDate().date | date: 'EEEE d MMMM y' }}
      </span>
      <span aria-hidden="true">
        {{ calendarDate().date | date: 'd' }}
      </span>
    </button>
  `,
  styleUrl: `./date-picker-button.component.scss`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatePickerButtonComponent {
  private elementRef: ElementRef<HTMLButtonElement> = inject(ElementRef);

  calendarDate = input.required<CalendarDate>();

  constructor() {
    effect(() => {
      if (this.calendarDate().isSelected) {
        this.elementRef.nativeElement.querySelector('button').focus();
      }
    });
  }
}
