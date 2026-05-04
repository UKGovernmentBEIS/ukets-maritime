import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { map, Observable, take } from 'rxjs';

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
export class CreateUserAuthoritySuccessComponent {
  private readonly store: UserAuthorityStore = inject(UserAuthorityStore);
  userEmail$: Observable<string> = this.store.pipe(
    selectNewUserAuthority,
    map((userAuthority) => userAuthority?.email),
    take(1),
  );
}
