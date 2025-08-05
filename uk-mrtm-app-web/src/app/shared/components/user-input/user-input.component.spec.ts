import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { BasePage } from '@netz/common/testing';
import { GovukComponentsModule, GovukValidators } from '@netz/govuk-components';

import { PhoneInputComponent, UserInputComponent } from '@shared/components';
import { phoneInputValidators } from '@shared/validators';

describe('UserInputComponent', () => {
  let component: UserInputComponent;
  let fixture: ComponentFixture<TestComponent>;
  let page: Page;

  class Page extends BasePage<TestComponent> {
    get nationalForm() {
      return this.query<HTMLFormElement>('form[id="national-group"]');
    }

    get nationalFirstName() {
      return this.nationalForm.querySelector<HTMLInputElement>('#firstName');
    }

    get nationalLastName() {
      return this.nationalForm.querySelector<HTMLInputElement>('#lastName');
    }

    get nationalJobTitle() {
      return this.nationalForm.querySelector<HTMLInputElement>('#jobTitle');
    }

    get nationalPhoneNumber() {
      return this.nationalForm.querySelector<HTMLInputElement>('#phoneNumber');
    }

    get nationalEmail() {
      return this.nationalForm.querySelector<HTMLInputElement>('#email');
    }

    get fullForm() {
      return this.query<HTMLFormElement>('form[id="full-group-name"]');
    }

    get fullFirstName() {
      return this.fullForm.querySelector<HTMLInputElement>(this.sanitizeSelector('#user.firstName'));
    }

    get fullLastName() {
      return this.fullForm.querySelector<HTMLInputElement>(this.sanitizeSelector('#user.lastName'));
    }
    get fullJobTitle() {
      return this.fullForm.querySelector<HTMLInputElement>(this.sanitizeSelector('#user.jobTitle'));
    }
    get fullPhoneNumberCode() {
      return this.fullForm.querySelector<HTMLSelectElement>(this.sanitizeSelector('#user.phoneNumber.countryCode'));
    }

    get fullPhoneNumber() {
      return this.fullForm.querySelector<HTMLInputElement>(this.sanitizeSelector('#user.phoneNumber'));
    }

    get fullMobileNumberCode() {
      return this.fullForm.querySelector<HTMLSelectElement>(this.sanitizeSelector('#user.mobileNumber.countryCode'));
    }

    get fullMobileNumber() {
      return this.fullForm.querySelector<HTMLInputElement>(this.sanitizeSelector('#user.mobileNumber'));
    }

    get fullEmail() {
      return this.fullForm.querySelector<HTMLInputElement>(this.sanitizeSelector('#user.email'));
    }
  }

  @Component({
    template: `
      <form id="national-group" [formGroup]="nationalForm">
        <mrtm-user-input phoneType="national"></mrtm-user-input>
      </form>

      <form id="full-group-name" [formGroup]="fullForm">
        <mrtm-user-input formGroupName="user" phoneType="full"></mrtm-user-input>
      </form>
    `,
  })
  class TestComponent {
    nationalForm = new FormGroup({
      firstName: new FormControl('Jake', {
        validators: [
          GovukValidators.required('Enter your first name'),
          GovukValidators.maxLength(255, 'Your first name should not be larger than 255 characters'),
        ],
      }),
      lastName: new FormControl('Peralta', {
        validators: [
          GovukValidators.required('Enter your last name'),
          GovukValidators.maxLength(255, 'Your last name should not be larger than 255 characters'),
        ],
      }),
      jobTitle: new FormControl('Job', {
        validators: [
          GovukValidators.required('Enter your job title'),
          GovukValidators.maxLength(255, 'Your job title should not be larger than 255 characters'),
        ],
      }),
      phoneNumber: new FormControl('6691423232', {
        validators: [
          GovukValidators.required('Enter the telephone number of the user'),
          GovukValidators.maxLength(255, 'The telephone number should not be larger than 255 characters'),
        ],
      }),
      mobileNumber: new FormControl('6973304343'),
      email: new FormControl('jake.peralta@netz.uk'),
    });
    fullForm = new FormGroup({
      user: new FormGroup({
        firstName: new FormControl(null, {
          validators: [
            GovukValidators.required('Enter your first name'),
            GovukValidators.maxLength(255, 'Your first name should not be larger than 255 characters'),
          ],
        }),
        lastName: new FormControl(null, {
          validators: [
            GovukValidators.required('Enter your last name'),
            GovukValidators.maxLength(255, 'Your last name should not be larger than 255 characters'),
          ],
        }),
        jobTitle: new FormControl(null, {
          validators: [
            GovukValidators.required('Enter your job title'),
            GovukValidators.maxLength(255, 'Your job title should not be larger than 255 characters'),
          ],
        }),
        phoneNumber: new FormControl(
          { value: <any>{ countryCode: '44', number: null } },
          { validators: [GovukValidators.empty('Enter your phone number'), ...phoneInputValidators] },
        ),
        mobileNumber: new FormControl(null, { validators: phoneInputValidators }),
        email: new FormControl(null),
      }),
    });
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukComponentsModule, ReactiveFormsModule, PhoneInputComponent, UserInputComponent],
      declarations: [TestComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.debugElement.query(By.directive(UserInputComponent)).componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should populate the form', () => {
    expect(page.nationalFirstName.value).toEqual('Jake');
    expect(page.nationalLastName.value).toEqual('Peralta');
    expect(page.nationalLastName.value).toEqual('Peralta');
    expect(page.nationalPhoneNumber.value).toEqual('6691423232');
    expect(page.nationalJobTitle.value).toEqual('Job');
    expect(page.nationalEmail.value).toEqual('jake.peralta@netz.uk');

    expect(page.fullFirstName.value).toBe('');
    expect(page.fullLastName.value).toBe('');
    expect(page.fullJobTitle.value).toBe('');
    expect(page.fullPhoneNumberCode.value).toBe('');
    expect(page.fullPhoneNumber.value).toBe('');
    expect(page.fullMobileNumberCode.value).toBe('');
    expect(page.fullMobileNumber.value).toBe('');
    expect(page.fullEmail.value).toBe('');
  });
});
