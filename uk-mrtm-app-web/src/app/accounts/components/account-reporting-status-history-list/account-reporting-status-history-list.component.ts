import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

import { AccountReportingStatusHistoryDTO } from '@mrtm/api';

import { GovukDatePipe } from '@netz/common/pipes';
import { TableComponent } from '@netz/govuk-components';

import { ACCOUNT_REPORTING_HISTORY_COLUMNS } from '@accounts/components/account-reporting-status-history-list/account-reporting-status-history-list.consts';
import { AccountReportingStatusPipe } from '@accounts/pipes';
import { NotProvidedDirective } from '@shared/directives';

@Component({
  selector: 'mrtm-account-reporting-status-history-list',
  templateUrl: './account-reporting-status-history-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AccountReportingStatusPipe, GovukDatePipe, TableComponent, NotProvidedDirective],
})
export class AccountReportingStatusHistoryListComponent {
  history = input.required<Array<AccountReportingStatusHistoryDTO>>();
  columns = signal(ACCOUNT_REPORTING_HISTORY_COLUMNS);
}
