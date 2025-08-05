import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { take } from 'rxjs';

import { TaskService } from '@netz/common/forms';
import {
  CheckboxComponent,
  CheckboxesComponent,
  ConditionalContentDirective,
  TextareaComponent,
} from '@netz/govuk-components';

import { TASK_FORM } from '@requests/common';
import { MATERIALITY_LEVEL_SUB_TASK, materialityLevelMap, MaterialityLevelStep } from '@requests/common/aer';
import { AER_ACCREDITATION_REFERENCE_DOCUMENT_TYPES } from '@requests/common/aer/aer.consts';
import { AerVerificationSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { materialityLevelReferenceDocumentsFormProvider } from '@requests/tasks/aer-verification-submit/subtasks/materiality-level/materiality-level-reference-documents/materiality-level-reference-documents.form-provider';
import { WizardStepComponent } from '@shared/components';
import { AccreditationReferenceDocumentTypesPipe } from '@shared/pipes';

@Component({
  selector: 'mrtm-materiality-level-reference-documents',
  standalone: true,
  imports: [
    ConditionalContentDirective,
    TextareaComponent,
    CheckboxesComponent,
    CheckboxComponent,
    ReactiveFormsModule,
    WizardStepComponent,
    AccreditationReferenceDocumentTypesPipe,
  ],
  templateUrl: './materiality-level-reference-documents.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [materialityLevelReferenceDocumentsFormProvider],
})
export class MaterialityLevelReferenceDocumentsComponent {
  readonly map = materialityLevelMap;
  readonly formGroup = inject<FormGroup>(TASK_FORM);
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(TaskService<AerVerificationSubmitTaskPayload>);

  readonly referenceDocumentTypes = AER_ACCREDITATION_REFERENCE_DOCUMENT_TYPES;

  onSubmit() {
    this.service
      .saveSubtask(
        MATERIALITY_LEVEL_SUB_TASK,
        MaterialityLevelStep.REFERENCE_DOCUMENTS,
        this.route,
        this.formGroup.value,
      )
      .pipe(take(1))
      .subscribe();
  }
}
