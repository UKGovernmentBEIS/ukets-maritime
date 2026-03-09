import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';

import { AdditionalDocuments, EmpAcceptedVariationDecisionDetails } from '@mrtm/api';

import { AuthStore, selectUserRoleType } from '@netz/common/auth';
import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestActionStore } from '@netz/common/store';

import { additionalDocumentsMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { empVariationSubmittedQuery } from '@requests/timeline/emp-variation-submitted/+state';
import {
  AdditionalDocumentsSummaryTemplateComponent,
  ReviewDecisionSummaryTemplateComponent,
} from '@shared/components';
import { VariationRegulatorDecisionPartialSummaryTemplateComponent } from '@shared/components/summaries/variation-regulator-decision-partial-summary-template';
import { AttachedFile, EmpVariationReviewDecisionDto, SubTaskListMap } from '@shared/types';

interface ViewModel {
  additionalDocuments: AdditionalDocuments;
  additionalDocumentsMap: SubTaskListMap<{ additionalDocumentsUpload: string }>;
  files: AttachedFile[];
  reviewGroupDecision?: EmpVariationReviewDecisionDto | null;
  isVariationRegulator?: boolean;
  regulatorLedReason?: EmpAcceptedVariationDecisionDetails;
  isRegulator?: boolean;
}

@Component({
  selector: 'mrtm-emp-var-submitted-additional-documents',
  imports: [
    PageHeadingComponent,
    AdditionalDocumentsSummaryTemplateComponent,
    ReturnToTaskOrActionPageComponent,
    ReviewDecisionSummaryTemplateComponent,
    VariationRegulatorDecisionPartialSummaryTemplateComponent,
  ],
  standalone: true,
  templateUrl: './emp-var-submitted-additional-documents.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmpVarSubmittedAdditionalDocumentsComponent {
  private readonly store: RequestActionStore = inject(RequestActionStore);
  private readonly authStore: AuthStore = inject(AuthStore);

  vm: Signal<ViewModel> = computed(() => {
    const additionalDocuments = this.store.select(empVariationSubmittedQuery.selectAdditionalDocuments)();
    return {
      additionalDocuments: additionalDocuments,
      additionalDocumentsMap: additionalDocumentsMap,
      files: this.store.select(empVariationSubmittedQuery.selectAttachedFiles(additionalDocuments?.documents))(),
      reviewGroupDecision: this.store.select(
        empVariationSubmittedQuery.selectReviewGroupDecision('additionalDocuments'),
      )(),
      isVariationRegulator: this.store.select(empVariationSubmittedQuery.selectIsVariationRegulator)(),
      regulatorLedReason: this.store.select(
        empVariationSubmittedQuery.selectVariationRegulatorDecisionDetails('additionalDocuments'),
      )(),
      isRegulator: this.authStore.select(selectUserRoleType)() === 'REGULATOR',
    };
  });
}
