import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestActionStore } from '@netz/common/store';

import { uncorrectedMisstatementsMap } from '@requests/common/aer';
import { aerTimelineCommonQuery } from '@requests/common/timeline/aer-common';
import {
  EmpReviewDecisionSummaryTemplateComponent,
  UncorrectedMisstatementsSummaryTemplateComponent,
} from '@shared/components/summaries';

@Component({
  selector: 'mrtm-uncorrected-misstatements-submitted',
  standalone: true,
  imports: [
    PageHeadingComponent,
    ReturnToTaskOrActionPageComponent,
    UncorrectedMisstatementsSummaryTemplateComponent,
    EmpReviewDecisionSummaryTemplateComponent,
  ],
  templateUrl: './uncorrected-misstatements-submitted.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UncorrectedMisstatementsSubmittedComponent {
  private readonly store = inject(RequestActionStore);
  readonly uncorrectedMisstatements = this.store.select(aerTimelineCommonQuery.selectUncorrectedMisstatements);
  readonly map = uncorrectedMisstatementsMap;

  readonly withReviewDecision = this.store.select(aerTimelineCommonQuery.withReviewDetermination);
  readonly decision = this.store.select(
    aerTimelineCommonQuery.selectSummaryReviewGroupDecision('UNCORRECTED_MISSTATEMENTS'),
  );
}
