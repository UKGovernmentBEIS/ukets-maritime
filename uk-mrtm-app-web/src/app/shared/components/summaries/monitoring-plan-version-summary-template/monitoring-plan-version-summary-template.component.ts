import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { AerMonitoringPlanVersion } from '@mrtm/api';

import { GovukDatePipe } from '@netz/common/pipes';
import {
  SummaryListComponent,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

@Component({
  selector: 'mrtm-monitoring-plan-version-summary-template',
  imports: [
    GovukDatePipe,
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
  ],
  standalone: true,
  templateUrl: './monitoring-plan-version-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonitoringPlanVersionSummaryTemplateComponent {
  readonly monitoringPlanVersion = input.required<AerMonitoringPlanVersion>();
}
