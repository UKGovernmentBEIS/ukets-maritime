import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestActionStore } from '@netz/common/store';

import { additionalDocumentsMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { aerTimelineCommonQuery } from '@requests/common/timeline/aer-common';
import {
  AdditionalDocumentsSummaryTemplateComponent,
  ReviewDecisionSummaryTemplateComponent,
} from '@shared/components';

@Component({
  selector: 'mrtm-additional-documents-submitted',
  imports: [
    PageHeadingComponent,
    AdditionalDocumentsSummaryTemplateComponent,
    ReturnToTaskOrActionPageComponent,
    ReviewDecisionSummaryTemplateComponent,
  ],
  standalone: true,
  templateUrl: './additional-documents-submitted.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdditionalDocumentsSubmittedComponent {
  private readonly store = inject(RequestActionStore);

  readonly additionalDocuments = this.store.select(aerTimelineCommonQuery.selectAdditionalDocuments);
  readonly additionalDocumentsMap = additionalDocumentsMap;
  readonly files = computed(() =>
    this.store.select(aerTimelineCommonQuery.selectAttachedFiles(this.additionalDocuments()?.documents))(),
  );

  readonly isReviewCompletedActionType = this.store.select(aerTimelineCommonQuery.isReviewCompletedActionType);
  readonly decision = this.store.select(
    aerTimelineCommonQuery.selectSummaryReviewGroupDecision('ADDITIONAL_DOCUMENTS'),
  );
}
