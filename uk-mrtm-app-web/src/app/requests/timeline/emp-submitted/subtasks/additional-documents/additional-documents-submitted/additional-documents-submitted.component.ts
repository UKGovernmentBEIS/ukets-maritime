import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';

import { AdditionalDocuments } from '@mrtm/api';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestActionStore } from '@netz/common/store';

import { additionalDocumentsMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { empSubmittedQuery } from '@requests/timeline/emp-submitted/+state';
import { AdditionalDocumentsSummaryTemplateComponent } from '@shared/components';
import { AttachedFile, SubTaskListMap } from '@shared/types';

interface ViewModel {
  additionalDocuments: AdditionalDocuments;
  additionalDocumentsMap: SubTaskListMap<{ additionalDocumentsUpload: string }>;
  files: AttachedFile[];
}

@Component({
  selector: 'mrtm-additional-documents-submitted',
  standalone: true,
  imports: [PageHeadingComponent, AdditionalDocumentsSummaryTemplateComponent, ReturnToTaskOrActionPageComponent],
  templateUrl: './additional-documents-submitted.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdditionalDocumentsSubmittedComponent {
  private readonly store: RequestActionStore = inject(RequestActionStore);

  vm: Signal<ViewModel> = computed(() => {
    const additionalDocuments = this.store.select(empSubmittedQuery.selectAdditionalDocuments)();
    return {
      additionalDocuments: additionalDocuments,
      additionalDocumentsMap: additionalDocumentsMap,
      files: this.store.select(empSubmittedQuery.selectAttachedFiles(additionalDocuments?.documents))(),
    };
  });
}
