import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { take } from 'rxjs';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { PendingButtonDirective } from '@netz/common/directives';
import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { ButtonDirective, LinkDirective } from '@netz/govuk-components';

import { aerCommonQuery } from '@requests/common/aer/+state';
import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { AER_PORTS_SUB_TASK, AerPortsWizardStep } from '@requests/common/aer/subtasks/aer-ports/aer-ports.helpers';
import { aerPortsMap } from '@requests/common/aer/subtasks/aer-ports/aer-ports-subtask-list.map';
import { TaskItemStatus } from '@requests/common/task-item-status';
import { PortCallsListSummaryTemplateComponent } from '@shared/components';

@Component({
  selector: 'mrtm-aer-ports-summary',
  standalone: true,
  imports: [
    PageHeadingComponent,
    ButtonDirective,
    ReturnToTaskOrActionPageComponent,
    PortCallsListSummaryTemplateComponent,
    LinkDirective,
    RouterLink,
    ReactiveFormsModule,
    PendingButtonDirective,
  ],
  templateUrl: './aer-ports-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AerPortsSummaryComponent {
  private readonly store: RequestTaskStore = inject(RequestTaskStore);
  private readonly service: TaskService<AerSubmitTaskPayload> = inject(TaskService);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  public readonly editable: Signal<boolean> = this.store.select(requestTaskQuery.selectIsEditable);
  public readonly wizardStep = AerPortsWizardStep;
  public readonly wizardMap = aerPortsMap;
  public readonly ports = this.store.select(aerCommonQuery.selectPortsList);

  public readonly canSubmit: Signal<boolean> = computed(() => {
    const statuses = this.ports().map((port) => port.status);

    return (
      this.editable() &&
      statuses?.length &&
      statuses?.every((task) => task === TaskItemStatus.COMPLETED) &&
      this.store.select(aerCommonQuery.selectStatusForSubtask(AER_PORTS_SUB_TASK))() !== TaskItemStatus.COMPLETED
    );
  });

  public onSubmit(): void {
    this.service
      .submitSubtask(AER_PORTS_SUB_TASK, AerPortsWizardStep.SUMMARY, this.activatedRoute)
      .pipe(take(1))
      .subscribe();
  }
}
