import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AccountSearchResultInfoDTO } from '@mrtm/api';

import { LinkDirective, TagComponent } from '@netz/govuk-components';

import { OperatorAccountsStatusColorPipe } from '@accounts/pipes/operator-accounts-status-color.pipe';

@Component({
  selector: 'mrtm-accounts-list',
  imports: [LinkDirective, RouterLink, TitleCasePipe, OperatorAccountsStatusColorPipe, TagComponent],
  standalone: true,
  templateUrl: './accounts-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountsListComponent {
  readonly accounts = input<AccountSearchResultInfoDTO[]>();
}
