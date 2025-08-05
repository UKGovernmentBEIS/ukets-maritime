import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';

import { AdditionalDocuments, EmpAcceptedVariationDecisionDetails } from '@mrtm/api';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestTaskStore } from '@netz/common/store';

import { empCommonQuery, empVariationRegulatorPeerReviewQuery } from '@requests/common/emp/+state';
import { additionalDocumentsMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { AdditionalDocumentsSummaryTemplateComponent } from '@shared/components';
import { VariationRegulatorDecisionPartialSummaryTemplateComponent } from '@shared/components/summaries/variation-regulator-decision-partial-summary-template';
import { AttachedFile, SubTaskListMap } from '@shared/types';

interface ViewModel {
  additionalDocuments: AdditionalDocuments;
  originalAdditionalDocuments: AdditionalDocuments;
  files: AttachedFile[];
  originalFiles: AttachedFile[];
  variationDecisionDetails: EmpAcceptedVariationDecisionDetails;
  additionalDocumentsMap: SubTaskListMap<{ additionalDocumentsUpload: string }>;
}

@Component({
  selector: 'mrtm-emp-var-reg-peer-review--additional-documents',
  standalone: true,
  imports: [
    PageHeadingComponent,
    AdditionalDocumentsSummaryTemplateComponent,
    ReturnToTaskOrActionPageComponent,
    VariationRegulatorDecisionPartialSummaryTemplateComponent,
  ],
  templateUrl: './emp-var-reg-peer-review-additional-documents.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmpVarRegPeerReviewAdditionalDocumentsComponent {
  private readonly store: RequestTaskStore = inject(RequestTaskStore);

  vm: Signal<ViewModel> = computed(() => {
    const additionalDocuments = this.store.select(empCommonQuery.selectAdditionalDocuments)();
    const originalAdditionalDocuments = this.store.select(
      empVariationRegulatorPeerReviewQuery.selectOriginalEmissionsMonitoringPlan,
    )().additionalDocuments;

    return {
      additionalDocuments: additionalDocuments,
      originalAdditionalDocuments: originalAdditionalDocuments,
      files: this.store.select(empCommonQuery.selectAttachedFiles(additionalDocuments?.documents))(),
      originalFiles: this.store.select(
        empVariationRegulatorPeerReviewQuery.selectOriginalAttachedFiles(originalAdditionalDocuments?.documents),
      )(),
      variationDecisionDetails: this.store.select(empVariationRegulatorPeerReviewQuery.selectReviewGroupDecisions)()[
        'ADDITIONAL_DOCUMENTS'
      ],
      additionalDocumentsMap: additionalDocumentsMap,
    };
  });
}
