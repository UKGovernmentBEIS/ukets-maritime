import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestActionStore } from '@netz/common/store';

import { materialityLevelMap } from '@requests/common/aer';
import { aerTimelineCommonQuery } from '@requests/common/timeline/aer-common';
import {
  MaterialityLevelSummaryTemplateComponent,
  ReviewDecisionSummaryTemplateComponent,
} from '@shared/components/summaries';

@Component({
  selector: 'mrtm-materiality-level-submitted',
  imports: [
    PageHeadingComponent,
    ReturnToTaskOrActionPageComponent,
    MaterialityLevelSummaryTemplateComponent,
    ReviewDecisionSummaryTemplateComponent,
  ],
  standalone: true,
  templateUrl: './materiality-level-submitted.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaterialityLevelSubmittedComponent {
  private readonly store = inject(RequestActionStore);
  readonly materialityLevel = this.store.select(aerTimelineCommonQuery.selectMaterialityLevel);
  readonly materialityLevelMap = materialityLevelMap;

  readonly isReviewCompletedActionType = this.store.select(aerTimelineCommonQuery.isReviewCompletedActionType);
  readonly decision = this.store.select(aerTimelineCommonQuery.selectSummaryReviewGroupDecision('MATERIALITY_LEVEL'));
}
