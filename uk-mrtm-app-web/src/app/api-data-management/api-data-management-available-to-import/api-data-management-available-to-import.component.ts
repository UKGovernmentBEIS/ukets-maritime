import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject, output, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { switchMap, tap } from 'rxjs';

import { ThirdPartyDataManagementAPIService, ThirdPartyDataManagementAvailableToImportCriteriaDTO } from '@mrtm/api';

import { GovukDatePipe } from '@netz/common/pipes';
import { LinkDirective, PaginationComponent, SortEvent, TableComponent, TagComponent } from '@netz/govuk-components';

import {
  AVAILABLE_TO_IMPORT_COLUMN_SORT_MAP,
  AVAILABLE_TO_IMPORT_COLUMNS,
} from '@api-data-management/api-data-management-available-to-import/api-data-management-available-to-import.constants';
import { ApiDataManagementTaskTypeToTextPipe } from '@api-data-management/pipes';

@Component({
  selector: 'mrtm-api-data-management-available-to-import',
  imports: [
    NgTemplateOutlet,
    TagComponent,
    TableComponent,
    ApiDataManagementTaskTypeToTextPipe,
    GovukDatePipe,
    PaginationComponent,
    RouterLink,
    LinkDirective,
  ],
  templateUrl: './api-data-management-available-to-import.component.html',
})
export class ApiDataManagementAvailableToImportComponent {
  private readonly service = inject(ThirdPartyDataManagementAPIService);
  protected readonly pageSize = signal(20);
  readonly isImportAvailable = output<boolean>();
  readonly page = signal<number>(1);
  protected readonly sortBy = signal<ThirdPartyDataManagementAvailableToImportCriteriaDTO['sortBy']>(undefined);
  protected readonly direction = signal<ThirdPartyDataManagementAvailableToImportCriteriaDTO['direction']>(undefined);
  readonly data = toSignal(
    toObservable(
      computed(() => ({
        page: this.page() - 1,
        size: this.pageSize(),
        sortBy: this.sortBy(),
        direction: this.direction(),
      })),
    ).pipe(
      switchMap(({ page, size, sortBy, direction }) =>
        this.service.findDataAvailableToImport(page, size, {
          ...(sortBy ? { sortBy } : {}),
          ...(direction ? { direction } : {}),
        }),
      ),
      tap((res) => {
        this.isImportAvailable.emit(res?.accountsEligibleForImport > 0);
      }),
    ),
  );
  readonly columns = AVAILABLE_TO_IMPORT_COLUMNS;

  protected changePage(page: number) {
    this.page.set(page);
  }

  protected onSort(event: SortEvent) {
    const mappedSortBy = AVAILABLE_TO_IMPORT_COLUMN_SORT_MAP[String(event.column)];
    if (!mappedSortBy) {
      return;
    }
    this.sortBy.set(mappedSortBy);
    this.direction.set(event.direction === 'ascending' ? 'ASC' : 'DESC');
    this.page.set(1);
  }
}
