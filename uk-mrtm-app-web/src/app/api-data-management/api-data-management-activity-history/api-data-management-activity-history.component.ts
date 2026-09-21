import { DatePipe, NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

import { catchError, EMPTY, exhaustMap, map, Subject, switchMap, tap } from 'rxjs';

import {
  ThirdPartyDataManagementAPIService,
  ThirdPartyDataManagementImportRequestDTO,
  ThirdPartyDataManagementTransactionDetailsResponseDTO,
} from '@mrtm/api';

import { GovukDatePipe } from '@netz/common/pipes';
import { PendingRequestService } from '@netz/common/services';
import { PaginationComponent, SortEvent, TableComponent, TagComponent } from '@netz/govuk-components';

import { IMPORTED_RECORDS_COLUMNS } from '@api-data-management/api-data-management-activity-history/api-data-management-activity-history.constants';
import {
  ApiDataManagementTaskStatusColorPipe,
  ApiDataManagementTaskStatusTitlePipe,
  ApiDataManagementTaskTypeToTextPipe,
} from '@api-data-management/pipes';
import { utils, writeFileXLSX } from 'xlsx';

@Component({
  selector: 'mrtm-api-data-management-activity-history',
  imports: [
    GovukDatePipe,
    NgTemplateOutlet,
    ApiDataManagementTaskTypeToTextPipe,
    ApiDataManagementTaskStatusTitlePipe,
    TableComponent,
    ApiDataManagementTaskStatusColorPipe,
    PaginationComponent,
    TagComponent,
  ],
  templateUrl: './api-data-management-activity-history.component.html',
})
export class ApiDataManagementActivityHistoryComponent {
  private readonly thirdPartyDataService = inject(ThirdPartyDataManagementAPIService);
  private readonly pendingRequest = inject(PendingRequestService);

  protected readonly pageSize = signal(20);
  private readonly query = signal<{ page: number; direction?: 'ASC' | 'DESC' }>({ page: 1 });
  readonly page = computed(() => this.query().page);
  readonly data = toSignal(
    toObservable(
      computed(() => ({
        page: this.query().page - 1,
        size: this.pageSize(),
        direction: this.query().direction,
      })),
    ).pipe(
      switchMap(({ page, size, direction }) =>
        this.thirdPartyDataService.findImportTransactions(page, size, direction),
      ),
      map((res) => ({
        ...res,
        items: (res?.items ?? []).map((transaction) => ({
          ...transaction,
          report: transaction?.status !== 'IN_PROGRESS',
        })),
      })),
    ),
  );

  private readonly downloadReport$ = new Subject<number>();
  readonly columns = IMPORTED_RECORDS_COLUMNS;

  private readonly downloadReportResult = toSignal(
    this.downloadReport$.pipe(
      exhaustMap((transactionId) =>
        this.thirdPartyDataService.findImportTransactionDetails(transactionId).pipe(
          this.pendingRequest.trackRequest(),
          catchError(() => EMPTY),
        ),
      ),
      tap((details) => this.exportCdmDataJobReportToExcel(details)),
    ),
  );

  protected downloadReport(transactionId: number) {
    this.downloadReport$.next(transactionId);
  }

  protected changePage(page: number) {
    this.query.update((current) => ({ ...current, page }));
  }

  protected onSort(event: SortEvent) {
    if (String(event.column) !== 'createdOn') {
      return;
    }
    this.query.set({
      page: 1,
      direction: event.direction === 'ascending' ? 'ASC' : 'DESC',
    });
  }

  private exportCdmDataJobReportToExcel(details: ThirdPartyDataManagementTransactionDetailsResponseDTO): void {
    const transaction = details?.transaction ?? {};
    const itemType = transaction.itemType as ThirdPartyDataManagementImportRequestDTO;
    const statusTitlePipe = new ApiDataManagementTaskStatusTitlePipe();
    const rows = [
      ['Transaction ID', transaction.id?.toString()],
      ['Transaction status', statusTitlePipe.transform(transaction.status)],
      ['Executed timestamp', new DatePipe('en-GB').transform(transaction.createdOn, 'M/d/yy h:mm a')],
      ['Task type', new ApiDataManagementTaskTypeToTextPipe().transform(itemType?.requestType, itemType?.year)],
      [],
      ['Maritime Operator name', 'Transaction status', 'Failure reasons'],
      ...(details?.jobs ?? []).map((job) => [job.operatorName, job.status, job.failureReason || 'N/A']),
    ];

    const ws = utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 30 }, { wch: 40 }, { wch: 30 }];

    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, `Transaction ${transaction.id}`);
    writeFileXLSX(wb, `Bulk_import_transaction_${transaction.id}.xlsx`);
  }
}
