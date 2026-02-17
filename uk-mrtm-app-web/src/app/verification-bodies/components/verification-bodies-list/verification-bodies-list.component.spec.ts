import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { VerificationBodiesListComponent } from '@verification-bodies/components';

describe('VerificationBodiesListComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  @Component({
    imports: [ReactiveFormsModule, VerificationBodiesListComponent],
    standalone: true,
    template: `
      <form [formGroup]="formGroup">
        <mrtm-verification-bodies-list></mrtm-verification-bodies-list>
      </form>
    `,
    schemas: [NO_ERRORS_SCHEMA],
  })
  class TestComponent {
    formGroup = new FormGroup<Record<string, FormControl | FormArray>>({
      verificationBodies: new FormArray([]),
    });
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
