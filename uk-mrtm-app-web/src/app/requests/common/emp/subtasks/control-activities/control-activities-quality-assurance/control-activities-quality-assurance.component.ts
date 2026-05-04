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
import { controlActivitiesQualityAssuranceFormProvider } from '@requests/common/emp/subtasks/control-activities/control-activities-quality-assurance/control-activities-quality-assurance.form-provider';
import { controlActivitiesMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { TASK_FORM } from '@requests/common/task-form.token';
import { WizardStepComponent } from '@shared/components';

@Component({
  selector: 'mrtm-control-activities-quality-assurance',
  imports: [WizardStepComponent, ReactiveFormsModule, EmpProcedureFormComponent, AboutProcedureDetailsComponent],
  standalone: true,
  templateUrl: './control-activities-quality-assurance.component.html',
  providers: [controlActivitiesQualityAssuranceFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlActivitiesQualityAssuranceComponent {
  protected readonly formGroup = inject<FormGroup<Record<keyof EmpProcedureForm, FormControl>>>(TASK_FORM);
  private readonly service: TaskService<EmpTaskPayload> = inject(TaskService<EmpTaskPayload>);
  private readonly route = inject(ActivatedRoute);

  controlActivitiesMap = controlActivitiesMap;

  onSubmit() {
    this.service
      .saveSubtask(
        CONTROL_ACTIVITIES_SUB_TASK,
        ControlActivitiesWizardStep.QUALITY_ASSURANCE,
        this.route,
        this.formGroup.value,
      )
      .subscribe();
  }
}
