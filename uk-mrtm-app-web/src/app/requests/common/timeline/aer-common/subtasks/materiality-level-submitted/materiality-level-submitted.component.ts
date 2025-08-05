import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestActionStore } from '@netz/common/store';

import { materialityLevelMap } from '@requests/common/aer';
import { aerTimelineCommonQuery } from '@requests/common/timeline/aer-common';
import {
  EmpReviewDecisionSummaryTemplateComponent,
  MaterialityLevelSummaryTemplateComponent,
} from '@shared/components/summaries';

@Component({
  selector: 'mrtm-materiality-level-submitted',
  standalone: true,
  imports: [
    PageHeadingComponent,
    ReturnToTaskOrActionPageComponent,
    MaterialityLevelSummaryTemplateComponent,
    EmpReviewDecisionSummaryTemplateComponent,
  ],
  templateUrl: './materiality-level-submitted.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaterialityLevelSubmittedComponent {
  private readonly store = inject(RequestActionStore);
  readonly materialityLevel = this.store.select(aerTimelineCommonQuery.selectMaterialityLevel);
  readonly map = materialityLevelMap;

  readonly withReviewDecision = this.store.select(aerTimelineCommonQuery.withReviewDetermination);
  readonly decision = this.store.select(aerTimelineCommonQuery.selectSummaryReviewGroupDecision('MATERIALITY_LEVEL'));
}
