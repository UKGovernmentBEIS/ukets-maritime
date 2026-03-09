import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';

import { RequestActionStore } from '@netz/common/store';

import { notificationCompletedQuery } from '@requests/timeline/notification-completed/+state';
import { NotificationCompletedSummaryTemplateComponent } from '@shared/components';
import { NotificationCompleted } from '@shared/types/notification-completed.interface';

@Component({
  selector: 'mrtm-notification-completed',
  standalone: true,
  imports: [NotificationCompletedSummaryTemplateComponent],
  templateUrl: './notification-completed.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationCompletedComponent {
  private readonly store = inject(RequestActionStore);

  vm: Signal<NotificationCompleted> = computed(() => {
    return {
      request: this.store.select(notificationCompletedQuery.selectRequest)(),
      response: this.store.select(notificationCompletedQuery.selectResponse)(),
      dueDate: this.store.select(notificationCompletedQuery.selectDueDate)(),
      submissionDate: this.store.select(notificationCompletedQuery.selectSubmissionDate)(),
      decisionType: this.store.select(notificationCompletedQuery.selectReviewDecision)().type,
      usersInfo: this.store.select(notificationCompletedQuery.selectUsersInfo)(),
      signatory: this.store.select(notificationCompletedQuery.selectSignatory)(),
      attachments: this.store.select(
        notificationCompletedQuery.selectAttachedFiles(
          this.store.select(notificationCompletedQuery.selectResponseFiles)(),
        ),
      )(),
    };
  });
}
