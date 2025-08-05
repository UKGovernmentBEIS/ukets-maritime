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
import { EMISSION_SOURCES_SUB_TASK, EmissionSourcesWizardStep } from '@requests/common/emp/subtasks/emission-sources';
import { emissionSourcesFactorsFormProvider } from '@requests/common/emp/subtasks/emission-sources/emission-sources-factors/emission-sources-factors.form-provider';
import { emissionSourcesMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { TASK_FORM } from '@requests/common/task-form.token';
import { WizardStepComponent } from '@shared/components';

@Component({
  selector: 'mrtm-emission-sources-factors',
  standalone: true,
  imports: [
    EmpProcedureFormComponent,
    RadioOptionComponent,
    AboutProcedureDetailsComponent,
    WizardStepComponent,
    RadioComponent,
    ReactiveFormsModule,
  ],
  providers: [emissionSourcesFactorsFormProvider],
  templateUrl: './emission-sources-factors.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmissionSourcesFactorsComponent {
  protected readonly formGroup = inject<UntypedFormGroup>(TASK_FORM);
  private readonly service: TaskService<EmpTaskPayload> = inject(TaskService<EmpTaskPayload>);
  private readonly route = inject(ActivatedRoute);

  emissionSourcesMap = emissionSourcesMap;
  existCtrlValue: Signal<boolean> = toSignal(this.existCtrl.valueChanges, {
    initialValue: this.existCtrl.value,
  });

  constructor() {
    effect(() => {
      if (this.existCtrlValue() === false) {
        this.formGroup.addControl('factors', new UntypedFormGroup(getEmpProcedureFormGroup()), { emitEvent: true });
      } else {
        this.formGroup.removeControl('factors', { emitEvent: true });
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
        EMISSION_SOURCES_SUB_TASK,
        EmissionSourcesWizardStep.EMISSION_FACTORS,
        this.route,
        this.formGroup.value,
      )
      .subscribe();
  }
}
