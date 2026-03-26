import { ChangeDetectionStrategy, Component, effect, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { RadioComponent, RadioOptionComponent } from '@netz/govuk-components';

import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { aerAdditionalDocumentsMap } from '@requests/common/aer/subtasks/aer-additional-documents/aer-additional-documents-subtasks-list.map';
import { aerAdditionalDocumentsUploadFormProvider } from '@requests/common/aer/subtasks/aer-additional-documents/aer-additional-documents-upload/aer-additional-documents-upload.form-provider';
import { TASK_FORM } from '@requests/common/task-form.token';
import {
  ADDITIONAL_DOCUMENTS_SUB_TASK,
  AdditionalDocumentsWizardStep,
} from '@requests/common/utils/additional-documents/additional-documents.helper';
import { MultipleFileInputComponent, WizardStepComponent } from '@shared/components';

@Component({
  selector: 'mrtm-aer-additional-documents-upload',
  imports: [WizardStepComponent, ReactiveFormsModule, RadioComponent, RadioOptionComponent, MultipleFileInputComponent],
  standalone: true,
  templateUrl: './aer-additional-documents-upload.component.html',
  providers: [aerAdditionalDocumentsUploadFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AerAdditionalDocumentsUploadComponent {
  protected readonly form: UntypedFormGroup = inject(TASK_FORM);
  private readonly service: TaskService<AerSubmitTaskPayload> = inject(TaskService<AerSubmitTaskPayload>);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly store: RequestTaskStore = inject(RequestTaskStore);

  protected readonly aerAdditionalDocumentsMap = aerAdditionalDocumentsMap;
  downloadUrl = this.store.select(requestTaskQuery.selectTasksDownloadUrl)();
  readonly existCtrlValue: Signal<boolean> = toSignal(this.existCtrl.valueChanges, {
    initialValue: this.existCtrl.value,
  });

  constructor() {
    effect(() => {
      if (this.existCtrlValue()) {
        this.documentsCtrl.enable();
      } else {
        this.documentsCtrl.disable();
      }
    });
  }

  get existCtrl(): UntypedFormControl {
    return this.form.get('exist') as UntypedFormControl;
  }

  get documentsCtrl(): UntypedFormControl {
    return this.form.get('documents') as UntypedFormControl;
  }

  onSubmit() {
    this.service
      .saveSubtask(
        ADDITIONAL_DOCUMENTS_SUB_TASK,
        AdditionalDocumentsWizardStep.ADDITIONAL_DOCUMENTS_UPLOAD,
        this.route,
        this.form.value,
      )
      .subscribe();
  }
}
