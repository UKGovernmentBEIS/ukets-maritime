import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { VerificationBodyCreationDTO } from '@mrtm/api';

import { BasePage } from '@netz/common/testing';

import { VerificationBodyFormComponent } from '@verification-bodies/components';

describe('VerificationBodyFormComponent', () => {
  let component: TestComponent;
  let page: Page;
  let fixture: ComponentFixture<TestComponent>;

  class Page extends BasePage<TestComponent> {
    get allInputs() {
      return this.queryAll<HTMLInputElement>('input').map((el) => el.name);
    }
  }

  @Component({
    imports: [ReactiveFormsModule, VerificationBodyFormComponent],
    standalone: true,
    template: `
      <form [formGroup]="formGroup">
        <mrtm-verification-body-form></mrtm-verification-body-form>
      </form>
    `,
    schemas: [NO_ERRORS_SCHEMA],
  })
  class TestComponent {
    formGroup = new FormGroup<Record<string, FormControl>>({
      name: new FormControl<VerificationBodyCreationDTO['name'] | null>(null),
      accreditationReferenceNumber: new FormControl<VerificationBodyCreationDTO['accreditationReferenceNumber'] | null>(
        null,
      ),
    });
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show all applicable inputs', () => {
    expect(page.allInputs).toHaveLength(2);
  });
});
