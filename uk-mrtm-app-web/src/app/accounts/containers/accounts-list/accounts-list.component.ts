import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AccountSearchResultInfoDTO } from '@mrtm/api';

import { LinkDirective, TagComponent } from '@netz/govuk-components';

import { OperatorAccountsStatusColorPipe } from '@accounts/pipes/operator-accounts-status-color.pipe';

@Component({
  selector: 'mrtm-accounts-list',
  templateUrl: './accounts-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [LinkDirective, RouterLink, TitleCasePipe, OperatorAccountsStatusColorPipe, TagComponent],
})
export class AccountsListComponent {
  @Input() accounts: AccountSearchResultInfoDTO[];
}
