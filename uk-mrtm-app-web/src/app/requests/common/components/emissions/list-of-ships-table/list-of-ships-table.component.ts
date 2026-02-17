import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { StatusTagColorPipe } from '@netz/common/pipes';
import {
  ButtonDirective,
  GovukTableColumn,
  LinkDirective,
  PaginationComponent,
  SortEvent,
  TagComponent,
  WarningTextComponent,
} from '@netz/govuk-components';

import {
  LIST_OF_SHIPS_TABLE_COLUMNS,
  LIST_OF_SHIPS_TABLE_COLUMNS_WITH_DATA_SOURCE,
} from '@requests/common/components/emissions/list-of-ships-table/list-of-ships-table.constants';
import { ShipTaskStatusPipe, ShipTypePipe } from '@requests/common/components/emissions/pipes';
import { FilterByShip, FilterByShipComponent } from '@requests/common/components/list-filter-forms/filter-by-ship';
import { sortAndPaginateListWithShipNameAndStatus } from '@requests/common/utils/sort-and-paginate-list-with-ship-name-and-status';
import { MultiSelectedItem, MultiSelectTableComponent } from '@shared/components';
import { ScrollablePaneDirective } from '@shared/directives';
import { InitialDataSourcePipe } from '@shared/pipes';
import { AerShipEmissionTableListItem, ShipEmissionTableListItem } from '@shared/types';

@Component({
  selector: 'mrtm-list-of-ships-table',
  imports: [
    ButtonDirective,
    MultiSelectTableComponent,
    RouterLink,
    LinkDirective,
    TagComponent,
    ShipTypePipe,
    StatusTagColorPipe,
    ShipTaskStatusPipe,
    FilterByShipComponent,
    PaginationComponent,
    WarningTextComponent,
    InitialDataSourcePipe,
    ScrollablePaneDirective,
  ],
  standalone: true,
  templateUrl: './list-of-ships-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListOfShipsTableComponent {
  readonly removeShips = output<MultiSelectedItem<ShipEmissionTableListItem | AerShipEmissionTableListItem>[]>();

  readonly editUrl = input.required<string>();
  readonly dataSource = input.required<(ShipEmissionTableListItem | AerShipEmissionTableListItem)[]>();
  readonly notCompletedWarningMessage = input<string>();

  readonly filter = signal<FilterByShip>(null);
  readonly sort = signal<SortEvent>({ column: 'status', direction: 'descending' });
  readonly pageSize = signal<number>(10);
  readonly currentPage = signal<number>(1);
  readonly totalItems = computed<number>(() => this.filteredData()?.length ?? 0);

  private readonly filteredData = computed<ShipEmissionTableListItem[]>(() => {
    const imoNumber = this.filter()?.imoNumber;
    return imoNumber ? this.dataSource().filter((item) => item.imoNumber === imoNumber) : this.dataSource();
  });

  readonly dataSupplierName = input<string>();
  readonly columns = computed(() => {
    return (
      this.dataSource()
        .map((x: AerShipEmissionTableListItem) => !!x.dataInputType)
        .filter(Boolean).length > 0
        ? LIST_OF_SHIPS_TABLE_COLUMNS_WITH_DATA_SOURCE
        : LIST_OF_SHIPS_TABLE_COLUMNS
    ) as GovukTableColumn<ShipEmissionTableListItem | AerShipEmissionTableListItem>[];
  });

  readonly hasExternalSystemData = computed(() => {
    return !!(this.dataSource() ?? []).find(
      (ship: AerShipEmissionTableListItem) => ship?.dataInputType === 'EXTERNAL_PROVIDER',
    );
  });

  readonly rows = computed<MultiSelectedItem<ShipEmissionTableListItem>[]>(() =>
    sortAndPaginateListWithShipNameAndStatus(
      [this.sort(), { column: 'name', direction: 'ascending' }],
      this.filteredData() ?? [],
      this.currentPage(),
      this.pageSize(),
    ),
  );

  handleRemoveShips(ships: MultiSelectedItem<ShipEmissionTableListItem>[]) {
    this.removeShips.emit(ships.filter((item) => item.isSelected));
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
  }

  onFilterChanged(filterValue: FilterByShip) {
    this.filter.set(filterValue);
  }
}
