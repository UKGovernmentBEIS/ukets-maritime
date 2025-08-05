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
import { PortVoyageTaskStatusPipe } from '@shared/components/summaries/ports-and-voyages/pipes/port-voyage-task-status.pipe';
import { provideVoyagesSummaryColumns } from '@shared/components/summaries/ports-and-voyages/voyages-list-summary-template/voyages-list-summary-template.consts';
import { AER_PORT_CODE_SELECT_ITEMS, AER_PORT_COUNTRY_SELECT_ITEMS } from '@shared/constants';
import { BigNumberPipe, SelectOptionToTitlePipe } from '@shared/pipes';
import { AerVoyageSummaryItemDto } from '@shared/types';
import BigNumber from 'bignumber.js';

@Component({
  selector: 'mrtm-voyages-list-summary-template',
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
    PortVoyageTaskStatusPipe,
  ],
  templateUrl: './voyages-list-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VoyagesListSummaryTemplateComponent {
  readonly deleteItems = output<AerVoyageSummaryItemDto[]>();
  readonly data = input.required<Array<MultiSelectedItem<AerVoyageSummaryItemDto>>>();
  readonly editable = input<boolean>(false);
  readonly pageSize = input<number>(10);
  readonly editPath = input<string>();
  readonly columns: Signal<Array<GovukTableColumn>> = computed(() =>
    provideVoyagesSummaryColumns(this.data()?.length > 0),
  );
  readonly countrySelectItems: Array<GovukSelectOption<AerPortVisit['country']>> = AER_PORT_COUNTRY_SELECT_ITEMS;
  readonly portSelectItems: Array<GovukSelectOption<AerPortVisit['port']>> = AER_PORT_CODE_SELECT_ITEMS;

  readonly totalItems: Signal<number> = computed(() => this.data()?.length ?? 0);
  readonly currentPage = signal<number>(1);
  readonly sort = signal<SortEvent>(undefined);
  readonly totalEmissionsSummary: Signal<Pick<AerVoyageSummaryItemDto, 'totalEmissions' | 'surrenderEmissions'>> =
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

  onDelete(rows: Array<MultiSelectedItem<AerVoyageSummaryItemDto>>): void {
    this.deleteItems.emit(rows.filter((x) => x.isSelected));
  }

  checkIsSelected(item: MultiSelectedItem<AerVoyageSummaryItemDto>): boolean {
    return !item.isSelected;
  }
}
