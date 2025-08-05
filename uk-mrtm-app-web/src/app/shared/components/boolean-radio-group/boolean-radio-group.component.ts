import { AsyncPipe } from '@angular/common';
import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  inject,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ControlContainer, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Observable, startWith, tap } from 'rxjs';

import { ConditionalContentDirective, RadioComponent, RadioOptionComponent } from '@netz/govuk-components';

import { existingControlContainer } from '@shared/providers';

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'mrtm-boolean-radio-group',
  templateUrl: './boolean-radio-group.component.html',
  providers: [existingControlContainer],
  viewProviders: [existingControlContainer],
  standalone: true,
  imports: [RadioComponent, FormsModule, ReactiveFormsModule, RadioOptionComponent, AsyncPipe],
})
export class BooleanRadioGroupComponent implements AfterContentInit, AfterViewInit, OnInit {
  private readonly controlContainer = inject(ControlContainer);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  @Input() controlName: string;
  @Input() legend: string;
  @Input() hint: string;
  @Input() isEditable = true;
  @Input() positiveValue: boolean | string = true;
  @Input() negativeValue: boolean | string = false;
  @Input() positiveLabel = 'Yes';
  @Input() negativeLabel = 'No';

  @ViewChild(RadioComponent, { read: ElementRef, static: true }) radio: ElementRef<HTMLElement>;
  value$: Observable<boolean>;

  private yesRadio: HTMLInputElement;
  @ContentChild(ConditionalContentDirective, { static: true })
  private readonly conditional: ConditionalContentDirective;

  get conditionalId() {
    return `${this.yesRadio?.id}-conditional`;
  }

  private get control() {
    return this.controlContainer.control.get(this.controlName);
  }

  ngOnInit(): void {
    this.value$ = this.control.valueChanges.pipe(
      startWith(this.control.value),
      tap((value) => this.onChoose(value)),
    );
  }

  ngAfterContentInit() {
    this.onChoose(this.control.value);
  }

  ngAfterViewInit(): void {
    this.yesRadio = this.radio.nativeElement.querySelector('input');
    this.yesRadio.setAttribute('aria-controls', this.conditionalId);
    this.setAriaExpanded(this.control.value);

    // Trigger a change detection to update the conditionalId
    this.changeDetectorRef.detectChanges();
  }

  private onChoose(value: boolean | string): void {
    const isPositiveSelected = value === this.positiveValue;
    this.setAriaExpanded(isPositiveSelected);

    if (this.conditional) {
      if (isPositiveSelected && this.isEditable) {
        this.conditional.enableControls();
      } else {
        this.conditional.disableControls();
      }
    }
  }

  private setAriaExpanded(value: boolean): void {
    if (this.yesRadio) {
      this.yesRadio.setAttribute('aria-expanded', value ? 'true' : 'false');
    }
  }
}
