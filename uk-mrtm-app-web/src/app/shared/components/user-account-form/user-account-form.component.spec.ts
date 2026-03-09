import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { OperatorUserInvitationDTO } from '@mrtm/api';

import { BasePage } from '@netz/common/testing';

import { UserAccountFormComponent } from '@shared/components';

describe('UserAccountFormComponent', () => {
  class Page extends BasePage<TestComponent> {
    get allInputs() {
      return this.queryAll<HTMLInputElement>('input').map((el) => el.name);
    }
  }

  @Component({
    template: `
      <form [formGroup]="formGroup">
        <mrtm-user-account-form></mrtm-user-account-form>
      </form>
    `,
    standalone: true,
    schemas: [NO_ERRORS_SCHEMA],
    imports: [ReactiveFormsModule, UserAccountFormComponent],
  })
  class TestComponent {
    formGroup = new FormGroup<Record<keyof Omit<OperatorUserInvitationDTO, 'roleCode'>, FormControl>>({
      email: new FormControl<OperatorUserInvitationDTO['email'] | null>(null),
      firstName: new FormControl<OperatorUserInvitationDTO['firstName'] | null>(null),
      lastName: new FormControl<OperatorUserInvitationDTO['lastName'] | null>(null),
    });
  }

  let page: Page;
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show all applicable inputs', () => {
    expect(page.allInputs).toHaveLength(3);
  });
});
