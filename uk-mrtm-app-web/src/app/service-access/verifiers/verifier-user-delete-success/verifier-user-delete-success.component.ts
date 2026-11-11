import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { map, Observable, take } from 'rxjs';

import { UserAuthorityInfoDTO } from '@mrtm/api';

import { UserFullNamePipe } from '@netz/common/pipes';
import { LinkDirective, PanelComponent } from '@netz/govuk-components';

import { selectUserAuthority } from '@service-access/verifiers/+state/verifier-user.selectors';
import { VerifierUserStore } from '@service-access/verifiers/+state/verifier-user.store';

@Component({
  selector: 'mrtm-verifier-user-delete-success',
  imports: [AsyncPipe, LinkDirective, PanelComponent, RouterLink, UserFullNamePipe],
  standalone: true,
  templateUrl: './verifier-user-delete-success.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerifierUserDeleteSuccessComponent {
  private readonly store: VerifierUserStore = inject(VerifierUserStore);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  userInfo$: Observable<UserAuthorityInfoDTO> = this.store.pipe(
    selectUserAuthority,
    map((userAuthority) => userAuthority),
    take(1),
  );
  verificationBodyId$ = this.activatedRoute.queryParamMap.pipe(map((params) => params.get('verificationBodyId')));
}
