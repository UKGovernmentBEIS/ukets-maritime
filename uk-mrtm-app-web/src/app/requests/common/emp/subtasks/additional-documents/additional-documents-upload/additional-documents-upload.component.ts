import { ChangeDetectionStrategy, Component, effect, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@netz/common/forms';
import { RequestTaskStore } from '@netz/common/store';
import { RadioComponent, RadioOptionComponent } from '@netz/govuk-components';

import { empCommonQuery } from '@requests/common/emp/+state';
import { EmpTaskPayload } from '@requests/common/emp/emp.types';
import { additionalDocumentsUploadFormProvider } from '@requests/common/emp/subtasks/additional-documents/additional-documents-upload/additional-documents-upload.form-provider';
import { additionalDocumentsMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { TASK_FORM } from '@requests/common/task-form.token';
import {
  ADDITIONAL_DOCUMENTS_SUB_TASK,
  AdditionalDocumentsWizardStep,
} from '@requests/common/utils/additional-documents';
import { MultipleFileInputComponent, WizardStepComponent } from '@shared/components';

@Component({
  selector: 'mrtm-additional-documents-upload',
  imports: [WizardStepComponent, ReactiveFormsModule, RadioComponent, RadioOptionComponent, MultipleFileInputComponent],
  standalone: true,
  templateUrl: './additional-documents-upload.component.html',
  providers: [additionalDocumentsUploadFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdditionalDocumentsUploadComponent {
  protected readonly form: UntypedFormGroup = inject(TASK_FORM);
  private readonly service: TaskService<EmpTaskPayload> = inject(TaskService<EmpTaskPayload>);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly store: RequestTaskStore = inject(RequestTaskStore);

  protected readonly additionalDocumentsMap = additionalDocumentsMap;
  downloadUrl = this.store.select(empCommonQuery.selectTasksDownloadUrl)();
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
