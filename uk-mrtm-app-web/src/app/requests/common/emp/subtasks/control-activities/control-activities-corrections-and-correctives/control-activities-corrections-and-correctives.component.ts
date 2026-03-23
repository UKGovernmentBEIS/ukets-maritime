import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { EmpProcedureForm } from '@mrtm/api';

import { TaskService } from '@netz/common/forms';

import { AboutProcedureDetailsComponent } from '@requests/common/emp/components';
import { EmpProcedureFormComponent } from '@requests/common/emp/components/emp-procedure-form/emp-procedure-form.component';
import { EmpTaskPayload } from '@requests/common/emp/emp.types';
import {
  CONTROL_ACTIVITIES_SUB_TASK,
  ControlActivitiesWizardStep,
} from '@requests/common/emp/subtasks/control-activities';
import { controlActivitiesCorrectionsAndCorrectivesFormProvider } from '@requests/common/emp/subtasks/control-activities/control-activities-corrections-and-correctives/control-activities-corrections-and-correctives.form-provider';
import { controlActivitiesMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { TASK_FORM } from '@requests/common/task-form.token';
import { WizardStepComponent } from '@shared/components';

@Component({
  selector: 'mrtm-control-activities-corrections-and-correctives',
  standalone: true,
  imports: [ReactiveFormsModule, EmpProcedureFormComponent, WizardStepComponent, AboutProcedureDetailsComponent],
  providers: [controlActivitiesCorrectionsAndCorrectivesFormProvider],
  templateUrl: './control-activities-corrections-and-correctives.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlActivitiesCorrectionsAndCorrectivesComponent {
  public readonly formGroup = inject<FormGroup<Record<keyof EmpProcedureForm, FormControl>>>(TASK_FORM);
  private readonly service: TaskService<EmpTaskPayload> = inject(TaskService<EmpTaskPayload>);
  private readonly route = inject(ActivatedRoute);
  public readonly controlActivitiesMap = controlActivitiesMap;

  onSubmit() {
    this.service
      .saveSubtask(
        CONTROL_ACTIVITIES_SUB_TASK,
        ControlActivitiesWizardStep.CORRECTIONS,
        this.route,
        this.formGroup.value,
      )
      .subscribe();
  }
}
