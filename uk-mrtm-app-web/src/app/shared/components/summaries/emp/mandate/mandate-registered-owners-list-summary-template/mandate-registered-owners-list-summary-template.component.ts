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

import { MANDATE_REGISTERED_OWNERS_TABLE_COLUMNS } from '@shared/components/summaries/emp/mandate/mandate-registered-owners-list-summary-template/mandate-registered-owners-list-summary-template.constans';

type MandateRegisteredOwnerRowItem = EmpRegisteredOwner & { actions?: boolean; needsReview?: boolean };

@Component({
  selector: 'mrtm-mandate-registered-owners-list-summary-template',
  standalone: true,
  imports: [TableComponent, GovukDatePipe, RouterLink, LinkDirective, PaginationComponent],
  templateUrl: './mandate-registered-owners-list-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MandateRegisteredOwnersListSummaryTemplateComponent {
  public readonly delete = output<EmpRegisteredOwner>();
  public readonly edit = output<EmpRegisteredOwner>();

  public readonly data = input<Array<MandateRegisteredOwnerRowItem>>([]);
  public readonly isEditable = input<boolean>(false);
  public readonly columns: Signal<Array<GovukTableColumn<MandateRegisteredOwnerRowItem>>> = computed(() =>
    this.isEditable()
      ? [
          ...MANDATE_REGISTERED_OWNERS_TABLE_COLUMNS,
          {
            field: 'actions',
            widthClass: 'app-column-width-10-per',
            header: null,
          },
        ]
      : MANDATE_REGISTERED_OWNERS_TABLE_COLUMNS,
  );

  public readonly expandedAssociatedShips: Set<EmpRegisteredOwner['uniqueIdentifier']> = new Set();

  public readonly pageSize: number = 10;
  public readonly totalItems: Signal<number> = computed(() => this.data()?.length ?? 0);
  public readonly currentPage: WritableSignal<number> = signal<number>(1);
  public readonly page: Signal<Array<MandateRegisteredOwnerRowItem>> = computed(() => {
    const tableData = this.data();
    const currentPage = this.currentPage();

    const firstIndex = (currentPage - 1) * this.pageSize;
    const lastIndex = Math.min(firstIndex + this.pageSize, tableData?.length);

    return tableData?.length > firstIndex ? tableData.slice(firstIndex, lastIndex) : [];
  });

  public onEdit(item: EmpRegisteredOwner): void {
    this.edit.emit(item);
  }

  public onDelete(item: EmpRegisteredOwner): void {
    this.delete.emit(item);
  }

  public onPageChange(page: number): void {
    this.currentPage.set(page);
  }

  public onToggleAssociatedShips(event: MouseEvent, registeredOwnerId: EmpRegisteredOwner['uniqueIdentifier']): void {
    event.preventDefault();
    event.stopPropagation();

    if (this.expandedAssociatedShips.has(registeredOwnerId)) {
      this.expandedAssociatedShips.delete(registeredOwnerId);
    } else {
      this.expandedAssociatedShips.add(registeredOwnerId);
    }
  }

  public onDefineRowAdditionalStyle(item: MandateRegisteredOwnerRowItem): string | string[] | undefined {
    return item?.needsReview ? 'needs-review' : undefined;
  }
}
