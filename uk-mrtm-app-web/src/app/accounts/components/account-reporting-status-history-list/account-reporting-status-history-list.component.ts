import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

import { AccountReportingStatusHistoryDTO } from '@mrtm/api';

import { GovukDatePipe } from '@netz/common/pipes';
import { TableComponent } from '@netz/govuk-components';

import { ACCOUNT_REPORTING_HISTORY_COLUMNS } from '@accounts/components/account-reporting-status-history-list/account-reporting-status-history-list.consts';
import { AccountReportingStatusPipe } from '@accounts/pipes';
import { NotProvidedDirective } from '@shared/directives';

@Component({
  selector: 'mrtm-account-reporting-status-history-list',
  imports: [AccountReportingStatusPipe, GovukDatePipe, TableComponent, NotProvidedDirective],
  standalone: true,
  templateUrl: './account-reporting-status-history-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountReportingStatusHistoryListComponent {
  readonly history = input.required<Array<AccountReportingStatusHistoryDTO>>();
  readonly columns = signal(ACCOUNT_REPORTING_HISTORY_COLUMNS);
}
