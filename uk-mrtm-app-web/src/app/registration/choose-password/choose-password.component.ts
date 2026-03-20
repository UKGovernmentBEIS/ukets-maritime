import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { combineLatest, first, switchMap, takeUntil, tap } from 'rxjs';

import { OperatorUsersRegistrationService } from '@mrtm/api';

import { PageHeadingComponent } from '@netz/common/components';
import { DestroySubject } from '@netz/common/services';
import { ButtonDirective, ErrorSummaryComponent } from '@netz/govuk-components';

import { UserRegistrationStore } from '@registration/store/user-registration.store';
import { PasswordComponent } from '@shared/components';
import { PASSWORD_FORM, passwordFormProvider } from '@shared/providers';

@Component({
  selector: 'mrtm-choose-password',
  imports: [
    ErrorSummaryComponent,
    PageHeadingComponent,
    FormsModule,
    ReactiveFormsModule,
    ButtonDirective,
    PasswordComponent,
  ],
  standalone: true,
  templateUrl: './choose-password.component.html',
  providers: [DestroySubject, passwordFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChoosePasswordComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(UserRegistrationStore);
  private readonly operatorUsersRegistrationService = inject(OperatorUsersRegistrationService);
  private readonly destroy$ = inject(DestroySubject);
  readonly form = inject<UntypedFormGroup>(PASSWORD_FORM);

  isSummaryDisplayed = false;

  ngOnInit(): void {
    combineLatest([this.store.select('password'), this.store.select('email')])
      .pipe(
        takeUntil(this.destroy$),
        tap(([password, email]) => this.form.patchValue({ email, password, validatePassword: password })),
      )
      .subscribe();
  }

  submitPassword(): void {
    if (this.form.valid) {
      this.store.setState({ ...this.store.getState(), password: this.form.get('password').value, isSummarized: true });
      if (this.store.getState().invitationStatus === 'ALREADY_REGISTERED_SET_PASSWORD_ONLY') {
        combineLatest([this.store.select('token'), this.store.select('password')])
          .pipe(
            first(),
            switchMap(([token, password]) =>
              this.operatorUsersRegistrationService.acceptAuthorityAndSetCredentialsToUser({
                invitationToken: token,
                password: password,
              }),
            ),
          )
          .subscribe(() =>
            this.router.navigate(['../success'], {
              relativeTo: this.route,
            }),
          );
      } else {
        this.router.navigate(['../summary'], {
          relativeTo: this.route,
        });
      }
    } else {
      this.isSummaryDisplayed = true;
    }
  }
}
