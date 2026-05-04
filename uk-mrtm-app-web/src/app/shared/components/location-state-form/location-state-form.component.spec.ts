import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { MrtmAccountUpdateDTO } from '@mrtm/api';

import { LocationStateFormComponent } from '@shared/components';

describe('LocationStateFormComponent', () => {
  let component: LocationStateFormComponent;
  let fixture: ComponentFixture<TestComponent>;

  @Component({
    imports: [LocationStateFormComponent, ReactiveFormsModule],
    standalone: true,
    template: `
      <form [formGroup]="form"><mrtm-location-state-form legendLabel="Test legend" /></form>
    `,
  })
  class TestComponent {
    form = new FormGroup({
      line1: new FormControl<MrtmAccountUpdateDTO['line1'] | null>(null),
      line2: new FormControl<MrtmAccountUpdateDTO['line2'] | null>(null),
      city: new FormControl<MrtmAccountUpdateDTO['city'] | null>(null),
      state: new FormControl<MrtmAccountUpdateDTO['state'] | null>(null),
      postcode: new FormControl<MrtmAccountUpdateDTO['postcode'] | null>(null),
      country: new FormControl<MrtmAccountUpdateDTO['country'] | null>(null),
    });
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.debugElement.query(By.directive(LocationStateFormComponent)).componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
