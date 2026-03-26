import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AdditionalDocuments } from '@mrtm/api';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { PendingButtonDirective } from '@netz/common/directives';
import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { ButtonDirective } from '@netz/govuk-components';

import { aerCommonQuery } from '@requests/common/aer/+state';
import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { aerAdditionalDocumentsMap } from '@requests/common/aer/subtasks/aer-additional-documents/aer-additional-documents-subtasks-list.map';
import {
  ADDITIONAL_DOCUMENTS_SUB_TASK,
  AdditionalDocumentsWizardStep,
} from '@requests/common/utils/additional-documents';
import { AdditionalDocumentsSummaryTemplateComponent } from '@shared/components';
import { AttachedFile, SubTaskListMap } from '@shared/types';

interface ViewModel {
  additionalDocuments: AdditionalDocuments;
  files: AttachedFile[];
  aerAdditionalDocumentsMap: SubTaskListMap<{ additionalDocumentsUpload: string }>;
  isEditable: boolean;
  isSubTaskCompleted: boolean;
  wizardStep: { [s: string]: string };
}

@Component({
  selector: 'mrtm-aer-additional-documents-summary',
  imports: [
    PageHeadingComponent,
    AdditionalDocumentsSummaryTemplateComponent,
    PendingButtonDirective,
    ButtonDirective,
    ReturnToTaskOrActionPageComponent,
  ],
  standalone: true,
  templateUrl: './aer-additional-documents-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AerAdditionalDocumentsSummaryComponent {
  private readonly service = inject(TaskService<AerSubmitTaskPayload>);
  private readonly store = inject(RequestTaskStore);
  private readonly route = inject(ActivatedRoute);

  readonly vm: Signal<ViewModel> = computed(() => {
    const additionalDocuments = this.store.select(aerCommonQuery.selectAerAdditionalDocuments)();
    const isEditable = this.store.select(requestTaskQuery.selectIsEditable)();
    const isSubTaskCompleted = this.store.select(
      aerCommonQuery.selectIsSubtaskCompleted(ADDITIONAL_DOCUMENTS_SUB_TASK),
    )();

    return {
      additionalDocuments: additionalDocuments,
      files: this.store.select(aerCommonQuery.selectAttachedFiles(additionalDocuments?.documents))(),
      aerAdditionalDocumentsMap: aerAdditionalDocumentsMap,
      isEditable: isEditable,
      isSubTaskCompleted: isSubTaskCompleted,
      wizardStep: AdditionalDocumentsWizardStep,
    };
  });

  onSubmit() {
    this.service
      .submitSubtask(ADDITIONAL_DOCUMENTS_SUB_TASK, AdditionalDocumentsWizardStep.SUMMARY, this.route)
      .subscribe();
  }
}
