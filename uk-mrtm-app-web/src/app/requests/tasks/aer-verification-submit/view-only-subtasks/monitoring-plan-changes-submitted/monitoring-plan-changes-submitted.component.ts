import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestTaskStore } from '@netz/common/store';

import { monitoringPlanChangesMap } from '@requests/common/aer';
import { aerCommonQuery } from '@requests/common/aer/+state';
import { MonitoringPlanChangesSummaryTemplateComponent } from '@shared/components/summaries';

@Component({
  selector: 'mrtm-monitoring-plan-changes-submitted',
  standalone: true,
  imports: [ReturnToTaskOrActionPageComponent, PageHeadingComponent, MonitoringPlanChangesSummaryTemplateComponent],
  templateUrl: './monitoring-plan-changes-submitted.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonitoringPlanChangesSubmittedComponent {
  private readonly store = inject(RequestTaskStore);
  readonly map = monitoringPlanChangesMap;

  readonly monitoringPlanVersion = this.store.select(aerCommonQuery.selectMonitoringPlanVersion);
  readonly monitoringPlanChanges = this.store.select(aerCommonQuery.selectMonitoringPlanChanges);
}
