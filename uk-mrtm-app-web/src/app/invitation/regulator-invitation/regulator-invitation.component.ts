import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { first, map, Observable, of, switchMap, takeUntil } from 'rxjs';

import { InvitedUserInfoDTO, RegulatorUsersRegistrationService } from '@mrtm/api';

import { catchBadRequest, ErrorCodes } from '@netz/common/error';
import { DestroySubject } from '@netz/common/services';

import { PasswordComponent, WizardStepComponent } from '@shared/components';
import { PASSWORD_FORM, passwordFormProvider } from '@shared/providers';

@Component({
  selector: 'mrtm-regulator-invitation',
  imports: [ReactiveFormsModule, PasswordComponent, WizardStepComponent],
  standalone: true,
  templateUrl: './regulator-invitation.component.html',
  providers: [passwordFormProvider, DestroySubject],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegulatorInvitationComponent implements OnInit {
  protected readonly form = inject<UntypedFormGroup>(PASSWORD_FORM);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly regulatorUsersRegistrationService = inject(RegulatorUsersRegistrationService);
  private readonly destroy$ = inject(DestroySubject);

  ngOnInit(): void {
    (this.route.data as Observable<{ invitedUser: InvitedUserInfoDTO }>)
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ invitedUser: { email } }) => this.form.patchValue({ email }));
  }

  onSubmit(): void {
    this.route.queryParamMap
      .pipe(
        map((paramMap) => paramMap.get('token')),
        first(),
        switchMap((invitationToken) =>
          this.regulatorUsersRegistrationService.acceptAuthorityAndActivateRegulatorUserFromInvite({
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
            ErrorCodes.AUTHORITY1005,
            ErrorCodes.AUTHORITY1014,
          ],
          (res) => of({ url: 'invalid-link', queryParams: { code: res.error.code } }),
        ),
      )
      .subscribe(({ queryParams, url }: { url: string; queryParams?: any }) =>
        this.router.navigate([url], { relativeTo: this.route, queryParams }),
      );
  }
}
