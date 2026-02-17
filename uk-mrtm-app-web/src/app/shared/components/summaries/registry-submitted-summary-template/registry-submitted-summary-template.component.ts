import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { EmpIssuanceSendRegistryAccountOpeningEventRequestActionPayload } from '@mrtm/api';

import { GovukDatePipe } from '@netz/common/pipes';
import {
  SummaryListComponent,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import {
  CompetentAuthorityPipe,
  CountryPipe,
  LegalStatusTypeDisplayTextPipe,
  OrganisationDetailsAddressTitlePipe,
} from '@shared/pipes';

@Component({
  selector: 'mrtm-registry-submitted-summary-template',
  imports: [
    CompetentAuthorityPipe,
    SummaryListComponent,
    SummaryListRowKeyDirective,
    SummaryListRowDirective,
    SummaryListRowValueDirective,
    LegalStatusTypeDisplayTextPipe,
    GovukDatePipe,
    OrganisationDetailsAddressTitlePipe,
    CountryPipe,
  ],
  standalone: true,
  templateUrl: './registry-submitted-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrySubmittedSummaryTemplateComponent {
  readonly data = input.required<EmpIssuanceSendRegistryAccountOpeningEventRequestActionPayload>();
}
