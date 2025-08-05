import { inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { EmpProcedureForm } from '@mrtm/api';

import { TaskService } from '@netz/common/forms';

import { EmpTaskPayload } from '@requests/common/emp/emp.types';
import { TASK_FORM } from '@requests/common/task-form.token';

export abstract class EmpProcedureWizardStepAbstract {
  public readonly formGroup = inject<FormGroup<Record<keyof EmpProcedureForm, FormControl>>>(TASK_FORM);
  private readonly service: TaskService<EmpTaskPayload> = inject(TaskService<EmpTaskPayload>);
  private readonly route = inject(ActivatedRoute);

  public abstract subtask: string;
  public abstract step: string;

  onSubmit() {
    this.service.saveSubtask(this.subtask, this.step, this.route, this.formGroup.value).subscribe();
  }
}
