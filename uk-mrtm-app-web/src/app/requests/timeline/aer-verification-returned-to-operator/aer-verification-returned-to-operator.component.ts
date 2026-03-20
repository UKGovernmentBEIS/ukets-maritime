import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { RequestActionStore } from '@netz/common/store';
import {
  SummaryListComponent,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { aerVerificationReturnedToOperatorQuery } from '@requests/timeline/aer-verification-returned-to-operator/+state';

@Component({
  selector: 'mrtm-aer-verification-returned-to-operator',
  imports: [SummaryListComponent, SummaryListRowDirective, SummaryListRowKeyDirective, SummaryListRowValueDirective],
  standalone: true,
  templateUrl: './aer-verification-returned-to-operator.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AerVerificationReturnedToOperatorComponent {
  private readonly store: RequestActionStore = inject(RequestActionStore);
  readonly changesRequired = this.store.select(aerVerificationReturnedToOperatorQuery.selectChangesRequired);
}
