import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';

import { DecisionNotification } from '@mrtm/api';

import { RequestActionStore } from '@netz/common/store';

import { notificationDecisionQuery } from '@requests/timeline/notification-decision/+state';
import { NotificationDecisionSummaryTemplateComponent } from '@shared/components';
import { AttachedFile, NotificationReviewDecisionUnion, NotifyAccountOperatorUsersInfo } from '@shared/types';

interface ViewModel {
  reviewDecision: NotificationReviewDecisionUnion;
  usersInfo: NotifyAccountOperatorUsersInfo;
  reviewDecisionNotification: DecisionNotification;
  officialNotice: AttachedFile;
}

@Component({
  selector: 'mrtm-notification-decision',
  standalone: true,
  imports: [NotificationDecisionSummaryTemplateComponent],
  templateUrl: './notification-decision.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationDecisionComponent {
  private readonly store = inject(RequestActionStore);

  vm: Signal<ViewModel> = computed(() => {
    return {
      reviewDecision: this.store.select(notificationDecisionQuery.selectReviewDecision)(),
      usersInfo: this.store.select(notificationDecisionQuery.selectUsersInfo)(),
      reviewDecisionNotification: this.store.select(notificationDecisionQuery.selectReviewDecisionNotification)(),
      officialNotice: this.store.select(notificationDecisionQuery.selectOfficialNoticeFile)(),
    };
  });
}
