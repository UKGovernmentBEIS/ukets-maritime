import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';

import { AdditionalDocuments } from '@mrtm/api';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestActionStore } from '@netz/common/store';

import { additionalDocumentsMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { empVariationSubmittedQuery } from '@requests/timeline/emp-variation-submitted/+state';
import { AdditionalDocumentsSummaryTemplateComponent } from '@shared/components';
import { AttachedFile, SubTaskListMap } from '@shared/types';

interface ViewModel {
  additionalDocuments: AdditionalDocuments;
  additionalDocumentsMap: SubTaskListMap<{ additionalDocumentsUpload: string }>;
  files: AttachedFile[];
}

@Component({
  selector: 'mrtm-emp-var-submitted-additional-documents',
  standalone: true,
  imports: [PageHeadingComponent, AdditionalDocumentsSummaryTemplateComponent, ReturnToTaskOrActionPageComponent],
  templateUrl: './emp-var-submitted-additional-documents.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmpVarSubmittedAdditionalDocumentsComponent {
  private readonly store: RequestActionStore = inject(RequestActionStore);

  vm: Signal<ViewModel> = computed(() => {
    const additionalDocuments = this.store.select(empVariationSubmittedQuery.selectAdditionalDocuments)();
    return {
      additionalDocuments: additionalDocuments,
      additionalDocumentsMap: additionalDocumentsMap,
      files: this.store.select(empVariationSubmittedQuery.selectAttachedFiles(additionalDocuments?.documents))(),
    };
  });
}
