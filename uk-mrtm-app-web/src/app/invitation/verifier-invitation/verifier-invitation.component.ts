import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { BehaviorSubject, first, map, Observable, of, switchMap, takeUntil } from 'rxjs';

import { InvitedUserInfoDTO, VerifierUsersRegistrationService } from '@mrtm/api';

import { PageHeadingComponent } from '@netz/common/components';
import { PendingButtonDirective } from '@netz/common/directives';
import { catchBadRequest, ErrorCodes } from '@netz/common/error';
import { DestroySubject } from '@netz/common/services';
import { ButtonDirective, ErrorSummaryComponent } from '@netz/govuk-components';

import { PasswordComponent } from '@shared/components';
import { PASSWORD_FORM, passwordFormProvider } from '@shared/providers';

@Component({
  selector: 'mrtm-verifier-invitation',
  templateUrl: './verifier-invitation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [passwordFormProvider, DestroySubject],
  standalone: true,
  imports: [
    ErrorSummaryComponent,
    PageHeadingComponent,
    FormsModule,
    ReactiveFormsModule,
    PendingButtonDirective,
    ButtonDirective,
    AsyncPipe,
    PasswordComponent,
  ],
})
export class VerifierInvitationComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly verifierUsersRegistrationService = inject(VerifierUsersRegistrationService);
  private readonly destroy$ = inject(DestroySubject);
  readonly form = inject<UntypedFormGroup>(PASSWORD_FORM);

  isSummaryDisplayed = new BehaviorSubject(false);

  ngOnInit(): void {
    (this.route.data as Observable<{ invitedUser: InvitedUserInfoDTO }>)
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ invitedUser: { email } }) => {
        this.form.patchValue({ email });
      });
  }

  submitPassword(): void {
    if (this.form.valid) {
      this.route.queryParamMap
        .pipe(
          map((paramMap) => paramMap.get('token')),
          first(),
          switchMap((invitationToken) =>
            this.verifierUsersRegistrationService.acceptAuthorityAndActivateVerifierUserFromInvite({
              invitationToken,
              password: this.form.get('password').value,
            }),
          ),
          map(() => ({ url: 'confirmed' })),
          catchBadRequest(
            [
              ErrorCodes.EMAIL1001,
              ErrorCodes.TOKEN1001,
              ErrorCodes.USER1004,
              ErrorCodes.USER1001,
              ErrorCodes.AUTHORITY1015,
            ],
            (res) => of({ url: 'invalid-link', queryParams: { code: res.error.code } }),
          ),
        )
        .subscribe(({ queryParams, url }: { url: string; queryParams?: any }) =>
          this.router.navigate([url], { relativeTo: this.route, queryParams }),
        );
    } else {
      this.isSummaryDisplayed.next(true);
      this.form.markAllAsTouched();
    }
  }
}
