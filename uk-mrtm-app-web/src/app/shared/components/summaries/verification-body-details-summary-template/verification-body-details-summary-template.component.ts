import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { VerificationBodyDetails } from '@mrtm/api';

import {
  SummaryListComponent,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { CountryPipe } from '@shared/pipes';

@Component({
  selector: 'mrtm-verification-body-details-summary-template',
  imports: [
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    CountryPipe,
  ],
  standalone: true,
  templateUrl: './verification-body-details-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerificationBodyDetailsSummaryTemplateComponent {
  readonly data = input<VerificationBodyDetails>();
}
