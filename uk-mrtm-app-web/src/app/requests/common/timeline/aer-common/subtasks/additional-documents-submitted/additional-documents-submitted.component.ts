import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestActionStore } from '@netz/common/store';

import { additionalDocumentsMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { aerTimelineCommonQuery } from '@requests/common/timeline/aer-common';
import {
  AdditionalDocumentsSummaryTemplateComponent,
  EmpReviewDecisionSummaryTemplateComponent,
} from '@shared/components';

@Component({
  selector: 'mrtm-additional-documents-submitted',
  standalone: true,
  imports: [
    PageHeadingComponent,
    AdditionalDocumentsSummaryTemplateComponent,
    ReturnToTaskOrActionPageComponent,
    EmpReviewDecisionSummaryTemplateComponent,
  ],
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

  readonly withReviewDecision = this.store.select(aerTimelineCommonQuery.withReviewDetermination);
  readonly decision = this.store.select(
    aerTimelineCommonQuery.selectSummaryReviewGroupDecision('ADDITIONAL_DOCUMENTS'),
  );
}
