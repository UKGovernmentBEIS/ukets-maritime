import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { EmpNotificationDetailsOfChange } from '@mrtm/api';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { PendingButtonDirective } from '@netz/common/directives';
import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { ButtonDirective } from '@netz/govuk-components';

import { nocReviewQuery } from '@requests/common/emp/+state/noc-review.selectors';
import { ReviewTaskPayload } from '@requests/common/emp/emp.types';
import {
  DETAILS_CHANGE_SUB_TASK,
  DetailsChangeWizardStep,
} from '@requests/tasks/notification-review/subtasks/details-change';
import { detailsChangeMap } from '@requests/tasks/notification-review/subtasks/subtask-list.map';
import { NotificationDetailsOfChangeSummaryTemplateComponent } from '@shared/components';
import { NotificationReviewDecisionSummaryTemplateComponent } from '@shared/components/summaries/notification-review-decision-summary-template/notification-review-decision-summary-template.component';
import { AttachedFile, NotificationReviewDecisionUnion, SubTaskListMap } from '@shared/types';

interface ViewModel {
  detailsOfChange: EmpNotificationDetailsOfChange;
  notificationFiles: AttachedFile[];
  reviewDecision: NotificationReviewDecisionUnion;
  isEditable: boolean;
  isSubTaskCompleted: boolean;
  detailsChangeMap: SubTaskListMap<ReviewTaskPayload>;
  wizardStep: { [s: string]: string };
}

@Component({
  selector: 'mrtm-details-change-summary',
  standalone: true,
  imports: [
    NotificationDetailsOfChangeSummaryTemplateComponent,
    NotificationReviewDecisionSummaryTemplateComponent,
    PageHeadingComponent,
    PendingButtonDirective,
    ButtonDirective,
    ReturnToTaskOrActionPageComponent,
  ],
  templateUrl: './details-change-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsChangeSummaryComponent {
  private readonly service: TaskService<ReviewTaskPayload> = inject(TaskService<ReviewTaskPayload>);
  private readonly store: RequestTaskStore = inject(RequestTaskStore);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  vm: Signal<ViewModel> = computed(() => {
    const detailsOfChange = this.store.select(nocReviewQuery.selectEmpNotificationDetailsOfChange)();
    return {
      detailsOfChange: detailsOfChange,
      notificationFiles: this.store.select(
        nocReviewQuery.selectNotificationAttachedFiles(detailsOfChange?.documents),
      )(),
      reviewDecision: this.store.select(nocReviewQuery.selectReviewDecision)(),
      isEditable: this.store.select(requestTaskQuery.selectIsEditable)(),
      isSubTaskCompleted: this.store.select(nocReviewQuery.selectIsSubtaskCompleted(DETAILS_CHANGE_SUB_TASK))(),
      detailsChangeMap: detailsChangeMap,
      wizardStep: DetailsChangeWizardStep,
    };
  });

  onSubmit() {
    this.service.submitSubtask(DETAILS_CHANGE_SUB_TASK, DetailsChangeWizardStep.SUMMARY, this.route).subscribe();
  }
}
