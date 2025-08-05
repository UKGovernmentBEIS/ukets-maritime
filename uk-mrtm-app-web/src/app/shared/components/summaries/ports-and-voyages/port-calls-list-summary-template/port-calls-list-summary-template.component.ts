import { DatePipe, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output, Signal, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AerPortVisit } from '@mrtm/api';

import { PendingButtonDirective } from '@netz/common/directives';
import { StatusTagColorPipe, StatusTagTextPipe } from '@netz/common/pipes';
import {
  ButtonDirective,
  GovukSelectOption,
  GovukTableColumn,
  LinkDirective,
  PaginationComponent,
  SortEvent,
  SummaryListComponent,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
  TableComponent,
  TagComponent,
} from '@netz/govuk-components';

import { MultiSelectedItem, MultiSelectTableComponent } from '@shared/components';
import { PORTS_SUMMARY_COLUMNS } from '@shared/components/summaries/ports-and-voyages/port-calls-list-summary-template/port-calls-list-summary-template.consts';
import { AER_PORT_CODE_SELECT_ITEMS, AER_PORT_COUNTRY_SELECT_ITEMS } from '@shared/constants';
import { BigNumberPipe, SelectOptionToTitlePipe } from '@shared/pipes';
import { AerPortSummaryItemDto } from '@shared/types';
import BigNumber from 'bignumber.js';

@Component({
  selector: 'mrtm-port-calls-list-summary-template',
  standalone: true,
  imports: [
    PaginationComponent,
    LinkDirective,
    RouterLink,
    SelectOptionToTitlePipe,
    TagComponent,
    StatusTagColorPipe,
    StatusTagTextPipe,
    ButtonDirective,
    MultiSelectTableComponent,
    PendingButtonDirective,
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    BigNumberPipe,
    TableComponent,
    NgTemplateOutlet,
    DatePipe,
  ],
  templateUrl: './port-calls-list-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortCallsListSummaryTemplateComponent {
  readonly deleteItems = output<AerPortSummaryItemDto[]>();
  readonly header = input<string>();
  readonly data = input.required<Array<MultiSelectedItem<AerPortSummaryItemDto>>>();
  readonly editable = input<boolean>(false);
  readonly pageSize = input<number>(10);
  readonly editPath = input<string>();
  readonly columns: Signal<Array<GovukTableColumn>> = computed(() =>
    this.data()?.length ? PORTS_SUMMARY_COLUMNS : PORTS_SUMMARY_COLUMNS.map((col) => ({ ...col, isSortable: false })),
  );
  readonly countrySelectItems: Array<GovukSelectOption<AerPortVisit['country']>> = AER_PORT_COUNTRY_SELECT_ITEMS;
  readonly portSelectItems: Array<GovukSelectOption<AerPortVisit['port']>> = AER_PORT_CODE_SELECT_ITEMS;

  readonly totalItems: Signal<number> = computed(() => this.data()?.length ?? 0);
  readonly currentPage = signal<number>(1);
  readonly sort = signal<SortEvent>(undefined);
  readonly totalEmissionsSummary: Signal<Pick<AerPortSummaryItemDto, 'totalEmissions' | 'surrenderEmissions'>> =
    computed(() => {
      const allItems = this.data() ?? [];

      return !allItems.length
        ? undefined
        : allItems
            .map(({ totalEmissions, surrenderEmissions }) => ({ totalEmissions, surrenderEmissions }))
            .reduce((acc, current) => ({
              surrenderEmissions: new BigNumber(acc?.surrenderEmissions ?? 0)
                .plus(current?.surrenderEmissions ?? 0)
                .toString(),
              totalEmissions: new BigNumber(acc?.totalEmissions ?? 0).plus(current?.totalEmissions ?? 0).toString(),
            }));
    });

  readonly rows = computed(() => {
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

  onPageChange(page: number): void {
    this.currentPage.set(page);
  }

  onDelete(rows: Array<MultiSelectedItem<AerPortSummaryItemDto>>): void {
    this.deleteItems.emit(rows.filter((x) => x.isSelected));
  }

  checkIsSelected(item: MultiSelectedItem<AerPortSummaryItemDto>): boolean {
    return !item.isSelected;
  }
}
