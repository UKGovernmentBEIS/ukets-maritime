import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { StatusTagColorPipe } from '@netz/common/pipes';
import {
  GovukTableColumn,
  LinkDirective,
  PaginationComponent,
  SortEvent,
  TableComponent,
  TagComponent,
} from '@netz/govuk-components';

import {
  LIST_OF_SHIPS_TABLE_COLUMNS,
  LIST_OF_SHIPS_TABLE_COLUMNS_WITH_DATA_SOURCE,
} from '@requests/common/components/emissions/list-of-ships-table/list-of-ships-table.constants';
import { ShipTaskStatusPipe, ShipTypePipe } from '@requests/common/components/emissions/pipes';
import { sortDiffPaginateListWithShipNameAndStatus } from '@requests/common/utils';
import { HTML_DIFF, HtmlDiffDirective } from '@shared/directives';
import { InitialDataSourcePipe } from '@shared/pipes';
import { AerShipEmissionTableListItem, DiffItem, ShipEmissionTableListItem } from '@shared/types';
import { mergeDiffShips } from '@shared/utils';

@Component({
  selector: 'mrtm-list-of-ships-summary-template',
  standalone: true,
  imports: [
    TableComponent,
    LinkDirective,
    ShipTaskStatusPipe,
    ShipTypePipe,
    StatusTagColorPipe,
    TagComponent,
    RouterLink,
    HtmlDiffDirective,
    PaginationComponent,
    InitialDataSourcePipe,
  ],
  templateUrl: './list-of-ships-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListOfShipsSummaryTemplateComponent {
  hasHtmlDiff = inject(HTML_DIFF, { optional: true });
  readonly data = input.required<(ShipEmissionTableListItem | AerShipEmissionTableListItem)[]>();
  readonly originalShips = input<(ShipEmissionTableListItem | AerShipEmissionTableListItem)[]>();
  readonly editUrl = input<string>();
  readonly queryParams = input<Params>({});
  readonly dataSupplierName = input<string>();
  readonly columns = computed(() => {
    return (
      this.data()
        .map((x: AerShipEmissionTableListItem) => !!x.dataInputType)
        .filter(Boolean).length > 0
        ? LIST_OF_SHIPS_TABLE_COLUMNS_WITH_DATA_SOURCE
        : LIST_OF_SHIPS_TABLE_COLUMNS
    ) as GovukTableColumn<DiffItem<ShipEmissionTableListItem | AerShipEmissionTableListItem>>[];
  });
  readonly combinedShips: Signal<DiffItem<ShipEmissionTableListItem>[]> = computed(() =>
    mergeDiffShips(this.data(), this.originalShips()),
  );
  readonly pageSize: number = 10;
  readonly totalItems: Signal<number> = computed(() => this.combinedShips()?.length ?? 0);
  readonly currentPage: WritableSignal<number> = signal<number>(1);
  readonly sort = signal<SortEvent>(null);
  readonly paginatedData = computed<DiffItem<ShipEmissionTableListItem>[]>(() => {
    return sortDiffPaginateListWithShipNameAndStatus(
      this.sort(),
      this.combinedShips(),
      this.currentPage(),
      this.pageSize,
    );
  });

  onPageChange(page: number): void {
    this.currentPage.set(page);
  }
}
