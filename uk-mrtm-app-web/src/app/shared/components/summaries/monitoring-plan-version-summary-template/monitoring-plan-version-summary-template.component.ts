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
  standalone: true,
  imports: [
    GovukDatePipe,
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
  ],
  templateUrl: './monitoring-plan-version-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonitoringPlanVersionSummaryTemplateComponent {
  readonly monitoringPlanVersion = input.required<AerMonitoringPlanVersion>();
}
