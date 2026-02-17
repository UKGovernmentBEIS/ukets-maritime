import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { RequestActionStore } from '@netz/common/store';

import { virFollowUpQuery } from '@requests/timeline/vir-follow-up/+state';
import {
  VirOperatorResponseToRegulatorCommentsSummaryTemplateComponent,
  VirRegulatorResponseSummaryTemplateComponent,
  VirVerifierRecommendationSummaryTemplateComponent,
} from '@shared/components';
import { VirOperatorResponseSummaryTemplateComponent } from '@shared/components/summaries/vir-operator-response-summary-template';

@Component({
  selector: 'mrtm-vir-follow-up-details',
  imports: [
    VirVerifierRecommendationSummaryTemplateComponent,
    VirOperatorResponseSummaryTemplateComponent,
    VirRegulatorResponseSummaryTemplateComponent,
    VirOperatorResponseToRegulatorCommentsSummaryTemplateComponent,
  ],
  standalone: true,
  templateUrl: './vir-follow-up-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VirFollowUpDetailsComponent {
  private readonly store = inject(RequestActionStore);
  public readonly data = this.store.select(virFollowUpQuery.selectPayload);
  public readonly operatorResponse = this.store.select(virFollowUpQuery.selectOperatorResponseSummaryData);
}
