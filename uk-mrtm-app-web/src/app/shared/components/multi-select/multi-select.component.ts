import { AsyncPipe } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  forwardRef,
  HostBinding,
  HostListener,
  inject,
  Input,
  OnInit,
  QueryList,
} from '@angular/core';
import { ControlValueAccessor, FormGroupDirective, NgControl, NgForm, UntypedFormControl } from '@angular/forms';

import { BehaviorSubject, Subject } from 'rxjs';

import { DestroySubject } from '@netz/common/services';
import { FormService, GovukComponentsModule } from '@netz/govuk-components';

import { MultiSelectItemComponent } from '@shared/components';
import { DOCUMENT_EVENT } from '@shared/services';
import { filter, skip, startWith, takeUntil, tap, withLatestFrom } from 'rxjs/operators';

/*
  eslint-disable
  @typescript-eslint/no-unused-vars,
  @typescript-eslint/no-empty-function,
  @angular-eslint/prefer-on-push-component-change-detection
*/
@Component({
  selector: 'div[mrtm-multi-select]',
  standalone: true,
  templateUrl: './multi-select.component.html',
  styleUrl: './multi-select.component.scss',
  providers: [DestroySubject],
  imports: [GovukComponentsModule, AsyncPipe],
})
export class MultiSelectComponent implements ControlValueAccessor, OnInit, AfterContentInit {
  readonly documentEvent = inject<Subject<FocusEvent | PointerEvent>>(DOCUMENT_EVENT);
  private readonly ngControl = inject(NgControl);
  private readonly formService = inject(FormService);
  private readonly destroy$ = inject(DestroySubject);
  private readonly elRef = inject(ElementRef);
  private readonly cdRef = inject(ChangeDetectorRef);
  private readonly root = inject(FormGroupDirective, { optional: true })!;
  private readonly rootNgForm = inject(NgForm, { optional: true })!;

  @HostBinding('class.govuk-!-display-block') readonly govukDisplayBlock = true;
  @HostBinding('class.govuk-form-group') readonly govukFormGroupClass = true;
  @HostBinding('class.govuk-form-group--error')
  get govukFormGroupErrorClass(): boolean {
    return this.shouldDisplayErrors;
  }

  @Input() label: string;
  @Input() hint: string;
  @Input() showErrors: boolean;

  @ContentChildren(forwardRef(() => MultiSelectItemComponent), { descendants: true })
  options: QueryList<MultiSelectItemComponent>;

  isOpen = new BehaviorSubject<boolean>(false);
  isDisabled: boolean;
  itemMap: { [key: string]: string };
  hasBeenTouched = false;
  currentValue = [];
  private onBlur: () => any;
  private onChange: (value: any) => void;

  get shouldDisplayErrors(): boolean {
    return this.control?.invalid && (!this.form || this.form.submitted || this.showErrors);
  }

  private get form(): FormGroupDirective | NgForm | null {
    return this.root ?? this.rootNgForm;
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.code === 'Escape' && this.isOpen.getValue()) {
      this.isOpen.next(false);
    }
  }

  constructor() {
    const ngControl = this.ngControl;

    ngControl.valueAccessor = this;
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

  ngAfterContentInit(): void {
    this.options.changes
      .pipe(
        takeUntil(this.destroy$),
        startWith(this.options),
        tap((options: QueryList<MultiSelectItemComponent>) => {
          this.itemMap = options.reduce((result, option) => ({ ...result, [option.itemValue]: option.label }), {});
          options.forEach((option, index) => {
            option.groupIdentifier = this.identifier;
            option.index = index;
            option.registerOnChange(() => {
              this.currentValue = options.filter((opt) => opt.isChecked).map((opt) => opt.itemValue);
              this.onChange(this.currentValue);
            });
            option.registerOnTouched(() => this.onBlur());
            option.cdRef.markForCheck();
          });

          this.writeValue(this.control.value);
          this.setDisabledState(this.control.disabled);
        }),
      )
      .subscribe();
  }

  writeValue(value: any): void {
    this.currentValue = value;
    if (this.options) {
      this.options.forEach((option) => option.writeValue(value?.includes(option.itemValue) ?? false));
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
    if (this.options) {
      this.options.forEach((option) => option.setDisabledState(isDisabled));
    }
  }
}
