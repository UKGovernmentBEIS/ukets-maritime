import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { map, Observable, take } from 'rxjs';

import { BreadcrumbService } from '@netz/common/navigation';
import { LinkDirective, PanelComponent } from '@netz/govuk-components';

import { UserAuthorityStore } from '@accounts/store';
import { selectNewUserAuthority } from '@accounts/store/user-authority.selectors';

@Component({
  selector: 'mrtm-create-account-success',
  imports: [RouterLink, PanelComponent, LinkDirective, AsyncPipe],
  standalone: true,
  templateUrl: './create-user-authority-success.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateUserAuthoritySuccessComponent implements OnInit {
  private readonly store: UserAuthorityStore = inject(UserAuthorityStore);
  private readonly breadcrumbsService = inject(BreadcrumbService);

  userEmail$: Observable<string> = this.store.pipe(
    selectNewUserAuthority,
    map((userAuthority) => userAuthority?.email),
    take(1),
  );

  ngOnInit(): void {
    this.breadcrumbsService.showDashboardBreadcrumb();
  }
}
