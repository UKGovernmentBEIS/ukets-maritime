import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  Signal,
  signal,
  untracked,
  WritableSignal,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { take } from 'rxjs';

import { PageHeadingComponent } from '@netz/common/components';
import { GovukDatePipe } from '@netz/common/pipes';
import {
  ButtonDirective,
  GovukTableColumn,
  LinkDirective,
  PaginationComponent,
  TableComponent,
} from '@netz/govuk-components';

import { batchVariationsQuery, BatchVariationStore } from '@batch-variations/+state';
import { PAGE_SIZE, TABLE_COLUMNS } from '@batch-variations/batch-variations.consts';
import { BatchVariationService } from '@batch-variations/services/batch-variation.service';

interface ViewModel {
  columns: Array<GovukTableColumn>;
  data?: Array<any>;
  totalItems?: number;
  canInitiateBatchReissue?: boolean;
}

@Component({
  selector: 'mrtm-batch-variations-list',
  standalone: true,
  imports: [
    PageHeadingComponent,
    ButtonDirective,
    RouterLink,
    TableComponent,
    PaginationComponent,
    LinkDirective,
    GovukDatePipe,
  ],
  templateUrl: './batch-variations-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BatchVariationsListComponent {
  private readonly store = inject(BatchVariationStore);
  private readonly service = inject(BatchVariationService);
  public readonly pageSize = PAGE_SIZE;
  private readonly currentPage: WritableSignal<number> = signal(
    this.store.select(batchVariationsQuery.selectCurrentPage)(),
  );

  constructor() {
    effect(() => {
      if (this.currentPage() === this.store.select(batchVariationsQuery.selectCurrentPage)()) {
        return;
      }
      untracked(() => {
        this.service.loadBatchVariations(this.currentPage()).pipe(take(1)).subscribe();
      });
    });
  }

  public vm: Signal<ViewModel> = computed(() => ({
    columns: TABLE_COLUMNS,
    data: this.store.select(batchVariationsQuery.selectItems)(),
    totalItems: this.store.select(batchVariationsQuery.selectTotalItems)(),
    canInitiateBatchReissue: this.store.select(batchVariationsQuery.selectCanInitiateBatchReissue)(),
  }));

  public onPageChanged(page: number): void {
    this.currentPage.set(page - 1);
  }
}
