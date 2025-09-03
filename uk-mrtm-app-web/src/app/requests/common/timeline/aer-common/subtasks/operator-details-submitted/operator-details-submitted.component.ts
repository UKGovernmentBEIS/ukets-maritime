import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { LimitedCompanyOrganisation } from '@mrtm/api';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestActionStore } from '@netz/common/store';

import { operatorDetailsMap } from '@requests/common/components/operator-details';
import { aerTimelineCommonQuery } from '@requests/common/timeline/aer-common';
import { OperatorDetailsSummaryTemplateComponent, ReviewDecisionSummaryTemplateComponent } from '@shared/components';

@Component({
  selector: 'mrtm-operator-details-submitted',
  standalone: true,
  imports: [
    PageHeadingComponent,
    OperatorDetailsSummaryTemplateComponent,
    ReturnToTaskOrActionPageComponent,
    ReviewDecisionSummaryTemplateComponent,
  ],
  templateUrl: './operator-details-submitted.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OperatorDetailsSubmittedComponent {
  private readonly store = inject(RequestActionStore);
  readonly operatorDetails = this.store.select(aerTimelineCommonQuery.selectOperatorDetails);
  readonly operatorDetailsMap = operatorDetailsMap;
  readonly files = computed(() =>
    this.store.select(
      aerTimelineCommonQuery.selectAttachedFiles(
        (this.operatorDetails()?.organisationStructure as LimitedCompanyOrganisation)?.evidenceFiles,
      ),
    )(),
  );

  readonly isReviewCompletedActionType = this.store.select(aerTimelineCommonQuery.isReviewCompletedActionType);
  readonly decision = this.store.select(aerTimelineCommonQuery.selectSummaryReviewGroupDecision('OPERATOR_DETAILS'));
}
