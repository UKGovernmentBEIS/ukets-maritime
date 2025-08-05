import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarDate } from '@shared/components/date-picker/date-picker.interface';
import { DatePickerButtonComponent } from '@shared/components/date-picker/date-picker-button/date-picker-button.component';

describe('DatePickerButtonComponent', () => {
  let component: DatePickerButtonComponent;
  let componentRef: ComponentRef<DatePickerButtonComponent>;
  let fixture: ComponentFixture<DatePickerButtonComponent>;

  const mockDate1: CalendarDate = {
    date: new Date(2025, 0, 1),
    isHidden: false,
    isTabbable: false,
    isCurrent: false,
    isSelected: false,
    isToday: false,
    isDisabled: false,
  };

  const mockDate2: CalendarDate = {
    date: new Date(2025, 0, 1),
    isHidden: true,
    isTabbable: true,
    isCurrent: true,
    isSelected: true,
    isToday: true,
    isDisabled: true,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatePickerButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DatePickerButtonComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('calendarDate', mockDate1);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the date correctly when all properties are false', () => {
    const buttonElement: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    const spanElements = buttonElement.querySelectorAll('span');
    expect(spanElements[0].textContent?.trim()).toEqual('Wednesday 1 January 2025');
    expect(spanElements[1].textContent?.trim()).toEqual('1');
    expect(buttonElement.style.display).toEqual('block');
    expect(buttonElement.tabIndex).toEqual(-1);
    expect(buttonElement.classList).not.toContain('moj-datepicker__button--current');
    expect(buttonElement.classList).not.toContain('moj-datepicker__button--selected');
    expect(buttonElement.classList).not.toContain('moj-datepicker__button--today');
  });

  it('should display the date correctly when all properties are true', () => {
    componentRef.setInput('calendarDate', mockDate2);
    fixture.detectChanges();

    const buttonElement: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    const spanElements = buttonElement.querySelectorAll('span');
    expect(spanElements[0].textContent?.trim()).toEqual('Wednesday 1 January 2025');
    expect(spanElements[1].textContent?.trim()).toEqual('1');
    expect(buttonElement.style.display).toEqual('none');
    expect(buttonElement.tabIndex).toEqual(0);
    expect(buttonElement.classList).toContain('moj-datepicker__button--current');
    expect(buttonElement.classList).toContain('moj-datepicker__button--selected');
    expect(buttonElement.classList).toContain('moj-datepicker__button--today');
  });
});
