import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { AerComplianceMonitoringReporting } from '@mrtm/api';

import {
  LinkDirective,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { ComplianceMonitoringReportingStep } from '@requests/common/aer/subtasks/compliance-monitoring-reporting/compliance-monitoring-reporting.helpers';
import { complianceMonitoringReportingMap } from '@requests/common/aer/subtasks/compliance-monitoring-reporting/compliance-monitoring-reporting-subtask-list.map';
import { NotProvidedDirective } from '@shared/directives';
import { ComplianceToTextPipe } from '@shared/pipes';

@Component({
  selector: 'mrtm-compliance-monitoring-reporting-summary-template',
  standalone: true,
  imports: [
    LinkDirective,
    RouterLink,
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    SummaryListRowActionsDirective,
    NotProvidedDirective,
    ComplianceToTextPipe,
  ],
  templateUrl: './compliance-monitoring-reporting-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComplianceMonitoringReportingSummaryTemplateComponent {
  readonly data = input<AerComplianceMonitoringReporting>();
  readonly isEditable = input<boolean>(false);
  readonly queryParams = input<Params>({ change: true });

  readonly wizardStep = ComplianceMonitoringReportingStep;
  readonly map = complianceMonitoringReportingMap;
}
