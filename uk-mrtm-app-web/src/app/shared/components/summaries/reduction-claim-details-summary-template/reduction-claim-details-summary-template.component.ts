import { ChangeDetectionStrategy, Component, computed, input, output, Signal, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  LinkDirective,
  PaginationComponent,
  SummaryListComponent,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
  TableComponent,
} from '@netz/govuk-components';

import { PaginationStatePersistableComponent } from '@shared/abstraction';
import { SummaryDownloadFilesComponent } from '@shared/components';
import { provideReductionClaimDetailsSummaryColumns } from '@shared/components/summaries/reduction-claim-details-summary-template/reduction-claim-details-summary-template.consts';
import { BigNumberPipe, FuelOriginTitlePipe, InitialDataSourcePipe } from '@shared/pipes';
import { PersistablePaginationState } from '@shared/services';
import { ReductionClaimDetailsListItemDto, WithNeedsReview } from '@shared/types';

@Component({
  selector: 'mrtm-reduction-claim-details-summary-template',
  imports: [
    TableComponent,
    FuelOriginTitlePipe,
    BigNumberPipe,
    SummaryDownloadFilesComponent,
    LinkDirective,
    RouterLink,
    InitialDataSourcePipe,
    PaginationComponent,
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
  ],
  standalone: true,
  templateUrl: './reduction-claim-details-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReductionClaimDetailsSummaryTemplateComponent extends PaginationStatePersistableComponent {
  public readonly editable = input<boolean>(false);
  public readonly data = input<Array<WithNeedsReview<ReductionClaimDetailsListItemDto>>>();
  public readonly totalEmissions = input<string>();
  public readonly dataSupplierName = input<string>();
  public readonly withPagination = input<boolean>(true);
  public readonly columns = computed(() => provideReductionClaimDetailsSummaryColumns(this.editable()));
  public readonly handleChange = output<ReductionClaimDetailsListItemDto>();
  public readonly handleDelete = output<ReductionClaimDetailsListItemDto>();

  public readonly pageSize: Signal<number> = computed(() => (this.withPagination() ? 10 : Number.MAX_VALUE));
  public readonly totalItems: Signal<number> = computed(() => this.data()?.length ?? 0);
  public readonly currentPage = signal<number>(this.currentPersistableComponentState()?.currentPage ?? 1);
  public readonly paginatedData = computed(() => {
    const firstIndex = (this.currentPage() - 1) * this.pageSize();
    return (this.data() ?? []).slice(firstIndex, firstIndex + this.pageSize());
  });

  public onPageChange(page: number): void {
    this.currentPage.set(page);
  }

  public onDelete(event: Event, item: ReductionClaimDetailsListItemDto): void {
    event.preventDefault();
    this.handleDelete.emit(item);
  }

  public onChange(event: Event, item: ReductionClaimDetailsListItemDto): void {
    event.preventDefault();
    this.handleChange.emit(item);
  }

  onDefineRowAdditionalStyle(item: WithNeedsReview<ReductionClaimDetailsListItemDto>): string | string[] | undefined {
    return item?.needsReview ? 'needs-review' : undefined;
  }

  public getExtraState(): Pick<PersistablePaginationState, 'currentSorting' | 'activeFilters'> {
    return {};
  }
}
