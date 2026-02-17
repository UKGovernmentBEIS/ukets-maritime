import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { RegistryUpdatedEmissionsEventSubmittedRequestActionPayload } from '@mrtm/api';

import {
  SummaryListComponent,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

@Component({
  selector: 'mrtm-registry-emissions-updated-summary-template',
  imports: [SummaryListComponent, SummaryListRowKeyDirective, SummaryListRowDirective, SummaryListRowValueDirective],
  standalone: true,
  templateUrl: './registry-emissions-updated-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistryEmissionsUpdatedSummaryTemplateComponent {
  readonly data = input.required<RegistryUpdatedEmissionsEventSubmittedRequestActionPayload>();
}
