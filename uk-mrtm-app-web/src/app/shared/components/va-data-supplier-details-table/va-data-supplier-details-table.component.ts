import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LinkDirective, TableComponent } from '@netz/govuk-components';

import { getDataSupplierColumns } from '@shared/components/va-data-supplier-details-table/va-data-supplier-details-table.constants';

@Component({
  selector: 'mrtm-va-data-supplier-details-table',
  imports: [RouterLink, TableComponent, LinkDirective],
  templateUrl: './va-data-supplier-details-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VaDataSupplierDetailsTableComponent {
  readonly routePrefix = input<string>();
  readonly withUserType = input<boolean>(false);
  readonly editable = input<boolean>(false);
  readonly data = input.required<Array<{ id?: number; name?: string; userType?: string }>>();
  readonly columns = computed(() => getDataSupplierColumns(this.editable(), this.withUserType()));
}
