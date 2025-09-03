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
import { emissionSourcesComplianceFormProvider } from '@requests/common/emp/subtasks/emission-sources/emission-sources-compliance/emission-sources-compliance.form-provider';
import { emissionSourcesMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { TASK_FORM } from '@requests/common/task-form.token';
import { WizardStepComponent } from '@shared/components';

@Component({
  selector: 'mrtm-emission-sources-compliance',
  standalone: true,
  imports: [
    EmpProcedureFormComponent,
    RadioOptionComponent,
    AboutProcedureDetailsComponent,
    WizardStepComponent,
    RadioComponent,
    ReactiveFormsModule,
  ],
  providers: [emissionSourcesComplianceFormProvider],
  templateUrl: './emission-sources-compliance.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmissionSourcesComplianceComponent {
  public readonly formGroup = inject<UntypedFormGroup>(TASK_FORM);
  private readonly service: TaskService<EmpTaskPayload> = inject(TaskService<EmpTaskPayload>);
  private readonly route = inject(ActivatedRoute);

  public readonly emissionSourcesMap = emissionSourcesMap;
  existCtrlValue: Signal<boolean> = toSignal(this.existCtrl.valueChanges, {
    initialValue: this.existCtrl.value,
  });

  constructor() {
    effect(() => {
      if (this.existCtrlValue() === true) {
        this.formGroup.addControl('criteria', new UntypedFormGroup(getEmpProcedureFormGroup()), { emitEvent: true });
      } else {
        this.formGroup.removeControl('criteria', { emitEvent: true });
      }
      this.formGroup.updateValueAndValidity({ emitEvent: true });
    });
  }

  get existCtrl(): UntypedFormControl {
    return this.formGroup.get('exist') as UntypedFormControl;
  }

  public onSubmit(): void {
    this.service
      .saveSubtask(
        EMISSION_SOURCES_SUB_TASK,
        EmissionSourcesWizardStep.EMISSION_COMPLIANCE,
        this.route,
        this.formGroup.value,
      )
      .subscribe();
  }
}
