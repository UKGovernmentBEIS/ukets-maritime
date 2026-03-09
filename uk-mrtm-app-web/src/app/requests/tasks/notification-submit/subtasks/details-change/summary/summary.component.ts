import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { PendingButtonDirective } from '@netz/common/directives';
import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { ButtonDirective } from '@netz/govuk-components';

import { notificationQuery } from '@requests/tasks/notification-submit/+state';
import { NotificationTaskPayload } from '@requests/tasks/notification-submit/notification.types';
import {
  DETAILS_CHANGE_SUB_TASK,
  DetailsChangeWizardStep,
} from '@requests/tasks/notification-submit/subtasks/details-change/details-change.helper';
import { SummaryViewModel } from '@requests/tasks/notification-submit/subtasks/details-change/summary/summary.types';
import { detailsChangeMap } from '@requests/tasks/notification-submit/subtasks/subtask-list.map';
import { NotificationDetailsOfChangeSummaryTemplateComponent } from '@shared/components';

@Component({
  selector: 'mrtm-summary',
  standalone: true,
  imports: [
    PageHeadingComponent,
    NotificationDetailsOfChangeSummaryTemplateComponent,
    PendingButtonDirective,
    ButtonDirective,
    ReturnToTaskOrActionPageComponent,
  ],
  templateUrl: './summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SummaryComponent {
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly service: TaskService<NotificationTaskPayload> = inject(TaskService<NotificationTaskPayload>);
  private readonly store: RequestTaskStore = inject(RequestTaskStore);
  public readonly vm: Signal<SummaryViewModel> = computed(() => {
    const detailsOfChange = this.store.select(notificationQuery.selectDetailsOfChange)();

    return {
      detailsOfChange: detailsOfChange,
      notificationFiles: this.store.select(notificationQuery.selectAttachedFiles(detailsOfChange?.documents))(),
      isEditable: this.store.select(requestTaskQuery.selectIsEditable)(),
      isSubtaskCompleted: false,
      wizardMap: detailsChangeMap,
      wizardStep: DetailsChangeWizardStep,
    };
  });

  onSubmit(): void {
    this.service.submitSubtask(DETAILS_CHANGE_SUB_TASK, DetailsChangeWizardStep.SUMMARY, this.route).subscribe();
  }
}
