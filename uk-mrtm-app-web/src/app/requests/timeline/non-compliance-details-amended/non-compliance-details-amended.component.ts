import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { GovukDatePipe } from '@netz/common/pipes';
import { RequestActionStore } from '@netz/common/store';
import {
  SummaryListComponent,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { nonComplianceDetailsMap } from '@requests/common/non-compliance';
import { nonComplianceDetailsAmendedQuery } from '@requests/timeline/non-compliance-details-amended/+state';
import { NotProvidedDirective } from '@shared/directives';
import { NonComplianceReasonPipe } from '@shared/pipes';

@Component({
  selector: 'mrtm-non-compliance-details-amended',
  standalone: true,
  imports: [
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    NotProvidedDirective,
    GovukDatePipe,
    NonComplianceReasonPipe,
  ],
  templateUrl: './non-compliance-details-amended.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NonComplianceDetailsAmendedComponent {
  private readonly store = inject(RequestActionStore);
  readonly map = nonComplianceDetailsMap;
  readonly nonComplianceDetailsBase = this.store.select(
    nonComplianceDetailsAmendedQuery.selectNonComplianceDetailsBase,
  );
}
