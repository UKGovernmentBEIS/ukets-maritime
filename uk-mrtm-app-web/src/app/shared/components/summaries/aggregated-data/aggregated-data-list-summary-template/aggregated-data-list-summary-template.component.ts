import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  InputSignal,
  output,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { PendingButtonDirective } from '@netz/common/directives';
import { StatusTagColorPipe, StatusTagTextPipe } from '@netz/common/pipes';
import {
  ButtonDirective,
  GovukTableColumn,
  LinkDirective,
  PaginationComponent,
  SortEvent,
  TableComponent,
  TagComponent,
} from '@netz/govuk-components';

import { MultiSelectedItem, MultiSelectTableComponent } from '@shared/components';
import { provideAerAggregatedDataColumns } from '@shared/components/summaries/aggregated-data/aggregated-data-list-summary-template/aggregated-data-list-summary-template.consts';
import { BigNumberPipe } from '@shared/pipes';
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
    StatusTagTextPipe,
    NgTemplateOutlet,
    PendingButtonDirective,
    MultiSelectTableComponent,
    RouterLink,
  ],
  templateUrl: './aggregated-data-list-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AggregatedDataListSummaryTemplateComponent {
  public readonly deleteItems = output<AerAggregatedDataSummaryItemDto[]>();
  public readonly data: InputSignal<Array<MultiSelectedItem<AerAggregatedDataSummaryItemDto>>> =
    input<Array<MultiSelectedItem<AerAggregatedDataSummaryItemDto>>>();
  public readonly header: InputSignal<string> = input<string>();
  public readonly editable: InputSignal<boolean> = input<boolean>();
  public readonly pageSize: InputSignal<number> = input<number>(10);
  public readonly editPath: InputSignal<string> = input<string>();
  public readonly sort: WritableSignal<SortEvent> = signal<SortEvent>(undefined);
  public readonly currentPage: WritableSignal<number> = signal<number>(1);
  public readonly totalItems: Signal<number> = computed(() => this.data()?.length ?? 0);
  public readonly columns: Signal<Array<GovukTableColumn>> = computed(() =>
    provideAerAggregatedDataColumns(this.data()?.length > 0),
  );

  public checkIsSelected(item: MultiSelectedItem<AerAggregatedDataSummaryItemDto>): boolean {
    return !item.isSelected;
  }

  public readonly rows = computed(() => {
    const sorting = this.sort();
    const tableData = (this.data() ?? []).sort((a, b) => {
      if (!sorting) return 0;

      const diff = a[sorting.column].localeCompare(b[sorting.column], 'en-GB', { sensitivity: 'base' });
      return diff * (sorting.direction === 'ascending' ? 1 : -1);
    });

    const currentPage = this.currentPage();
    const pageSize = this.pageSize();

    const firstIndex = (currentPage - 1) * pageSize;
    const lastIndex = Math.min(firstIndex + pageSize, tableData?.length);

    return tableData?.length > firstIndex ? tableData.slice(firstIndex, lastIndex) : [];
  });

  public onPageChange(page: number): void {
    this.currentPage.set(page);
  }

  public onDelete(rows: Array<MultiSelectedItem<AerAggregatedDataSummaryItemDto>>): void {
    this.deleteItems.emit(rows.filter((x) => x.isSelected));
  }
}
