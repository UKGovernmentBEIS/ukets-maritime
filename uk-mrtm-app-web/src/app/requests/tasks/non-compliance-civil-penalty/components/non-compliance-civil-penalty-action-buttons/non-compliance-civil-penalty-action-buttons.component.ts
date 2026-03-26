import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { RequestTaskStore } from '@netz/common/store';
import { ButtonDirective } from '@netz/govuk-components';

import { NOTIFY_OPERATOR_PATH } from '@requests/common/components/notify-operator';
import { SEND_FOR_PEER_REVIEW_PATH } from '@requests/common/components/peer-review';
import { NON_COMPLIANCE_CIVIL_PENALTY_ROUTE_PREFIX } from '@requests/common/non-compliance';
import { nonComplianceCivilPenaltyCommonQuery } from '@requests/common/non-compliance/non-compliance-civil-penalty/+state';

@Component({
  selector: 'mrtm-non-compliance-civil-penalty-action-buttons',
  imports: [ButtonDirective, RouterLink],
  standalone: true,
  template: `
    @if (canBeDisplayed()) {
      <div class="govuk-button-group">
        <a govukButton [routerLink]="[notifyOperatorPath]">Notify operator of decision</a>
        <a govukButton [routerLink]="[peerReviewPath]">Send for peer review</a>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NonComplianceCivilPenaltyActionButtonsComponent {
  private readonly store: RequestTaskStore = inject(RequestTaskStore);
  private readonly isEditable = this.store.select(nonComplianceCivilPenaltyCommonQuery.selectIsFormEditable);
  private readonly isUploadSubtaskCompleted = this.store.select(
    nonComplianceCivilPenaltyCommonQuery.selectIsUploadSubtaskCompleted,
  );

  readonly notifyOperatorPath = `${NON_COMPLIANCE_CIVIL_PENALTY_ROUTE_PREFIX}/${NOTIFY_OPERATOR_PATH}`;
  readonly peerReviewPath = `${NON_COMPLIANCE_CIVIL_PENALTY_ROUTE_PREFIX}/${SEND_FOR_PEER_REVIEW_PATH}`;
  readonly canBeDisplayed = computed(() => this.isEditable() && this.isUploadSubtaskCompleted());
}
