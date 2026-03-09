import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { PendingButtonDirective } from '@netz/common/directives';
import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { ButtonDirective } from '@netz/govuk-components';

import { aerCommonQuery } from '@requests/common/aer/+state';
import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { monitoringPlanChangesMap } from '@requests/common/aer/subtasks/aer-subtasks-list.map';
import {
  MONITORING_PLAN_CHANGES_SUB_TASK,
  MonitoringPlanChangesWizardStep,
} from '@requests/common/aer/subtasks/monitoring-plan-changes/monitoring-plan-changes.helpers';
import { MonitoringPlanChangesSummaryTemplateComponent } from '@shared/components';

@Component({
  selector: 'mrtm-monitoring-plan-changes-summary',
  standalone: true,
  imports: [
    ButtonDirective,
    PageHeadingComponent,
    PendingButtonDirective,
    MonitoringPlanChangesSummaryTemplateComponent,
    ReturnToTaskOrActionPageComponent,
  ],
  templateUrl: './monitoring-plan-changes-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonitoringPlanChangesSummaryComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(TaskService<AerSubmitTaskPayload>);
  private readonly store = inject(RequestTaskStore);

  readonly subtask = MONITORING_PLAN_CHANGES_SUB_TASK;
  readonly wizardStep = MonitoringPlanChangesWizardStep;
  readonly map = monitoringPlanChangesMap;

  readonly isEditable = this.store.select(requestTaskQuery.selectIsEditable);
  readonly isSubtaskCompleted = this.store.select(aerCommonQuery.selectIsSubtaskCompleted(this.subtask));
  readonly monitoringPlanVersion = this.store.select(aerCommonQuery.selectMonitoringPlanVersion);
  readonly monitoringPlanChanges = this.store.select(aerCommonQuery.selectMonitoringPlanChanges);

  constructor() {
    if (this.route.snapshot.queryParams?.['change'] === 'true') {
      this.router.navigate([], { queryParams: { change: null }, queryParamsHandling: 'merge', replaceUrl: true });
    }
  }

  onSubmit(): void {
    this.service.submitSubtask(this.subtask, this.wizardStep?.SUMMARY ?? '../', this.route).subscribe();
  }
}
