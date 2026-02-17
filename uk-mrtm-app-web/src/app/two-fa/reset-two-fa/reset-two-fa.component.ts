import { AsyncPipe, Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { combineLatest, first, map, switchMap } from 'rxjs';

import { OperatorUsersService, RegulatorUsersService, VerifierUsersService } from '@mrtm/api';

import { PageHeadingComponent } from '@netz/common/components';
import { PendingButtonDirective } from '@netz/common/directives';
import { ButtonDirective, LinkDirective } from '@netz/govuk-components';

@Component({
  selector: 'mrtm-reset-two-fa',
  imports: [PageHeadingComponent, PendingButtonDirective, ButtonDirective, LinkDirective, RouterLink, AsyncPipe],
  standalone: true,
  templateUrl: './reset-two-fa.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetTwoFaComponent {
  readonly location = inject(Location);
  private readonly regulatorUsersService = inject(RegulatorUsersService);
  private readonly verifierUsersService = inject(VerifierUsersService);
  private readonly operatorUsersService = inject(OperatorUsersService);
  private readonly route = inject(ActivatedRoute);

  userId$ = this.route.paramMap.pipe(map(() => window.history.state?.['userId']));
  accountId$ = this.route.paramMap.pipe(map(() => window.history.state?.['accountId']));
  userName$ = this.route.paramMap.pipe(map(() => window.history.state?.['userName']));
  role$ = this.route.paramMap.pipe(map(() => window.history.state?.['role']));

  reset() {
    combineLatest([this.userId$, this.accountId$, this.role$])
      .pipe(
        first(),
        switchMap(([userId, accountId, role]) => {
          switch (role) {
            case 'REGULATOR':
              return this.regulatorUsersService.resetRegulator2Fa(userId);
            case 'VERIFIER':
              return this.verifierUsersService.resetVerifier2Fa(userId);
            case 'OPERATOR':
              return this.operatorUsersService.resetOperator2Fa(accountId, userId);
          }
        }),
      )
      .subscribe(() => this.location.back());
  }
}
