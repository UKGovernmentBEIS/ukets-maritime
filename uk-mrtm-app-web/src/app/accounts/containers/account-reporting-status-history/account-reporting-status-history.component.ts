import { KeyValue, KeyValuePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { AccountReportingStatusHistoryDTO } from '@mrtm/api';

import { PageHeadingComponent } from '@netz/common/components';
import { AccordionComponent, AccordionItemComponent } from '@netz/govuk-components';

import { AccountReportingStatusHistoryListComponent } from '@accounts/components';
import { OperatorAccountsStore, selectReportingStatusHistory } from '@accounts/store';

@Component({
  selector: 'mrtm-account-reporting-status-history',
  templateUrl: './account-reporting-status-history.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    PageHeadingComponent,
    AccordionComponent,
    AccordionItemComponent,
    KeyValuePipe,
    AccountReportingStatusHistoryListComponent,
  ],
})
export class AccountReportingStatusHistoryComponent {
  private readonly store = inject(OperatorAccountsStore);
  public readonly vm$ = toSignal(this.store.pipe(selectReportingStatusHistory));

  public descOrder = (
    a: KeyValue<string, Array<AccountReportingStatusHistoryDTO>>,
    b: KeyValue<string, Array<AccountReportingStatusHistoryDTO>>,
  ): number => {
    return a.key > b.key ? -1 : b.key > a.key ? 1 : 0;
  };
}
