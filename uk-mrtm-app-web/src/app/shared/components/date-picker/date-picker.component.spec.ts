import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { GovukValidators } from '@netz/govuk-components';

import { datePickerConfigDefaults } from '@shared/components/date-picker//date-picker.interface';
import { DatePickerComponent } from '@shared/components/date-picker/date-picker.component';

describe('DatePickerComponent', () => {
  @Component({
    standalone: true,
    imports: [DatePickerComponent, ReactiveFormsModule],
    template: '<div mrtm-date-picker [formControl]="control" [datePickerConfig]="DatePickerConfigDefaults"></div>',
  })
  class TestComponent {
    control = new FormControl();
    protected readonly DatePickerConfigDefaults = datePickerConfigDefaults;
  }

  let component: DatePickerComponent;
  let hostComponent: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(TestComponent);
    hostComponent = fixture.componentInstance;
    element = fixture.nativeElement;
    component = fixture.debugElement.query(By.directive(DatePickerComponent)).componentInstance;
    fixture.detectChanges();
  });

  it('should create', async () => {
    expect(component).toBeTruthy();
  });

  it('should disable the date-picker input and the date-picker toggle button', async () => {
    hostComponent.control.disable();
    fixture.detectChanges();

    const inputElement = element.querySelector<HTMLInputElement>('input');
    expect(inputElement.disabled).toBeTruthy();

    const datepickerToggleButtonElement = element.querySelector<HTMLButtonElement>('.moj-datepicker__toggle');
    expect(datepickerToggleButtonElement.disabled).toBeTruthy();
  });

  it('should assign value', async () => {
    const stringValue = '2024-01-01T00:00:00.000Z';
    hostComponent.control.patchValue(stringValue);
    fixture.detectChanges();

    const inputElement = element.querySelector<HTMLInputElement>('input');
    expect(hostComponent.control.valid).toBeTruthy();
    expect(inputElement.value).toEqual(stringValue);
  });

  it('should apply validators', () => {
    hostComponent.control.clearValidators();
    hostComponent.control.setValidators(GovukValidators.required('Date is required'));
    hostComponent.control.updateValueAndValidity();
    fixture.detectChanges();

    expect(element.querySelector('.govuk-error-message').textContent.trim()).toEqual('Error: Date is required');
    expect(element.querySelector('.govuk-character-count__message.govuk-error-message')).toBeNull();
  });

  it('should display labelSize classes', () => {
    const hostElement: HTMLElement = fixture.nativeElement;
    const label = hostElement.querySelector('label');

    component.isLabelHidden = false;
    fixture.detectChanges();

    expect(label.className).toEqual('govuk-label');

    component.labelSize = 'normal';
    fixture.detectChanges();

    expect(label.className).toEqual('govuk-label');

    component.labelSize = 'small';
    fixture.detectChanges();

    expect(label.className).toEqual('govuk-label govuk-label--s');

    component.labelSize = 'medium';
    fixture.detectChanges();

    expect(label.className).toEqual('govuk-label govuk-label--m');

    component.labelSize = 'large';
    fixture.detectChanges();

    expect(label.className).toEqual('govuk-label govuk-label--l');
  });
});
