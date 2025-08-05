import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';

import { EmpNotificationDetailsOfChange } from '@mrtm/api';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestTaskStore } from '@netz/common/store';

import { waitForPeerReviewQuery } from '@requests/tasks/notification-wait-for-peer-review/+state';
import { waitForPeerReviewMap } from '@requests/tasks/notification-wait-for-peer-review/subtask-list.map';
import {
  NotificationDetailsOfChangeSummaryTemplateComponent,
  NotificationReviewDecisionSummaryTemplateComponent,
} from '@shared/components';
import { AttachedFile, NotificationReviewDecisionUnion } from '@shared/types';

interface ViewModel {
  detailsOfChange: EmpNotificationDetailsOfChange;
  notificationFiles: AttachedFile[];
  reviewDecision: NotificationReviewDecisionUnion;
  title: string;
}

@Component({
  selector: 'mrtm-wait-for-peer-review-summary',
  standalone: true,
  imports: [
    NotificationDetailsOfChangeSummaryTemplateComponent,
    NotificationReviewDecisionSummaryTemplateComponent,
    PageHeadingComponent,
    ReturnToTaskOrActionPageComponent,
  ],
  templateUrl: './wait-for-peer-review-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WaitForPeerReviewSummaryComponent {
  private readonly store: RequestTaskStore = inject(RequestTaskStore);

  vm: Signal<ViewModel> = computed(() => {
    const detailsOfChange = this.store.select(waitForPeerReviewQuery.selectEmpNotificationDetailsOfChange)();
    return {
      detailsOfChange: detailsOfChange,
      notificationFiles: this.store.select(
        waitForPeerReviewQuery.selectNotificationAttachedFiles(detailsOfChange?.documents),
      )(),
      reviewDecision: this.store.select(waitForPeerReviewQuery.selectReviewDecision)(),
      title: waitForPeerReviewMap.detailsOfChange.title,
    };
  });
}
