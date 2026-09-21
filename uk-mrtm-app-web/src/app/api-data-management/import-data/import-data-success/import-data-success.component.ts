import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  LinkDirective,
  PanelComponent,
  SummaryListComponent,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { ImportDataStore } from '@api-data-management/import-data/+state/import-data.store';

@Component({
  selector: 'mrtm-import-data-success',
  imports: [
    PanelComponent,
    RouterLink,
    LinkDirective,
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
  ],
  templateUrl: './import-data-success.component.html',
})
export class ImportDataSuccessComponent {
  private readonly store = inject(ImportDataStore);
  protected readonly data = signal(this.store.state);
}
