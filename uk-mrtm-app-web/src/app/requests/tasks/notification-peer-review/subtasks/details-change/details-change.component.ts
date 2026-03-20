import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';

import { EmpNotificationDetailsOfChange } from '@mrtm/api';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestTaskStore } from '@netz/common/store';

import { peerReviewQuery } from '@requests/tasks/notification-peer-review/+state';
import { PeerReviewTaskPayload } from '@requests/tasks/notification-peer-review/peer-review.types';
import { DetailsChangeWizardStep } from '@requests/tasks/notification-peer-review/subtasks/details-change';
import { detailsChangeMap } from '@requests/tasks/notification-peer-review/subtasks/subtask-list.map';
import { NotificationDetailsOfChangeSummaryTemplateComponent } from '@shared/components';
import { NotificationReviewDecisionSummaryTemplateComponent } from '@shared/components/summaries/notification-review-decision-summary-template/notification-review-decision-summary-template.component';
import { AttachedFile, NotificationReviewDecisionUnion, SubTaskListMap } from '@shared/types';

interface ViewModel {
  detailsOfChange: EmpNotificationDetailsOfChange;
  notificationFiles: AttachedFile[];
  reviewDecision: NotificationReviewDecisionUnion;
  detailsChangeMap: SubTaskListMap<PeerReviewTaskPayload>;
  wizardStep: { [s: string]: string };
}

@Component({
  selector: 'mrtm-details-change-summary',
  imports: [
    NotificationDetailsOfChangeSummaryTemplateComponent,
    NotificationReviewDecisionSummaryTemplateComponent,
    PageHeadingComponent,
    ReturnToTaskOrActionPageComponent,
  ],
  standalone: true,
  templateUrl: './details-change.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsChangeComponent {
  private readonly store: RequestTaskStore = inject(RequestTaskStore);

  readonly vm: Signal<ViewModel> = computed(() => {
    const detailsOfChange = this.store.select(peerReviewQuery.selectEmpNotificationDetailsOfChange)();
    return {
      detailsOfChange: detailsOfChange,
      notificationFiles: this.store.select(
        peerReviewQuery.selectNotificationAttachedFiles(detailsOfChange?.documents),
      )(),
      reviewDecision: this.store.select(peerReviewQuery.selectReviewDecision)(),
      detailsChangeMap: detailsChangeMap,
      wizardStep: DetailsChangeWizardStep,
    };
  });
}
