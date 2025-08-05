import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { AerMonitoringPlanChanges, AerMonitoringPlanVersion } from '@mrtm/api';

import {
  LinkDirective,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { monitoringPlanChangesMap } from '@requests/common/aer/subtasks/aer-subtasks-list.map';
import { MonitoringPlanVersionSummaryTemplateComponent } from '@shared/components/summaries/monitoring-plan-version-summary-template';
import { NotProvidedDirective } from '@shared/directives';
import { BooleanToTextPipe } from '@shared/pipes';

@Component({
  selector: 'mrtm-monitoring-plan-changes-summary-template',
  standalone: true,
  imports: [
    BooleanToTextPipe,
    LinkDirective,
    RouterLink,
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    SummaryListRowActionsDirective,
    MonitoringPlanVersionSummaryTemplateComponent,
    NotProvidedDirective,
  ],
  templateUrl: './monitoring-plan-changes-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonitoringPlanChangesSummaryTemplateComponent {
  readonly monitoringPlanChanges = input.required<AerMonitoringPlanChanges>();
  readonly monitoringPlanVersion = input.required<AerMonitoringPlanVersion>();
  readonly map = monitoringPlanChangesMap;

  readonly isEditable = input<boolean>(false);
  readonly changeLink = input<string>();
  readonly queryParams = input<Params>({ change: true });
}
