import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { StatusTagColorPipe } from '@netz/common/pipes';
import {
  ButtonDirective,
  LinkDirective,
  PaginationComponent,
  SortEvent,
  TagComponent,
  WarningTextComponent,
} from '@netz/govuk-components';

import { LIST_OF_SHIPS_TABLE_COLUMNS } from '@requests/common/components/emissions/list-of-ships-table/list-of-ships-table.constants';
import { ShipTaskStatusPipe, ShipTypePipe } from '@requests/common/components/emissions/pipes';
import { FilterByShip, FilterByShipComponent } from '@requests/common/components/list-filter-forms/filter-by-ship';
import { sortAndPaginateListWithShipNameAndStatus } from '@requests/common/utils/sort-and-paginate-list-with-ship-name-and-status';
import { MultiSelectedItem, MultiSelectTableComponent } from '@shared/components';
import { ShipEmissionTableListItem } from '@shared/types';

@Component({
  selector: 'mrtm-list-of-ships-table',
  standalone: true,
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
  ],
  templateUrl: './list-of-ships-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListOfShipsTableComponent {
  readonly removeShips = output<MultiSelectedItem<ShipEmissionTableListItem>[]>();

  readonly editUrl = input.required<string>();
  readonly dataSource = input.required<ShipEmissionTableListItem[]>();
  readonly notCompletedWarningMessage = input<string>();

  readonly columns = LIST_OF_SHIPS_TABLE_COLUMNS;
  readonly filter = signal<FilterByShip>(null);
  readonly sort = signal<SortEvent>({ column: 'status', direction: 'descending' });
  readonly pageSize = signal<number>(10);
  readonly currentPage = signal<number>(1);
  readonly totalItems = computed<number>(() => this.filteredData()?.length ?? 0);

  private readonly filteredData = computed<ShipEmissionTableListItem[]>(() => {
    const imoNumber = this.filter()?.imoNumber;
    return imoNumber ? this.dataSource().filter((item) => item.imoNumber === imoNumber) : this.dataSource();
  });

  readonly rows = computed<MultiSelectedItem<ShipEmissionTableListItem>[]>(() =>
    sortAndPaginateListWithShipNameAndStatus(
      [{ column: 'name', direction: 'ascending' }],
      this.sort(),
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
