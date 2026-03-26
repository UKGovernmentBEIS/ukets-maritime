import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlContainer, FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { TimeInputComponent } from '@shared/components';

describe('TimeInputComponent', () => {
  @Component({
    imports: [TimeInputComponent, ReactiveFormsModule],
    standalone: true,
    template: '<div mrtm-time-input [formControl]="control" label="test" hint="test"></div>',
  })
  class TestComponent {
    control = new FormControl();
  }

  let component: TimeInputComponent;
  let fixture: ComponentFixture<TestComponent>;
  let hostComponent: TestComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [ControlContainer],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    hostComponent = fixture.componentInstance;
    component = fixture.debugElement.query(By.directive(TimeInputComponent)).componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should hydrate form with a date', () => {
    hostComponent.control.patchValue(new Date('2024-05-29T15:30:45.000Z'));
    fixture.detectChanges();

    const hostElement: HTMLElement = fixture.nativeElement;
    const inputs = hostElement.querySelectorAll<HTMLInputElement>('input');

    expect(Array.from(inputs).map((input) => input.value)).toEqual(['15', '30', '45']);
  });
});
