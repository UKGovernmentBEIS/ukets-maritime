import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PageHeadingComponent } from '@netz/common/components';
import { ButtonDirective, TableComponent } from '@netz/govuk-components';

import { dataSuppliersQuery, DataSuppliersStore } from '@data-suppliers/+state';
import { DATA_SUPPLIERS_LIST_COLUMNS } from '@data-suppliers/data-suppliers-list/data-suppliers-list.constants';

@Component({
  selector: 'mrtm-data-suppliers-list',
  standalone: true,
  imports: [PageHeadingComponent, ButtonDirective, TableComponent, RouterLink, NgClass],
  templateUrl: './data-suppliers-list.component.html',
  styleUrl: './data-suppliers-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataSuppliersListComponent {
  private readonly store = inject(DataSuppliersStore);
  public readonly columns = DATA_SUPPLIERS_LIST_COLUMNS;
  public readonly data = this.store.select(dataSuppliersQuery.selectItems);
  public readonly isEditable = this.store.select(dataSuppliersQuery.selectIsEditable);
  public readonly visibleSecrets: Set<number> = new Set();
  public toggleShow(id: number): void {
    if (this.visibleSecrets.has(id)) {
      this.visibleSecrets.delete(id);
    } else {
      this.visibleSecrets.add(id);
    }
  }
}
