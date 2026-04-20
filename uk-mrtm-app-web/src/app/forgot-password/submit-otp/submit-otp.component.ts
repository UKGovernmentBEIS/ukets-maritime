import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { BehaviorSubject, combineLatest, EMPTY, first, switchMap } from 'rxjs';

import { ForgotPasswordService } from '@mrtm/api';

import { catchBadRequest, ErrorCodes } from '@netz/common/error';
import { ErrorSummaryComponent, GovukValidators, LinkDirective, TextInputComponent } from '@netz/govuk-components';

import { AuthService } from '@core/services/auth.service';
import { ResetPasswordStore } from '@forgot-password/store/reset-password.store';
import { BackToTopComponent, WizardStepComponent } from '@shared/components';

@Component({
  selector: 'mrtm-submit-otp',
  templateUrl: './submit-otp.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ErrorSummaryComponent,
    WizardStepComponent,
    FormsModule,
    ReactiveFormsModule,
    TextInputComponent,
    LinkDirective,
    RouterLink,
    BackToTopComponent,
    AsyncPipe,
  ],
})
export class SubmitOtpComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly forgotPasswordService = inject(ForgotPasswordService);
  private readonly fb = inject(UntypedFormBuilder);
  private readonly store = inject(ResetPasswordStore);

  isSummaryDisplayed$ = new BehaviorSubject<boolean>(false);
  email$ = this.store.select('email');
  isPasswordReset = false;

  form = this.fb.group({
    otp: [
      null,
      [
        GovukValidators.required('Enter the 6-digit code'),
        GovukValidators.pattern('[0-9]*', 'Digit code must contain numbers only'),
        GovukValidators.minLength(6, 'Digit code must contain exactly 6 characters'),
        GovukValidators.maxLength(6, 'Digit code must contain exactly 6 characters'),
      ],
    ],
  });

  onSubmit(): void {
    combineLatest([this.store.select('token'), this.store.select('password')])
      .pipe(
        first(),
        switchMap(([token, password]) =>
          this.forgotPasswordService.resetPassword({
            token: token,
            otp: this.form.value.otp,
            password: password,
          }),
        ),
        catchBadRequest([ErrorCodes.OTP1001, ErrorCodes.USER1004, ErrorCodes.USER1005], (res) => {
          switch (res.error.code) {
            case ErrorCodes.OTP1001:
              this.form.get('otp').setErrors({ otpInvalid: 'Invalid OTP' });
              break;
            case ErrorCodes.USER1004:
            case ErrorCodes.USER1005:
              this.router.navigate(['error', '404']);
          }
          this.isSummaryDisplayed$.next(true);
          return EMPTY;
        }),
      )
      .subscribe(() => {
        this.isPasswordReset = true;
      });
  }

  onSignInAgain(): void {
    this.authService.login({ redirectUri: this.authService.baseRedirectUri });
  }
}
