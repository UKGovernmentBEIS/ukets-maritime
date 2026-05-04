import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { first, iif, switchMap } from 'rxjs';

import { OperatorAuthoritiesService } from '@mrtm/api';

import { AuthStore, selectLoginStatus, selectUserId } from '@netz/common/auth';
import { PageHeadingComponent } from '@netz/common/components';
import { PendingButtonDirective } from '@netz/common/directives';
import { BusinessErrorService, catchBadRequest, ErrorCodes } from '@netz/common/error';
import { UserFullNamePipe } from '@netz/common/pipes';
import { ButtonDirective, LinkDirective, PanelComponent, WarningTextComponent } from '@netz/govuk-components';

import {
  activeOperatorAdminError,
  financialContactError,
  primaryContactError,
  saveNotFoundOperatorError,
  serviceContactError,
} from '@accounts/errors';
import { UserAuthorityDTO } from '@accounts/types/user-authority.type';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'mrtm-delete-user-authority',
  imports: [
    PanelComponent,
    RouterLink,
    UserFullNamePipe,
    LinkDirective,
    PageHeadingComponent,
    WarningTextComponent,
    PendingButtonDirective,
    ButtonDirective,
  ],
  standalone: true,
  templateUrl: './delete-user-authority.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteUserAuthorityComponent {
  private readonly authService = inject(AuthService);
  private readonly authStore = inject(AuthStore);
  private readonly operatorAuthoritiesService = inject(OperatorAuthoritiesService);
  private readonly route = inject(ActivatedRoute);
  private readonly businessErrorService = inject(BusinessErrorService);

  accountId = Number(this.route.snapshot.paramMap.get('accountId'));
  userId = this.route.snapshot.paramMap.get('userId');
  userAuthority = (this.route.snapshot.data as { userAuthority: UserAuthorityDTO }).userAuthority;
  isLoginEnabled = this.authStore.select(selectLoginStatus)() === 'ENABLED';
  readonly isDeleted = signal(false);
  readonly isCurrentUser = computed(() => this.userId === this.authStore.select(selectUserId)());

  confirm(): void {
    iif(
      () => this.isCurrentUser(),
      this.operatorAuthoritiesService
        .deleteCurrentUserAccountOperatorAuthority(this.accountId)
        .pipe(switchMap(() => this.authService.loadUserState())),
      this.operatorAuthoritiesService.deleteAccountOperatorAuthority(this.accountId, this.userId),
    )
      .pipe(
        first(),
        catchBadRequest(
          [
            ErrorCodes.AUTHORITY1001,
            ErrorCodes.AUTHORITY1004,
            ErrorCodes.ACCOUNT_CONTACT1001,
            ErrorCodes.ACCOUNT_CONTACT1002,
            ErrorCodes.ACCOUNT_CONTACT1003,
          ],
          (res) =>
            this.businessErrorService.showError(
              (() => {
                switch (res.error.code) {
                  case ErrorCodes.AUTHORITY1001:
                    return activeOperatorAdminError(this.accountId);
                  case ErrorCodes.AUTHORITY1004:
                    return saveNotFoundOperatorError(this.accountId);
                  case ErrorCodes.ACCOUNT_CONTACT1001:
                    return primaryContactError(this.accountId);
                  case ErrorCodes.ACCOUNT_CONTACT1002:
                    return financialContactError(this.accountId);
                  case ErrorCodes.ACCOUNT_CONTACT1003:
                    return serviceContactError(this.accountId);
                }
              })(),
            ),
        ),
      )
      .subscribe(() => this.isDeleted.update(() => true));
  }
}
