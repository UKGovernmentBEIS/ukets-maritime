import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output, Signal, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AerPortVisit } from '@mrtm/api';

import { PendingButtonDirective } from '@netz/common/directives';
import { GovukDatePipe, StatusTagColorPipe } from '@netz/common/pipes';
import {
  ButtonDirective,
  GovukSelectOption,
  LinkDirective,
  PaginationComponent,
  SortEvent,
  SummaryListComponent,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
  TableComponent,
  TagComponent,
  WarningTextComponent,
} from '@netz/govuk-components';

import { sortAndPaginateListWithShipNameAndStatus } from '@requests/common/utils/sort-and-paginate-list-with-ship-name-and-status';
import { MultiSelectedItem, MultiSelectTableComponent } from '@shared/components';
import { VOYAGES_SUMMARY_COLUMNS } from '@shared/components/summaries/ports-and-voyages/voyages-list-summary-template/voyages-list-summary-template.consts';
import { AER_PORT_CODE_SELECT_ITEMS, AER_PORT_COUNTRY_SELECT_ITEMS } from '@shared/constants';
import { AerPortVoyageAggregatedStatusPipe, BigNumberPipe, SelectOptionToTitlePipe } from '@shared/pipes';
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
    AerPortVoyageAggregatedStatusPipe,
    GovukDatePipe,
    WarningTextComponent,
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
  readonly emptyTableText = input<string>('No items to display');
  readonly warningMessages = input<string[]>([]);
  readonly columns = VOYAGES_SUMMARY_COLUMNS;
  readonly countrySelectItems: Array<GovukSelectOption<AerPortVisit['country']>> = AER_PORT_COUNTRY_SELECT_ITEMS;
  readonly portSelectItems: Array<GovukSelectOption<AerPortVisit['port']>> = AER_PORT_CODE_SELECT_ITEMS;

  readonly totalItems: Signal<number> = computed(() => this.data()?.length ?? 0);
  readonly currentPage = signal<number>(1);
  readonly sort = signal<SortEvent>({ column: 'status', direction: 'descending' });
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

  readonly rows = computed<Array<MultiSelectedItem<AerVoyageSummaryItemDto>>>(() =>
    sortAndPaginateListWithShipNameAndStatus(this.sort(), this.data() ?? [], this.currentPage(), this.pageSize()),
  );

  onPageChange(page: number): void {
    this.currentPage.set(page);
  }

  onDelete(rows: Array<MultiSelectedItem<AerVoyageSummaryItemDto>>): void {
    this.deleteItems.emit(rows.filter((row) => row.isSelected));
  }
}
