import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { EmpRegisteredOwner } from '@mrtm/api';

import { GovukDatePipe } from '@netz/common/pipes';
import { GovukTableColumn, LinkDirective, PaginationComponent, TableComponent } from '@netz/govuk-components';

import {
  MANDATE_REGISTERED_OWNERS_TABLE_COLUMNS,
  MANDATE_REGISTERED_OWNERS_TABLE_COLUMNS_WITH_ACTIONS,
} from '@requests/common/components/mandate/mandate-registered-owners-table.constants';
import { SummaryRegisteredOwnerShipDetailsComponent } from '@shared/components';
import { MandateRegisteredOwnerTableListItem } from '@shared/types';

@Component({
  selector: 'mrtm-mandate-registered-owners-table',
  imports: [
    TableComponent,
    GovukDatePipe,
    RouterLink,
    LinkDirective,
    PaginationComponent,
    SummaryRegisteredOwnerShipDetailsComponent,
  ],
  standalone: true,
  templateUrl: './mandate-registered-owners-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MandateRegisteredOwnersTableComponent {
  readonly registeredOwnerItems = input<Array<MandateRegisteredOwnerTableListItem>>([]);
  readonly isEditable = input<boolean>(false);

  readonly delete = output<EmpRegisteredOwner>();
  readonly edit = output<EmpRegisteredOwner>();

  readonly columns: Signal<Array<GovukTableColumn<MandateRegisteredOwnerTableListItem>>> = computed(() =>
    this.isEditable() ? MANDATE_REGISTERED_OWNERS_TABLE_COLUMNS_WITH_ACTIONS : MANDATE_REGISTERED_OWNERS_TABLE_COLUMNS,
  );
  readonly pageSize: number = 10;
  readonly totalItems: Signal<number> = computed(() => this.registeredOwnerItems()?.length ?? 0);
  readonly currentPage: WritableSignal<number> = signal<number>(1);
  readonly page: Signal<Array<MandateRegisteredOwnerTableListItem>> = computed(() => {
    const tableData = [...(this.registeredOwnerItems() ?? [])].sort((a, b) =>
      a?.name?.localeCompare(b?.name, 'en', { sensitivity: 'base', numeric: true }),
    );
    const currentPage = this.currentPage();

    const firstIndex = (currentPage - 1) * this.pageSize;
    const lastIndex = Math.min(firstIndex + this.pageSize, tableData?.length);

    return tableData?.length > firstIndex ? tableData.slice(firstIndex, lastIndex) : [];
  });

  onEdit(item: EmpRegisteredOwner): void {
    this.edit.emit(item);
  }

  onDelete(item: EmpRegisteredOwner): void {
    this.delete.emit(item);
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
  }

  onDefineRowAdditionalStyle(item: MandateRegisteredOwnerTableListItem): string | string[] | undefined {
    return item?.needsReview ? 'needs-review' : undefined;
  }
}
