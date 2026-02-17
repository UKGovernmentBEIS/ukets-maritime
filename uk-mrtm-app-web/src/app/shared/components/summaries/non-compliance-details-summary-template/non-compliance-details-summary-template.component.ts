import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { GovukDatePipe } from '@netz/common/pipes';
import {
  LinkDirective,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import {
  nonComplianceDetailsMap,
  NonComplianceDetailsStep,
  NonComplianceDetailsSummary,
} from '@requests/common/non-compliance';
import { NotProvidedDirective } from '@shared/directives';
import { BooleanToTextPipe, NonComplianceReasonPipe, RequestNamePipe } from '@shared/pipes';

@Component({
  selector: 'mrtm-non-compliance-details-summary-template',
  imports: [
    LinkDirective,
    SummaryListComponent,
    SummaryListRowActionsDirective,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    NotProvidedDirective,
    RouterLink,
    BooleanToTextPipe,
    GovukDatePipe,
    NonComplianceReasonPipe,
    RequestNamePipe,
  ],
  standalone: true,
  templateUrl: './non-compliance-details-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NonComplianceDetailsSummaryTemplateComponent {
  readonly data = input.required<NonComplianceDetailsSummary>();
  readonly isEditable = input<boolean>(false);
  readonly queryParams = input<Params>({ change: true });

  readonly wizardStep = NonComplianceDetailsStep;
  readonly map = nonComplianceDetailsMap;
}
