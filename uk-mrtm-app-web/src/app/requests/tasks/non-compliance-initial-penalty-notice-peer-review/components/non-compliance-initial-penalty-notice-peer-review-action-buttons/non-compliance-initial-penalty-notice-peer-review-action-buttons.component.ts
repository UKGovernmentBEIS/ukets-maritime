import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ButtonDirective } from '@netz/govuk-components';

import { NON_COMPLIANCE_INITIAL_PENALTY_NOTICE_PEER_REVIEW_ROUTE_PREFIX } from '@requests/common/non-compliance';

@Component({
  selector: 'mrtm-non-compliance-initial-penalty-notice-peer-review-action-buttons',
  standalone: true,
  imports: [ButtonDirective, RouterLink],
  template: `
    <div class="govuk-button-group">
      <a govukButton [routerLink]="[routePath, 'review-decision']">Peer review decision</a>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NonComplianceInitialPenaltyNoticePeerReviewActionButtonsComponent {
  readonly routePath = NON_COMPLIANCE_INITIAL_PENALTY_NOTICE_PEER_REVIEW_ROUTE_PREFIX;
}
