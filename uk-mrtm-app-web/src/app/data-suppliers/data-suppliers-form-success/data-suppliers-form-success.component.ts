import { ChangeDetectionStrategy, Component, computed, inject, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LinkDirective, PanelComponent } from '@netz/govuk-components';

import { dataSuppliersQuery, DataSuppliersStore } from '@data-suppliers/+state';

@Component({
  selector: 'mrtm-data-suppliers-form-success',
  standalone: true,
  imports: [PanelComponent, LinkDirective, RouterLink],
  templateUrl: './data-suppliers-form-success.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataSuppliersFormSuccessComponent implements OnDestroy {
  private readonly store = inject(DataSuppliersStore);
  public readonly dataSupplierName = computed(() => this.store.select(dataSuppliersQuery.selectNewItem)()?.name);

  ngOnDestroy(): void {
    this.store.resetNewItem();
  }
}
