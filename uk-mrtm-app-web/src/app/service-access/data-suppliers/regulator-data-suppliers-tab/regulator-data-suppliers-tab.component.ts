import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { take } from 'rxjs';

import { ButtonDirective, TableComponent } from '@netz/govuk-components';

import { dataSuppliersQuery, DataSuppliersStore } from '@service-access/data-suppliers/+state';
import { DATA_SUPPLIERS_LIST_COLUMNS } from '@service-access/data-suppliers/regulator-data-suppliers-tab/regulator-data-suppliers-tab.constants';
import { DataSuppliersService } from '@service-access/data-suppliers/services/data-suppliers.service';

@Component({
  selector: 'mrtm-regulator-data-suppliers-tab',
  imports: [ButtonDirective, TableComponent, RouterLink],
  standalone: true,
  templateUrl: './regulator-data-suppliers-tab.component.html',
  styleUrl: './regulator-data-suppliers-tab.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegulatorDataSuppliersTabComponent {
  private readonly store = inject(DataSuppliersStore);
  public readonly columns = DATA_SUPPLIERS_LIST_COLUMNS;
  public readonly data = this.store.select(dataSuppliersQuery.selectItems);
  public readonly isEditable = this.store.select(dataSuppliersQuery.selectIsEditable);

  constructor() {
    // The list is rendered inside a lazy tab, so the load that used to run in
    // the route guard happens on first tab activation instead
    inject(DataSuppliersService).loadItems().pipe(take(1)).subscribe();
  }
}
