import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';

import { GovukDatePipe } from '@netz/common/pipes';
import { GovukTableColumn, PaginationComponent, TableComponent } from '@netz/govuk-components';

import { MANDATE_REGISTERED_OWNERS_TABLE_COLUMNS } from '@requests/common/components/mandate';
import { SummaryRegisteredOwnerShipDetailsComponent } from '@shared/components';
import { HTML_DIFF, HtmlDiffDirective } from '@shared/directives';
import { DiffItem, MandateRegisteredOwnerTableListItem } from '@shared/types';
import { mergeDiffRegisteredOwners } from '@shared/utils';

@Component({
  selector: 'mrtm-mandate-registered-owners-list-summary-template',
  imports: [
    TableComponent,
    GovukDatePipe,
    PaginationComponent,
    HtmlDiffDirective,
    SummaryRegisteredOwnerShipDetailsComponent,
  ],
  standalone: true,
  templateUrl: './mandate-registered-owners-list-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MandateRegisteredOwnersListSummaryTemplateComponent {
  private readonly hasHtmlDiff = inject(HTML_DIFF, { optional: true });

  readonly registeredOwnerItems = input.required<Array<MandateRegisteredOwnerTableListItem>>();
  readonly originalRegisteredOwnerItems = input<Array<MandateRegisteredOwnerTableListItem>>([]);
  readonly isEditable = input<boolean>(false);

  readonly columns = MANDATE_REGISTERED_OWNERS_TABLE_COLUMNS as GovukTableColumn<
    DiffItem<MandateRegisteredOwnerTableListItem>
  >[];
  readonly combinedOwners: Signal<DiffItem<MandateRegisteredOwnerTableListItem>[]> = computed(() =>
    mergeDiffRegisteredOwners(this.registeredOwnerItems(), this.hasHtmlDiff ? this.originalRegisteredOwnerItems() : []),
  );
  readonly pageSize: number = 10;
  readonly totalItems: Signal<number> = computed(() => this.combinedOwners()?.length ?? 0);
  readonly currentPage: WritableSignal<number> = signal<number>(1);
  readonly page: Signal<DiffItem<MandateRegisteredOwnerTableListItem>[]> = computed(() => {
    const tableData = [...(this.combinedOwners() ?? [])].sort((a, b) =>
      a?.current?.name?.localeCompare(b?.current?.name, 'en', { sensitivity: 'base', numeric: true }),
    );
    const currentPage = this.currentPage();

    const firstIndex = (currentPage - 1) * this.pageSize;
    const lastIndex = Math.min(firstIndex + this.pageSize, tableData?.length);

    return tableData?.length > firstIndex ? tableData.slice(firstIndex, lastIndex) : [];
  });

  onPageChange(page: number): void {
    this.currentPage.set(page);
  }

  onDefineRowAdditionalStyle(item: DiffItem<MandateRegisteredOwnerTableListItem>): string | string[] | undefined {
    return item?.current?.needsReview ? 'needs-review' : undefined;
  }
}
