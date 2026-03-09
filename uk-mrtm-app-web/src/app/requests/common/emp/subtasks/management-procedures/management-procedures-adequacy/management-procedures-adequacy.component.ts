import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@netz/common/forms';
import { DetailsComponent } from '@netz/govuk-components';

import { EmpProcedureFormComponent } from '@requests/common/emp/components/emp-procedure-form';
import { EmpTaskPayload } from '@requests/common/emp/emp.types';
import {
  MANAGEMENT_PROCEDURES_SUB_TASK,
  managementProceduresAdequacyFormProvider,
  ManagementProceduresWizardStep,
} from '@requests/common/emp/subtasks/management-procedures';
import { managementProceduresMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { TASK_FORM } from '@requests/common/task-form.token';
import { WizardStepComponent } from '@shared/components';

@Component({
  selector: 'mrtm-management-procedures-adequacy',
  standalone: true,
  imports: [WizardStepComponent, ReactiveFormsModule, DetailsComponent, EmpProcedureFormComponent],
  templateUrl: './management-procedures-adequacy.component.html',
  providers: [managementProceduresAdequacyFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagementProceduresAdequacyComponent {
  private route = inject(ActivatedRoute);
  protected readonly form: UntypedFormGroup = inject(TASK_FORM);
  private readonly service: TaskService<EmpTaskPayload> = inject(TaskService<EmpTaskPayload>);
  protected readonly managementProceduresMap = managementProceduresMap;

  onSubmit() {
    this.service
      .saveSubtask(
        MANAGEMENT_PROCEDURES_SUB_TASK,
        ManagementProceduresWizardStep.REGULAR_CHECK_OF_ADEQUACY,
        this.route,
        this.form.value,
      )
      .subscribe();
  }
}
