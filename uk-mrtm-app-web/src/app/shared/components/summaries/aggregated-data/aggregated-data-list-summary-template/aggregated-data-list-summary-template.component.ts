import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output, Signal, signal } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

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
import { PaginationStatePersistableComponent } from '@shared/abstraction';
import { MultiSelectedItem, MultiSelectTableComponent } from '@shared/components';
import { AGGREGATED_DATA_SUMMARY_COLUMNS } from '@shared/components/summaries/aggregated-data/aggregated-data-list-summary-template/aggregated-data-list-summary-template.consts';
import { ScrollablePaneDirective } from '@shared/directives';
import { AerPortVoyageAggregatedStatusPipe, BigNumberPipe, InitialDataSourcePipe } from '@shared/pipes';
import { PersistablePaginationState } from '@shared/services';
import { AerAggregatedDataSummaryItemDto } from '@shared/types';

@Component({
  selector: 'mrtm-aggregated-data-list-summary-template',
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
    ScrollablePaneDirective,
  ],
  standalone: true,
  templateUrl: './aggregated-data-list-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AggregatedDataListSummaryTemplateComponent extends PaginationStatePersistableComponent {
  readonly deleteItems = output<AerAggregatedDataSummaryItemDto[]>();
  readonly data = input<Array<MultiSelectedItem<AerAggregatedDataSummaryItemDto>>>();
  readonly dataSupplierName = input<string>();
  readonly header = input<string>();
  readonly editable = input<boolean>(false);
  readonly withPagination = input<boolean>(true);
  readonly pageSize: Signal<number> = computed(() => (this.withPagination() ? 10 : Number.MAX_VALUE));
  readonly editPath = input<string>();

  readonly sort = signal<SortEvent>(
    (this.currentPersistableComponentState()?.currentSorting as any) ?? { column: 'status', direction: 'descending' },
  );
  readonly currentPage = signal<number>(this.currentPersistableComponentState()?.currentPage ?? 1);
  readonly totalItems = computed<number>(() => this.data()?.length ?? 0);
  readonly columns = AGGREGATED_DATA_SUMMARY_COLUMNS;
  readonly rows = computed<Array<MultiSelectedItem<AerAggregatedDataSummaryItemDto>>>(() =>
    sortAndPaginateListWithShipNameAndStatus(
      [this.sort(), { column: 'shipName', direction: 'ascending' }],
      this.data() ?? [],
      this.editable() ? 1 : this.currentPage(),
      this.editable() ? Number.MAX_VALUE : this.pageSize(),
    ),
  );

  readonly queryParams = input<Params>({});

  onPageChange(page: number): void {
    this.currentPage.set(page);
  }

  onDelete(rows: Array<MultiSelectedItem<AerAggregatedDataSummaryItemDto>>): void {
    this.deleteItems.emit(rows.filter((row) => row.isSelected));
  }

  public getExtraState(): Pick<PersistablePaginationState, 'currentSorting' | 'activeFilters'> {
    return {
      currentSorting: this.sort(),
    };
  }
}
