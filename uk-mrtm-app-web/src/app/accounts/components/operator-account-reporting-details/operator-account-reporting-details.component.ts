import { ChangeDetectionStrategy, Component, computed, inject, input, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { combineLatest, filter, switchMap, take, tap } from 'rxjs';

import { AccountReportingStatusHistoryService } from '@mrtm/api';

import { GovukDatePipe } from '@netz/common/pipes';
import { GovukTableColumn, LinkDirective, PaginationComponent, TableComponent } from '@netz/govuk-components';

import { ACCOUNT_REPORTING_STATUS_COLUMNS } from '@accounts/components/operator-account-reporting-details/operator-account-reporting-details.consts';
import { AccountReportingStatusPipe } from '@accounts/pipes';
import {
  OperatorAccountsStore,
  selectAccount,
  selectReportingStatus,
  selectReportingStatusHistoryPaging,
} from '@accounts/store';
import { Paging } from '@shared/types';

interface ViewModel {
  columns: Array<GovukTableColumn>;
  data: Array<unknown>;
  total: number;
  paging: Paging;
}

@Component({
  selector: 'mrtm-operator-account-reporting-details',
  templateUrl: './operator-account-reporting-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterLink, LinkDirective, AccountReportingStatusPipe, TableComponent, GovukDatePipe, PaginationComponent],
})
export class OperatorAccountReportingDetailsComponent {
  private readonly operatorAccountsStore: OperatorAccountsStore = inject(OperatorAccountsStore);
  private readonly reportingStatusService: AccountReportingStatusHistoryService = inject(
    AccountReportingStatusHistoryService,
  );
  private readonly reportingStatus = toSignal(this.operatorAccountsStore.pipe(selectReportingStatus));
  public readonly editable = input<boolean>(true);
  public readonly vm: Signal<ViewModel> = computed(() => {
    const { total, paging, statuses } = this.reportingStatus();
    return {
      columns: this.editable()
        ? ACCOUNT_REPORTING_STATUS_COLUMNS
        : ACCOUNT_REPORTING_STATUS_COLUMNS.filter((x) => x.field !== 'actions'),
      data: statuses,
      total,
      paging,
    };
  });

  public onPageChange(page: number) {
    combineLatest([
      this.operatorAccountsStore.pipe(selectAccount),
      this.operatorAccountsStore.pipe(selectReportingStatusHistoryPaging),
    ])
      .pipe(
        take(1),
        filter(([, paging]) => {
          return paging.page !== page;
        }),
        tap(() => this.operatorAccountsStore.setReportingStatusCurrentPage(page)),
        switchMap(([account, paging]) =>
          this.reportingStatusService.getAllReportingStatuses(account.id, page - 1, paging.pageSize),
        ),
      )
      .subscribe((reportingStatuses) => {
        this.operatorAccountsStore.setReportingStatuses((reportingStatuses as any)?.reportingStatusList);
        this.operatorAccountsStore.setReportingStatusTotal((reportingStatuses as any)?.total);
      });
  }
}
