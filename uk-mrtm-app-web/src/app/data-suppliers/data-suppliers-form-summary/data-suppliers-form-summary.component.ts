import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { PageHeadingComponent } from '@netz/common/components';
import { PendingButtonDirective } from '@netz/common/directives';
import {
  ButtonDirective,
  LinkDirective,
  SummaryListColumnValueDirective,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
} from '@netz/govuk-components';

import { dataSuppliersQuery, DataSuppliersStore } from '@data-suppliers/+state';
import { DataSuppliersService } from '@data-suppliers/services/data-suppliers.service';

@Component({
  selector: 'mrtm-data-suppliers-form-summary',
  standalone: true,
  imports: [
    PageHeadingComponent,
    LinkDirective,
    RouterLink,
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListColumnValueDirective,
    SummaryListRowActionsDirective,
    ButtonDirective,
    PendingButtonDirective,
  ],
  templateUrl: './data-suppliers-form-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataSuppliersFormSummaryComponent {
  private readonly store = inject(DataSuppliersStore);
  private readonly service = inject(DataSuppliersService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  public readonly data = this.store.select(dataSuppliersQuery.selectNewItem);

  onSubmit(): void {
    this.service
      .addNewItem(this.data())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.router.navigate(['../', 'success'], { relativeTo: this.route });
      });
  }
}
