import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { BehaviorSubject, first, map, Observable, switchMap, tap } from 'rxjs';

import { RegulatorAuthoritiesService, RegulatorUserDTO, UserDTO } from '@mrtm/api';

import { AuthStore, selectUserId } from '@netz/common/auth';
import { PendingButtonDirective } from '@netz/common/directives';
import { BusinessErrorService, catchBadRequest, ErrorCodes } from '@netz/common/error';
import { UserFullNamePipe } from '@netz/common/pipes';
import { ButtonDirective, LinkDirective, PanelComponent, WarningTextComponent } from '@netz/govuk-components';

import { AuthService } from '@core/services/auth.service';
import { saveNotFoundRegulatorError } from '@regulators/errors/business-error';

@Component({
  selector: 'mrtm-delete',
  imports: [
    WarningTextComponent,
    PendingButtonDirective,
    ButtonDirective,
    LinkDirective,
    RouterLink,
    PanelComponent,
    AsyncPipe,
    UserFullNamePipe,
  ],
  standalone: true,
  templateUrl: './delete.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteComponent {
  private readonly authStore = inject(AuthStore);
  private readonly authService = inject(AuthService);
  private readonly regulatorAuthoritiesService = inject(RegulatorAuthoritiesService);
  private readonly route = inject(ActivatedRoute);
  private readonly businessErrorService = inject(BusinessErrorService);

  regulator$: Observable<any> = (this.route.data as Observable<{ user: UserDTO | RegulatorUserDTO }>).pipe(
    map(({ user }) => user),
  );
  isConfirmationDisplayed$ = new BehaviorSubject<boolean>(false);

  deleteRegulator(): void {
    this.route.paramMap
      .pipe(
        first(),
        switchMap((paramMap) => {
          const userId = this.authStore.select(selectUserId)();
          return userId === paramMap.get('userId')
            ? this.regulatorAuthoritiesService
                .deleteCurrentRegulatorUserByCompetentAuthority()
                .pipe(tap(() => this.authService.logout()))
            : this.regulatorAuthoritiesService.deleteRegulatorUserByCompetentAuthority(paramMap.get('userId'));
        }),
        catchBadRequest(ErrorCodes.AUTHORITY1003, () =>
          this.businessErrorService.showError(saveNotFoundRegulatorError),
        ),
      )
      .subscribe(() => this.isConfirmationDisplayed$.next(true));
  }
}
