import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';

import { AdditionalDocuments } from '@mrtm/api';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestActionStore } from '@netz/common/store';

import { additionalDocumentsMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { empSubmittedQuery } from '@requests/timeline/emp-submitted/+state';
import {
  AdditionalDocumentsSummaryTemplateComponent,
  ReviewDecisionSummaryTemplateComponent,
} from '@shared/components';
import { AttachedFile, EmpVariationReviewDecisionDto, SubTaskListMap } from '@shared/types';

interface ViewModel {
  additionalDocuments: AdditionalDocuments;
  additionalDocumentsMap: SubTaskListMap<{ additionalDocumentsUpload: string }>;
  files: AttachedFile[];
  reviewGroupDecision?: EmpVariationReviewDecisionDto | null;
}

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
  private readonly store: RequestActionStore = inject(RequestActionStore);

  readonly vm: Signal<ViewModel> = computed(() => {
    const additionalDocuments = this.store.select(empSubmittedQuery.selectAdditionalDocuments)();
    return {
      additionalDocuments: additionalDocuments,
      additionalDocumentsMap: additionalDocumentsMap,
      files: this.store.select(empSubmittedQuery.selectAttachedFiles(additionalDocuments?.documents))(),
      reviewGroupDecision: this.store.select(empSubmittedQuery.selectReviewGroupDecision('additionalDocuments'))(),
    };
  });
}
