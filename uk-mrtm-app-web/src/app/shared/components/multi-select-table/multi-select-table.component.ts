import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
} from '@angular/core';

import { GovukTableColumn, SortEvent } from '@netz/govuk-components';

@Component({
  selector: 'mrtm-multi-select-table',
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: './multi-select-table.component.html',
  styleUrl: './multi-select-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiSelectTableComponent<T extends { isSelected?: boolean }> {
  @Input() caption: string;
  @Input() description: string;
  @Input() emptyTableText: string;
  @Input() columns: GovukTableColumn<Omit<T, 'isSelected'>>[];
  @Input() data: Pick<T, GovukTableColumn<T>['field']>[];

  @Output() readonly sort = new EventEmitter<SortEvent>();
  @ContentChild(TemplateRef) template?: TemplateRef<{
    column: GovukTableColumn<T>;
    row: Pick<T, GovukTableColumn<T>['field']>;
    index: number;
  }>;

  sortedField: GovukTableColumn<T>['field'];
  sortedColumn: GovukTableColumn<T>['header'];
  sortingDirection: 'ascending' | 'descending';

  /**
   * Checks whether every item isSelected
   */
  isAllSelected() {
    return this.data.every((item) => item?.isSelected);
  }

  /**
   * Checks whether the status of master checkbox is in indeterminate state (checkboxes partially checked)
   */
  isIndeterminate() {
    const selectedItemsLength = this.data.filter((obj) => obj?.isSelected === true)?.length;
    return selectedItemsLength > 0 && selectedItemsLength !== this.data.length;
  }

  /**
   * Toggles all switches off, if all are selected, otherwise toggles everything on
   */
  masterToggle() {
    this.isAllSelected()
      ? this.data.map((item) => (item.isSelected = false))
      : this.data.map((item) => (item.isSelected = true));
  }

  /**
   * Toggles a checkbox
   */
  toggle(item: T) {
    item.isSelected = !item?.isSelected;
  }

  sortBy(columnField: GovukTableColumn<T>['field']): void {
    this.sortingDirection =
      this.sortedField === columnField && this.sortingDirection === 'ascending' ? 'descending' : 'ascending';
    this.sortedField = columnField;
    this.sortedColumn = this.columns.find((column) => column.field === columnField).header;

    this.sort.emit({ column: this.sortedField, direction: this.sortingDirection });
  }
}
