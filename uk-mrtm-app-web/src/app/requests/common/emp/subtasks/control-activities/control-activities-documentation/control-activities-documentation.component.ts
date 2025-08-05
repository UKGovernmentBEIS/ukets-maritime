import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { EmpProcedureForm } from '@mrtm/api';

import { TaskService } from '@netz/common/forms';

import { AboutProcedureDetailsComponent, EmpProcedureFormComponent } from '@requests/common/emp/components';
import { EmpTaskPayload } from '@requests/common/emp/emp.types';
import {
  CONTROL_ACTIVITIES_SUB_TASK,
  ControlActivitiesWizardStep,
} from '@requests/common/emp/subtasks/control-activities';
import { controlActivitiesDocumentationFormProvider } from '@requests/common/emp/subtasks/control-activities/control-activities-documentation/control-activities-documentation.form-provider';
import { controlActivitiesMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { TASK_FORM } from '@requests/common/task-form.token';
import { WizardStepComponent } from '@shared/components';

@Component({
  selector: 'mrtm-control-activities-documentation',
  standalone: true,
  imports: [ReactiveFormsModule, EmpProcedureFormComponent, WizardStepComponent, AboutProcedureDetailsComponent],
  providers: [controlActivitiesDocumentationFormProvider],
  templateUrl: './control-activities-documentation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlActivitiesDocumentationComponent {
  protected readonly formGroup = inject<FormGroup<Record<keyof EmpProcedureForm, FormControl>>>(TASK_FORM);
  private readonly service: TaskService<EmpTaskPayload> = inject(TaskService<EmpTaskPayload>);
  private readonly route = inject(ActivatedRoute);

  controlActivitiesMap = controlActivitiesMap;

  onSubmit() {
    this.service
      .saveSubtask(
        CONTROL_ACTIVITIES_SUB_TASK,
        ControlActivitiesWizardStep.DOCUMENTATION,
        this.route,
        this.formGroup.value,
      )
      .subscribe();
  }
}
