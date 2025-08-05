import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { StatusTagColorPipe } from '@netz/common/pipes';
import { ButtonDirective, LinkDirective, TagComponent } from '@netz/govuk-components';

import { LIST_OF_SHIPS_TABLE_COLUMNS } from '@requests/common/components/emissions/list-of-ships-table/list-of-ships-table.constants';
import { ShipTaskStatusPipe, ShipTypePipe } from '@requests/common/components/emissions/pipes';
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
  ],
  templateUrl: './list-of-ships-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListOfShipsTableComponent {
  @Output() readonly removeShips = new EventEmitter<MultiSelectedItem<ShipEmissionTableListItem>[]>();

  @Input({ required: true }) editUrl: string;
  @Input({ required: true }) set dataSource(value: MultiSelectedItem<ShipEmissionTableListItem>[]) {
    this.data.set(value);
  }

  data: WritableSignal<MultiSelectedItem<ShipEmissionTableListItem>[]> = signal([]);
  columns = LIST_OF_SHIPS_TABLE_COLUMNS;

  handleRemoveShips(ships: MultiSelectedItem<ShipEmissionTableListItem>[]) {
    this.removeShips.emit(ships.filter((item) => item.isSelected));
  }

  checkIsSelected(shipEmissionTableListItem: MultiSelectedItem<ShipEmissionTableListItem>): boolean {
    return !shipEmissionTableListItem.isSelected;
  }
}
