import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { RequestTaskStore } from '@netz/common/store';
import { ButtonDirective } from '@netz/govuk-components';

import { empReviewQuery } from '@requests/common/emp/+state';

@Component({
  selector: 'mrtm-emp-peer-review-action-buttons',
  standalone: true,
  imports: [ButtonDirective, RouterLink],
  template: `
    @if (canBeDisplayed) {
      <div class="govuk-button-group">
        <a govukButton [routerLink]="['emp-peer-review', 'review-decision']">Peer review decision</a>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmpPeerReviewActionButtonsComponent {
  private readonly store: RequestTaskStore = inject(RequestTaskStore);

  canBeDisplayed = this.store.select(empReviewQuery.selectIsOverallDecisionCompleted)();
}
