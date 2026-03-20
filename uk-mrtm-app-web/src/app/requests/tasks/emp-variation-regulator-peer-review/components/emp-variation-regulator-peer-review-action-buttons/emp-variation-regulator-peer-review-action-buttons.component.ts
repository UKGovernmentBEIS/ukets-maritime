import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthStore, selectUserId } from '@netz/common/auth';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { ButtonDirective } from '@netz/govuk-components';

@Component({
  selector: 'mrtm-emp-variation-regulator-peer-review-action-buttons',
  imports: [ButtonDirective, RouterLink],
  standalone: true,
  template: `
    @if (canBeDisplayed) {
      <div class="govuk-button-group">
        <a govukButton [routerLink]="['emp-variation-regulator-peer-review', 'review-decision']">
          Peer review decision
        </a>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmpVariationRegulatorPeerReviewActionButtonsComponent {
  private readonly requestTaskStore: RequestTaskStore = inject(RequestTaskStore);
  private readonly authStore: AuthStore = inject(AuthStore);

  canBeDisplayed =
    this.authStore.select(selectUserId)() === this.requestTaskStore.select(requestTaskQuery.selectAssigneeUserId)() &&
    this.requestTaskStore
      .select(requestTaskQuery.selectAllowedRequestTaskActions)()
      ?.includes('EMP_VARIATION_REVIEW_SUBMIT_PEER_REVIEW_DECISION_REGULATOR_LED');
}
