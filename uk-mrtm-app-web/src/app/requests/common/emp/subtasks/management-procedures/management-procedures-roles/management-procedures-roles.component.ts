import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormArray, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@netz/common/forms';
import {
  ButtonDirective,
  FieldsetDirective,
  LegendDirective,
  TextareaComponent,
  TextInputComponent,
} from '@netz/govuk-components';

import { EmpTaskPayload } from '@requests/common/emp/emp.types';
import {
  createRoleGroup,
  MANAGEMENT_PROCEDURES_SUB_TASK,
  managementProceduresRolesFormProvider,
  ManagementProceduresWizardStep,
} from '@requests/common/emp/subtasks/management-procedures';
import { managementProceduresMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { TASK_FORM } from '@requests/common/task-form.token';
import { WizardStepComponent } from '@shared/components';

@Component({
  selector: 'mrtm-management-procedures-roles',
  templateUrl: './management-procedures-roles.component.html',
  standalone: true,
  imports: [
    WizardStepComponent,
    ReactiveFormsModule,
    FieldsetDirective,
    LegendDirective,
    ButtonDirective,
    TextInputComponent,
    TextareaComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [managementProceduresRolesFormProvider],
})
export class ManagementProceduresRolesComponent {
  private route = inject(ActivatedRoute);
  readonly form: UntypedFormGroup = inject(TASK_FORM);
  private readonly service: TaskService<EmpTaskPayload> = inject(TaskService<EmpTaskPayload>);
  protected readonly managementProceduresMap = managementProceduresMap;

  addManagementProceduresRole() {
    this.rolesCtrl.push(createRoleGroup());
  }

  removeManagementProceduresRole(index: number) {
    this.rolesCtrl.removeAt(index);
  }

  get rolesCtrl(): FormArray {
    return this.form.get('monitoringReportingRoles') as FormArray;
  }

  onSubmit() {
    this.service
      .saveSubtask(
        MANAGEMENT_PROCEDURES_SUB_TASK,
        ManagementProceduresWizardStep.MONITORING_REPORTING_ROLES,
        this.route,
        this.form.value,
      )
      .subscribe();
  }
}
