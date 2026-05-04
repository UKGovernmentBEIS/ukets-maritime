import { ChangeDetectionStrategy, Component, effect, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@netz/common/forms';
import { RadioComponent, RadioOptionComponent } from '@netz/govuk-components';

import {
  AboutProcedureDetailsComponent,
  EmpProcedureFormComponent,
  getEmpProcedureFormGroup,
} from '@requests/common/emp/components';
import { EmpTaskPayload } from '@requests/common/emp/emp.types';
import {
  CONTROL_ACTIVITIES_SUB_TASK,
  ControlActivitiesWizardStep,
} from '@requests/common/emp/subtasks/control-activities';
import { controlActivitiesOutsourcedActivitiesFormProvider } from '@requests/common/emp/subtasks/control-activities/control-activities-outsourced-activities/control-activities-outsourced-activities.form-provider';
import { controlActivitiesMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { TASK_FORM } from '@requests/common/task-form.token';
import { WizardStepComponent } from '@shared/components';

@Component({
  selector: 'mrtm-control-activities-outsourced-activities',
  imports: [
    ReactiveFormsModule,
    AboutProcedureDetailsComponent,
    EmpProcedureFormComponent,
    WizardStepComponent,
    RadioComponent,
    RadioOptionComponent,
  ],
  standalone: true,
  templateUrl: './control-activities-outsourced-activities.component.html',
  providers: [controlActivitiesOutsourcedActivitiesFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlActivitiesOutsourcedActivitiesComponent {
  protected readonly formGroup = inject<UntypedFormGroup>(TASK_FORM);
  private readonly service: TaskService<EmpTaskPayload> = inject(TaskService<EmpTaskPayload>);
  private readonly route = inject(ActivatedRoute);

  controlActivitiesMap = controlActivitiesMap;
  readonly existCtrlValue: Signal<boolean> = toSignal(this.existCtrl.valueChanges, {
    initialValue: this.existCtrl.value,
  });

  constructor() {
    effect(() => {
      if (this.existCtrlValue() === true) {
        this.formGroup.addControl('details', new UntypedFormGroup(getEmpProcedureFormGroup()), { emitEvent: true });
      } else {
        this.formGroup.removeControl('details', { emitEvent: true });
      }
      this.formGroup.updateValueAndValidity({ emitEvent: true });
    });
  }

  get existCtrl(): UntypedFormControl {
    return this.formGroup.get('exist') as UntypedFormControl;
  }

  onSubmit() {
    this.service
      .saveSubtask(
        CONTROL_ACTIVITIES_SUB_TASK,
        ControlActivitiesWizardStep.OUTSOURCED_ACTIVITIES,
        this.route,
        this.formGroup.value,
      )
      .subscribe();
  }
}
