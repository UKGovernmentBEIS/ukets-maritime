import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  EventEmitter,
  inject,
  Input,
  Output,
  TemplateRef,
} from '@angular/core';

import { GovukTableColumn, SortEvent } from './table.interface';

@Component({
  selector: 'govuk-table',
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent<T> {
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  @Input() columns: GovukTableColumn<T>[];
  @Input() data: Pick<T, GovukTableColumn<T>['field']>[];
  @Input() caption: string;
  @Input() description: string;
  @Input() emptyTableText: string;
  @Output() readonly sort = new EventEmitter<SortEvent>();
  @ContentChild(TemplateRef) template?: TemplateRef<{
    column: GovukTableColumn<T>;
    row: Pick<T, GovukTableColumn<T>['field']>;
    index: number;
  }>;

  sortedField: GovukTableColumn<T>['field'];
  sortedColumn: GovukTableColumn<T>['header'];
  sortingDirection: 'ascending' | 'descending';

  sortBy(columnField: GovukTableColumn<T>['field']): void {
    this.sortingDirection =
      this.sortedField === columnField && this.sortingDirection === 'ascending' ? 'descending' : 'ascending';
    this.sortedField = columnField;
    this.sortedColumn = this.columns.find((column) => column.field === columnField).header;

    this.changeDetectorRef.markForCheck();

    this.sort.emit({ column: this.sortedField, direction: this.sortingDirection });
  }
}
