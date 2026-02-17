import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { combineLatest, first, map, switchMap } from 'rxjs';

import { OperatorUserRegistrationWithCredentialsDTO, OperatorUsersRegistrationService } from '@mrtm/api';

import { PageHeadingComponent } from '@netz/common/components';
import { ButtonDirective } from '@netz/govuk-components';

import { UserRegistrationStore } from '@registration/store/user-registration.store';
import { SummaryHeaderComponent, UserInputSummaryTemplateComponent } from '@shared/components';
import cleanDeep from 'clean-deep';

@Component({
  selector: 'mrtm-summary',
  imports: [
    AsyncPipe,
    ButtonDirective,
    PageHeadingComponent,
    SummaryHeaderComponent,
    UserInputSummaryTemplateComponent,
  ],
  standalone: true,
  templateUrl: './summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SummaryComponent {
  private readonly store = inject(UserRegistrationStore);
  private readonly operatorUsersRegistrationService = inject(OperatorUsersRegistrationService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  userInfo$ = this.store.select('userRegistrationDTO');
  invitationStatus$ = this.store.select('invitationStatus');

  isSubmitDisabled: boolean;

  registerUser(): void {
    this.isSubmitDisabled = true;
    const isNoPasswordInvitation =
      this.store.getState().invitationStatus === 'PENDING_TO_REGISTERED_SET_REGISTER_FORM_NO_PASSWORD';

    combineLatest([this.store.select('userRegistrationDTO'), this.store.select('password'), this.store.select('token')])
      .pipe(
        first(),
        map(([user, password, emailToken]) => cleanDeep({ ...user, password, emailToken })),
        switchMap((user: OperatorUserRegistrationWithCredentialsDTO) =>
          isNoPasswordInvitation
            ? this.operatorUsersRegistrationService.acceptAuthorityAndEnableInvitedUserWithoutCredentials(user)
            : this.operatorUsersRegistrationService.acceptAuthorityAndEnableInvitedUserWithCredentials(user),
        ),
      )
      .subscribe(() =>
        this.router.navigate([isNoPasswordInvitation ? '../../invitation' : '../success'], { relativeTo: this.route }),
      );
  }
}
