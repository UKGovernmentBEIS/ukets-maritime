import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@netz/common/forms';
import { DetailsComponent } from '@netz/govuk-components';

import { EmpProcedureFormWithFilesComponent } from '@requests/common/emp/components';
import { EmpTaskPayload } from '@requests/common/emp/emp.types';
import {
  MANAGEMENT_PROCEDURES_SUB_TASK,
  managementProceduresDataFlowFormProvider,
  ManagementProceduresWizardStep,
} from '@requests/common/emp/subtasks/management-procedures';
import { managementProceduresMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { TASK_FORM } from '@requests/common/task-form.token';
import { WizardStepComponent } from '@shared/components';

@Component({
  selector: 'mrtm-management-procedures-data-flow',
  imports: [WizardStepComponent, ReactiveFormsModule, DetailsComponent, EmpProcedureFormWithFilesComponent],
  standalone: true,
  templateUrl: './management-procedures-data-flow.component.html',
  providers: [managementProceduresDataFlowFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagementProceduresDataFlowComponent {
  protected readonly form: UntypedFormGroup = inject(TASK_FORM);
  private readonly service: TaskService<EmpTaskPayload> = inject(TaskService<EmpTaskPayload>);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  protected readonly managementProceduresMap = managementProceduresMap;

  onSubmit() {
    this.service
      .saveSubtask(
        MANAGEMENT_PROCEDURES_SUB_TASK,
        ManagementProceduresWizardStep.DATA_FLOW_ACTIVITIES,
        this.route,
        this.form.value,
      )
      .subscribe();
  }
}
