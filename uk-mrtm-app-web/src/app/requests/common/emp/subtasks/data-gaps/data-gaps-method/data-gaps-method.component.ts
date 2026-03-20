import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@netz/common/forms';
import { TextareaComponent, TextInputComponent } from '@netz/govuk-components';

import { EmpTaskPayload } from '@requests/common/emp/emp.types';
import { DATA_GAPS_SUB_TASK, DataGapsWizardStep } from '@requests/common/emp/subtasks/data-gaps';
import { dataGapsMethodFormProvider } from '@requests/common/emp/subtasks/data-gaps/data-gaps-method/data-gaps-method.form-provider';
import { dataGapsMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { TASK_FORM } from '@requests/common/task-form.token';
import { WizardStepComponent } from '@shared/components';

@Component({
  selector: 'mrtm-data-gaps-method',
  imports: [WizardStepComponent, ReactiveFormsModule, TextareaComponent, TextInputComponent],
  standalone: true,
  templateUrl: './data-gaps-method.component.html',
  providers: [dataGapsMethodFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataGapsMethodComponent {
  protected readonly form: UntypedFormGroup = inject(TASK_FORM);
  private readonly service: TaskService<EmpTaskPayload> = inject(TaskService<EmpTaskPayload>);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  protected readonly dataGapsMap = dataGapsMap;

  onSubmit() {
    this.service
      .saveSubtask(DATA_GAPS_SUB_TASK, DataGapsWizardStep.DATA_GAPS_METHOD, this.route, this.form.value)
      .subscribe();
  }
}
