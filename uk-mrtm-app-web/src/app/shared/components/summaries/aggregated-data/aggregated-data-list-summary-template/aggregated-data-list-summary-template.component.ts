import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PendingButtonDirective } from '@netz/common/directives';
import { StatusTagColorPipe } from '@netz/common/pipes';
import {
  ButtonDirective,
  LinkDirective,
  PaginationComponent,
  SortEvent,
  TableComponent,
  TagComponent,
} from '@netz/govuk-components';

import { sortAndPaginateListWithShipNameAndStatus } from '@requests/common/utils/sort-and-paginate-list-with-ship-name-and-status';
import { MultiSelectedItem, MultiSelectTableComponent } from '@shared/components';
import { AGGREGATED_DATA_SUMMARY_COLUMNS } from '@shared/components/summaries/aggregated-data/aggregated-data-list-summary-template/aggregated-data-list-summary-template.consts';
import { AerPortVoyageAggregatedStatusPipe, BigNumberPipe, InitialDataSourcePipe } from '@shared/pipes';
import { AerAggregatedDataSummaryItemDto } from '@shared/types';

@Component({
  selector: 'mrtm-aggregated-data-list-summary-template',
  standalone: true,
  imports: [
    PaginationComponent,
    LinkDirective,
    TagComponent,
    ButtonDirective,
    TableComponent,
    BigNumberPipe,
    StatusTagColorPipe,
    NgTemplateOutlet,
    PendingButtonDirective,
    MultiSelectTableComponent,
    RouterLink,
    AerPortVoyageAggregatedStatusPipe,
    InitialDataSourcePipe,
  ],
  templateUrl: './aggregated-data-list-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AggregatedDataListSummaryTemplateComponent {
  readonly deleteItems = output<AerAggregatedDataSummaryItemDto[]>();
  readonly data = input<Array<MultiSelectedItem<AerAggregatedDataSummaryItemDto>>>();
  readonly dataSupplierName = input<string>();
  readonly header = input<string>();
  readonly editable = input<boolean>(false);
  readonly pageSize = input<number>(10);
  readonly editPath = input<string>();

  readonly sort = signal<SortEvent>({ column: 'status', direction: 'descending' });
  readonly currentPage = signal<number>(1);
  readonly totalItems = computed<number>(() => this.data()?.length ?? 0);
  readonly columns = AGGREGATED_DATA_SUMMARY_COLUMNS;
  readonly rows = computed<Array<MultiSelectedItem<AerAggregatedDataSummaryItemDto>>>(() =>
    sortAndPaginateListWithShipNameAndStatus(
      [this.sort(), { column: 'shipName', direction: 'ascending' }],
      this.data() ?? [],
      this.currentPage(),
      this.pageSize(),
    ),
  );

  onPageChange(page: number): void {
    this.currentPage.set(page);
  }

  onDelete(rows: Array<MultiSelectedItem<AerAggregatedDataSummaryItemDto>>): void {
    this.deleteItems.emit(rows.filter((row) => row.isSelected));
  }
}
