import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  computed,
  contentChildren,
  effect,
  ElementRef,
  forwardRef,
  inject,
  input,
  OnInit,
  signal,
  untracked,
} from '@angular/core';
import { ControlValueAccessor, FormGroupDirective, NgControl, NgForm, UntypedFormControl } from '@angular/forms';

import { BehaviorSubject, Subject } from 'rxjs';

import { DestroySubject } from '@netz/common/services';
import { ErrorMessageComponent, FormService, LabelSizeType, SafeHtmlPipe } from '@netz/govuk-components';

import { MultiSelectItemComponent } from '@shared/components';
import { DOCUMENT_EVENT } from '@shared/services';
import { filter, skip, takeUntil, withLatestFrom } from 'rxjs/operators';

@Component({
  selector: 'div[mrtm-multi-select]',
  imports: [AsyncPipe, ErrorMessageComponent, SafeHtmlPipe],
  standalone: true,
  templateUrl: './multi-select.component.html',
  styleUrl: './multi-select.component.scss',
  providers: [DestroySubject],
  host: {
    '[class.govuk-!-display-block]': 'govukDisplayBlock',
    '[class.govuk-form-group]': 'govukFormGroupClass',
    '[class.govuk-form-group--error]': 'govukFormGroupErrorClass',
    '(keydown)': 'onKeyDown($event)',
  },
})
export class MultiSelectComponent implements ControlValueAccessor, OnInit {
  readonly documentEvent = inject<Subject<FocusEvent | PointerEvent>>(DOCUMENT_EVENT);
  private readonly ngControl = inject(NgControl);
  private readonly formService = inject(FormService);
  private readonly destroy$ = inject(DestroySubject);
  private readonly elRef = inject(ElementRef);
  private readonly cdRef = inject(ChangeDetectorRef);
  private readonly root = inject(FormGroupDirective, { optional: true })!;
  private readonly rootNgForm = inject(NgForm, { optional: true })!;

  readonly govukDisplayBlock = true;
  readonly govukFormGroupClass = true;

  get govukFormGroupErrorClass(): boolean {
    return this.shouldDisplayErrors;
  }

  readonly labelSize = input<LabelSizeType>('normal');
  readonly label = input<string>();
  readonly hint = input<string>();
  readonly showErrors = input<boolean>();

  readonly options = contentChildren(
    forwardRef(() => MultiSelectItemComponent),
    { descendants: true },
  );

  readonly currentLabelSize = computed(() => {
    switch (this.labelSize()) {
      case 'small':
        return 'govuk-label govuk-label--s';
      case 'medium':
        return 'govuk-label govuk-label--m';
      case 'large':
        return 'govuk-label govuk-label--l';
      default:
        return 'govuk-label';
    }
  });

  readonly itemMap = computed(() =>
    this.options().reduce(
      (result, option) => ({ ...result, [option.itemValue()]: option.label() }),
      {} as { [key: string]: string },
    ),
  );

  isOpen = new BehaviorSubject<boolean>(false);
  isDisabled: boolean;
  hasBeenTouched = false;
  readonly currentValue = signal<any[]>([]);
  private onBlur: () => any;
  private onChange: (value: any) => void;

  get shouldDisplayErrors(): boolean {
    return this.control?.invalid && (!this.form || this.form.submitted || this.showErrors());
  }

  private get form(): FormGroupDirective | NgForm | null {
    return this.root ?? this.rootNgForm;
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.code === 'Escape' && this.isOpen.getValue()) {
      this.isOpen.next(false);
    }
  }

  constructor() {
    const ngControl = this.ngControl;

    ngControl.valueAccessor = this;

    effect(() => {
      const options = this.options();
      // Track the item values so the control value is written again once the item inputs are set
      options.forEach((option) => option.itemValue());

      options.forEach((option, index) => {
        option.groupIdentifier = this.identifier;
        option.index = index;

        option.registerOnChange(() => {
          this.currentValue.set(options.filter((opt) => opt.isChecked).map((opt) => opt.itemValue()));
          this.onChange(this.currentValue());
        });

        option.registerOnTouched(() => this.onBlur());
        option.cdRef.markForCheck();
      });

      // Prevent this write/disable from creating unwanted reactive coupling
      untracked(() => {
        this.writeValue(this.control.value);
        this.setDisabledState(this.control.disabled);
      });
    });
  }

  ngOnInit(): void {
    this.documentEvent
      .pipe(
        takeUntil(this.destroy$),
        withLatestFrom(this.isOpen),
        filter(([event]) => event.type === 'focusin' || event.type === 'click'),
      )
      .subscribe(([event, isOpen]) => {
        if (!this.elRef.nativeElement.contains(event.target)) {
          if (isOpen) {
            this.isOpen.next(false);
          }
          if (this.hasBeenTouched && !this.control.touched) {
            this.control.markAsTouched();
            this.cdRef.markForCheck();
          }
        } else {
          this.hasBeenTouched = true;
        }
      });
    // Submit and validity changes do not touch this view, so without these the error
    // message would not be rendered until something else marks the view as dirty
    this.form?.ngSubmit.pipe(takeUntil(this.destroy$)).subscribe(() => this.cdRef.markForCheck());
    this.control?.statusChanges.pipe(takeUntil(this.destroy$)).subscribe(() => this.cdRef.markForCheck());

    this.isOpen.pipe(takeUntil(this.destroy$), skip(1)).subscribe((res) => {
      if (!res) {
        this.onBlur();
      }
    });
  }

  get identifier(): string {
    return this.formService.getControlIdentifier(this.ngControl);
  }

  get control(): UntypedFormControl {
    return this.ngControl.control as UntypedFormControl;
  }

  click(): void {
    this.isOpen.next(!this.isOpen.getValue());
  }

  writeValue(value: any): void {
    this.currentValue.set(value ?? []);
    const options = this.options();
    if (options) {
      options.forEach((option) => option.writeValue(value?.includes(option.itemValue()) ?? false));
    }
  }

  registerOnChange(fn: (value: any) => void) {
    this.onChange = fn;
  }

  registerOnTouched(onBlur: () => any): void {
    this.onBlur = onBlur;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
    const options = this.options();
    if (options) {
      options.forEach((option) => option.setDisabledState(isDisabled));
    }
  }
}
