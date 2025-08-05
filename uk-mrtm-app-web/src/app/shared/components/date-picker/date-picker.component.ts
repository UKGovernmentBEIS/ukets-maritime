import { formatDate, NgClass, SlicePipe } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  contentChild,
  ElementRef,
  HostListener,
  inject,
  Input,
  input,
  OnInit,
  Renderer2,
  viewChild,
} from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  ControlValueAccessor,
  NgControl,
  ReactiveFormsModule,
  ValidatorFn,
} from '@angular/forms';

import { distinctUntilChanged, takeUntil, tap } from 'rxjs';

import {
  ErrorMessageComponent,
  FormInput,
  FormService,
  GovukTextWidthClass,
  GovukValidators,
  LabelDirective,
  LabelSizeType,
} from '@netz/govuk-components';

import {
  CalendarDate,
  DatePickerConfig,
  datePickerConfigDefaults,
} from '@shared/components/date-picker/date-picker.interface';
import { DatePickerService } from '@shared/components/date-picker/date-picker.service';
import { DatePickerButtonComponent } from '@shared/components/date-picker/date-picker-button/date-picker-button.component';
import { DatePickerChunkPipe } from '@shared/components/date-picker/pipes/date-picker-chunk.pipe';

/*
  eslint-disable
  @angular-eslint/component-selector,
  @angular-eslint/prefer-on-push-component-change-detection
 */
@Component({
  selector: 'div[mrtm-date-picker]',
  standalone: true,
  imports: [
    ErrorMessageComponent,
    NgClass,
    SlicePipe,
    DatePickerChunkPipe,
    DatePickerButtonComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.scss',
  providers: [DatePickerService],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class DatePickerComponent extends FormInput implements ControlValueAccessor, OnInit, AfterViewInit {
  public readonly datePickerService = inject(DatePickerService);
  private readonly renderer = inject(Renderer2);
  protected readonly elementRef = inject(ElementRef);

  currentLabel = 'Insert date';
  currentLabelSize = 'govuk-label';
  isLabelHidden = true;
  disabled: boolean;
  titleId: string;
  private readonly INVALID_DATE = 'INVALID_DATE';
  private dateFormat = 'dd/MM/yyyy';

  readonly hint = input<string>();
  readonly widthClass = input<GovukTextWidthClass>('govuk-!-width-full');
  readonly datePickerConfig = input<DatePickerConfig>(datePickerConfigDefaults);
  readonly templateLabel = contentChild(LabelDirective);
  readonly input = viewChild<ElementRef<HTMLInputElement>>('input');
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
  @HostListener('document:click', ['$event'])
  onBackgroundClick(event: Event) {
    this.datePickerService.onBackgroundClick(event);
  }
  onChange: (dateHuman: string) => any;
  onTouched: () => any;

  constructor() {
    const ngControl = inject(NgControl, { self: true, optional: true })!;
    const formService = inject(FormService);
    const container = inject(ControlContainer, { optional: true })!;

    super(ngControl, formService, container);
  }

  override ngOnInit(): void {
    super.ngOnInit();
  }

  ngAfterViewInit(): void {
    this.dateFormat = this.datePickerConfig()?.leadingZeros ? 'dd/MM/yyyy' : 'd/M/yyyy';
    this.titleId = `datepicker-title-${this.identifier}`;
    this.datePickerService.init(this.datePickerConfig(), this.elementRef);
    this.datePickerService.updateCalendar();
    this.initValidators();
    this.writeValue(this.control.value);
    this.control.valueChanges
      .pipe(
        distinctUntilChanged((prev, curr) => prev === curr),
        tap((value) => {
          this.control.setValue(value, {
            emitEvent: false,
            emitViewToModelChange: false,
            emitModelToViewChange: false,
          });
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  initValidators() {
    this.control.addValidators(GovukValidators.builder('Enter a valid date', this.initialValidator()));

    if (this.datePickerConfig()?.minDate) {
      this.control.addValidators(
        GovukValidators.builder(
          `This date must be the same as or after ${this.datePickerConfig().minDate}`,
          this.minDateValidator(this.parseHumanDate(this.datePickerConfig()?.minDate)),
        ),
      );
    }

    if (this.datePickerConfig()?.maxDate) {
      this.control.addValidators(
        GovukValidators.builder(
          `This date must be the same as or before ${this.datePickerConfig().maxDate}`,
          this.maxDateValidator(this.parseHumanDate(this.datePickerConfig()?.maxDate)),
        ),
      );
    }

    if (this.datePickerConfig()?.excludedDays || this.datePickerConfig()?.excludedDates) {
      this.control.addValidators(GovukValidators.builder(`This date cannot be selected`, this.excludedDateValidator()));
    }

    this.control.updateValueAndValidity();
  }

  writeValue(value: Date | null): void {
    if (value && this.input()) {
      this.renderer.setProperty(this.input().nativeElement, 'value', this.convertDateToHumanDate(value));
      this.datePickerService.inputDate.set(value);
    }
  }

  registerOnChange(fn: (_: any) => void): void {
    this.onChange = (dateHuman: string) => {
      const convertedDate = this.convertHumanDateToDate(dateHuman);
      fn(convertedDate);
      const inputValue = convertedDate && convertedDate !== this.INVALID_DATE ? new Date(convertedDate) : null;
      this.datePickerService.inputDate.set(inputValue);
    };
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  getInputValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  private initialValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      return control.value === this.INVALID_DATE ? { invalidDate: true } : null;
    };
  }

  private minDateValidator(min: Date): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      return control.value !== null && control.value !== this.INVALID_DATE && control.value < min
        ? { minDate: true }
        : null;
    };
  }

  private maxDateValidator(max: Date): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      return control.value !== null && control.value !== this.INVALID_DATE && control.value > max
        ? { maxDate: true }
        : null;
    };
  }

  private excludedDateValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      return control.value !== null && control.value !== this.INVALID_DATE && this.isExcluded(this.control.value)
        ? { excludedDate: true }
        : null;
    };
  }

  private isExcluded(date: Date) {
    if (date instanceof Date) {
      if (this.datePickerService.excludedDates()) {
        for (const excludedDate of this.datePickerService.excludedDates()) {
          if (date.toDateString() === excludedDate.toDateString()) {
            return true;
          }
        }
      }

      return this.datePickerService.excludedDays()
        ? this.datePickerService.excludedDays().includes(date.getDay())
        : false;
    }

    return false;
  }

  onSelectDate(calendarDate: CalendarDate, event: Event) {
    if (calendarDate.isDisabled) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    this.writeValue(calendarDate.date);
    this.onChange(this.convertDateToHumanDate(calendarDate.date.toISOString()));
    this.datePickerService.selectDate(calendarDate);
  }

  /**
   * Select current date but if none is selected choose the first tabbable
   */
  onOkButtonClick(event: Event) {
    let currentDate = this.datePickerService.calendarDates().find((calendarDate) => calendarDate.isSelected);
    if (!currentDate) {
      currentDate = this.datePickerService.calendarDates().find((calendarDate) => calendarDate.isTabbable);
    }
    this.onSelectDate(currentDate, event);
  }

  onCancelButtonClick(event: Event) {
    this.datePickerService.toggleDialog(event);
  }

  onHandleEscape(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.datePickerService.closeDialog();
      event.preventDefault();
      event.stopPropagation();
    }
  }

  private convertHumanDateToDate(dateString?: string): Date | string | null {
    dateString = dateString?.trim();

    if (!dateString) {
      return null;
    }

    return this.isValidHumanDate(dateString) ? this.parseHumanDate(dateString) : this.INVALID_DATE;
  }

  private isValidHumanDate(dateString?: string): boolean {
    const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
    if (!dateRegex.test(dateString)) {
      return false;
    }
    const [day, month, year] = dateString.split('/').map(Number);
    const date = this.parseHumanDate(dateString);

    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  }

  private parseHumanDate(dateString: string): Date {
    const [day, month, year] = dateString.split('/').map(Number);
    return new Date(Date.UTC(year, month - 1, day));
  }

  private convertDateToHumanDate(value: string | number | Date): string {
    return formatDate(value, this.dateFormat, 'en-GB');
  }
}
