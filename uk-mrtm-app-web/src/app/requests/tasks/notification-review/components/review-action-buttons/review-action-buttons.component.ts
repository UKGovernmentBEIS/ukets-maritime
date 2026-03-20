import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { ButtonDirective } from '@netz/govuk-components';

import { nocReviewQuery } from '@requests/common/emp/+state/noc-review.selectors';
import { DETAILS_CHANGE_SUB_TASK } from '@requests/tasks/notification-review/subtasks/details-change';

@Component({
  selector: 'mrtm-review-action-buttons',
  imports: [ButtonDirective, RouterLink],
  standalone: true,
  template: `
    @if (canBeDisplayed) {
      <div class="govuk-button-group">
        <a govukButton [routerLink]="['review', 'notify-operator']">Notify operator of decision</a>
        <a govukSecondaryButton [routerLink]="['review', 'peer-review']">Send for peer review</a>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewActionButtonsComponent {
  private readonly store: RequestTaskStore = inject(RequestTaskStore);

  canBeDisplayed =
    this.store.select(requestTaskQuery.selectIsEditable)() &&
    this.store.select(nocReviewQuery.selectIsSubtaskCompleted(DETAILS_CHANGE_SUB_TASK))();
}
