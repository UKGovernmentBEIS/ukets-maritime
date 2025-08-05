import { ChangeDetectionStrategy, Component, effect, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@netz/common/forms';
import { RequestTaskStore } from '@netz/common/store';
import { RadioComponent, RadioOptionComponent } from '@netz/govuk-components';

import { OPERATOR_DETAILS_SUB_TASK, OperatorDetailsWizardStep } from '@requests/common/components/operator-details';
import { empCommonQuery } from '@requests/common/emp/+state';
import { EmpTaskPayload } from '@requests/common/emp/emp.types';
import { declarationDocumentsFormProvider } from '@requests/common/emp/subtasks/operator-details/declaration-documents/declaration-documents.form-provider';
import { identifyMaritimeOperatorMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { TASK_FORM } from '@requests/common/task-form.token';
import { MultipleFileInputComponent, WizardStepComponent } from '@shared/components';

@Component({
  selector: 'mrtm-declaration-documents',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    WizardStepComponent,
    RadioComponent,
    RadioOptionComponent,
    MultipleFileInputComponent,
  ],
  providers: [declarationDocumentsFormProvider],
  templateUrl: './declaration-documents.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeclarationDocumentsComponent {
  protected readonly form: UntypedFormGroup = inject(TASK_FORM);
  private readonly service: TaskService<EmpTaskPayload> = inject(TaskService<EmpTaskPayload>);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly store: RequestTaskStore = inject(RequestTaskStore);
  protected readonly identifyMaritimeOperatorMap = identifyMaritimeOperatorMap;

  downloadUrl = this.store.select(empCommonQuery.selectTasksDownloadUrl)();
  existCtrlValue: Signal<boolean> = toSignal(this.existCtrl.valueChanges, {
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
        OPERATOR_DETAILS_SUB_TASK,
        OperatorDetailsWizardStep.OPERATOR_DETAILS_DECLARATION_DOCUMENTS,
        this.route,
        this.form.value,
      )
      .subscribe();
  }
}
