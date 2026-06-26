import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { combineLatest, filter, takeUntil, tap } from 'rxjs';

import { DestroySubject } from '@netz/common/services';
import { GovukValidators } from '@netz/govuk-components';

import { UserRegistrationStore } from '@registration/store/user-registration.store';
import { UserInputComponent, WizardStepComponent } from '@shared/components';
import { phoneInputWithCountyCodeSelectValidators } from '@shared/validators';

@Component({
  selector: 'mrtm-contact-details',
  imports: [ReactiveFormsModule, UserInputComponent, WizardStepComponent],
  standalone: true,
  templateUrl: './contact-details.component.html',
  providers: [DestroySubject],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactDetailsComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(UserRegistrationStore);
  private readonly fb = inject(UntypedFormBuilder);
  private readonly destroy$ = inject(DestroySubject);

  protected readonly form: UntypedFormGroup = this.fb.group({
    firstName: [
      null,
      [
        GovukValidators.required('Enter your first name'),
        GovukValidators.maxLength(255, 'Your first name should not be larger than 255 characters'),
      ],
    ],
    lastName: [
      null,
      [
        GovukValidators.required('Enter your last name'),
        GovukValidators.maxLength(255, 'Your last name should not be larger than 255 characters'),
      ],
    ],
    phoneNumber: [
      { countryCode: '44', number: null },
      [GovukValidators.empty('Enter your phone number'), ...phoneInputWithCountyCodeSelectValidators],
    ],
    mobileNumber: [null, phoneInputWithCountyCodeSelectValidators],
    email: [{ value: null, disabled: true }],
  });

  ngOnInit(): void {
    combineLatest([this.store.select('userRegistrationDTO'), this.store.select('email')])
      .pipe(
        takeUntil(this.destroy$),
        tap(([, email]) => this.form.patchValue({ email })),
        filter(([user]) => !!user),
        tap(([user]) => this.form.patchValue({ ...user })),
      )
      .subscribe();
  }

  onSubmit(): void {
    const { ...model } = this.form.value;
    this.store.setState({ ...this.store.getState(), userRegistrationDTO: model });

    this.router.navigate(
      [
        this.store.getState().isSummarized ||
        this.store.getState().invitationStatus === 'PENDING_TO_REGISTERED_SET_REGISTER_FORM_NO_PASSWORD'
          ? '../summary'
          : '../choose-password',
      ],
      {
        relativeTo: this.route,
      },
    );
  }
}
