import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { ButtonDirective } from '@netz/govuk-components';

import { TaskItemStatus } from '@requests/common';
import { followUpReviewQuery } from '@requests/tasks/notification-follow-up-review/+state';
import { REVIEW_DECISION_SUB_TASK } from '@requests/tasks/notification-follow-up-review/subtasks/review-decision';

@Component({
  selector: 'mrtm-follow-up-review-action-buttons',
  imports: [ButtonDirective, RouterLink],
  standalone: true,
  template: `
    @if (canBeDisplayed) {
      <div class="govuk-button-group">
        @if (status === TaskItemStatus.AMENDS_NEEDED) {
          <a govukButton [routerLink]="['follow-up-review', 'return-for-amends']">Return for amends</a>
        } @else if (status === TaskItemStatus.ACCEPTED) {
          <a govukButton [routerLink]="['follow-up-review', 'notify-operator']">Notify operator of decision</a>
        }
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FollowUpReviewActionButtonsComponent {
  private readonly store: RequestTaskStore = inject(RequestTaskStore);
  readonly TaskItemStatus = TaskItemStatus;

  canBeDisplayed =
    this.store.select(requestTaskQuery.selectIsEditable)() &&
    this.store.select(followUpReviewQuery.selectIsSubtaskCompleted(REVIEW_DECISION_SUB_TASK))();

  status = this.store.select(followUpReviewQuery.selectStatusForSubtask(REVIEW_DECISION_SUB_TASK))();
}
