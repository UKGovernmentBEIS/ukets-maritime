import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, contentChild, input, output, TemplateRef } from '@angular/core';

import { GovukTableColumn, SortEvent } from '@netz/govuk-components';

@Component({
  selector: 'mrtm-multi-select-table',
  imports: [NgTemplateOutlet],
  standalone: true,
  templateUrl: './multi-select-table.component.html',
  styleUrl: './multi-select-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiSelectTableComponent<T extends { isSelected?: boolean }> {
  readonly caption = input<string>();
  readonly description = input<string>();
  readonly emptyTableText = input<string>();
  readonly columns = input<GovukTableColumn<Omit<T, 'isSelected'>>[]>();
  readonly data = input<Pick<T, GovukTableColumn<T>['field']>[]>();

  readonly sort = output<SortEvent>();
  readonly selectionChanged = output<Pick<T, GovukTableColumn<T>['field']>[]>();

  readonly template = contentChild(TemplateRef);

  sortedField: GovukTableColumn<T>['field'];
  sortedColumn: GovukTableColumn<T>['header'];
  sortingDirection: 'ascending' | 'descending';

  /**
   * Checks whether every item isSelected
   */
  isAllSelected() {
    return this.data().every((item) => item?.isSelected);
  }

  /**
   * Checks whether the status of master checkbox is in indeterminate state (checkboxes partially checked)
   */
  isIndeterminate() {
    const data = this.data();
    const selectedItemsLength = data.filter((obj) => obj?.isSelected === true)?.length;
    return selectedItemsLength > 0 && selectedItemsLength !== data.length;
  }

  /**
   * Toggles all switches off, if all are selected, otherwise toggles everything on
   */
  masterToggle() {
    this.isAllSelected()
      ? this.data().map((item) => (item.isSelected = false))
      : this.data().map((item) => (item.isSelected = true));

    this.selectionChanged.emit(this.data());
  }

  /**
   * Toggles a checkbox
   */
  toggle(item: T) {
    item.isSelected = !item?.isSelected;
    this.selectionChanged.emit(this.data());
  }

  sortBy(columnField: GovukTableColumn<T>['field']): void {
    this.sortingDirection =
      this.sortedField === columnField && this.sortingDirection === 'ascending' ? 'descending' : 'ascending';
    this.sortedField = columnField;
    this.sortedColumn = this.columns().find((column) => column.field === columnField).header;

    this.sort.emit({ column: this.sortedField, direction: this.sortingDirection });
  }
}
