import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import {
  SummaryListComponent,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { OperatorAccountsStore, selectActiveEmissionsPlanFiles, selectCurrentAccountEmp } from '@accounts/store';
import { SummaryDownloadFilesComponent } from '@shared/components';

@Component({
  selector: 'mrtm-active-emissions-plan',
  imports: [
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    SummaryDownloadFilesComponent,
  ],
  standalone: true,
  templateUrl: './active-emissions-plan.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActiveEmissionsPlanComponent {
  private readonly store: OperatorAccountsStore = inject(OperatorAccountsStore);
  readonly emp = toSignal(this.store.pipe(selectCurrentAccountEmp));
  readonly empFiles = toSignal(this.store.pipe(selectActiveEmissionsPlanFiles));
}
