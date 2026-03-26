import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@netz/common/forms';
import {
  CheckboxComponent,
  CheckboxesComponent,
  ConditionalContentDirective,
  TextareaComponent,
} from '@netz/govuk-components';

import { EmpVariationTaskPayload } from '@requests/common/emp/emp.types';
import { variationDetailsSubtaskMap } from '@requests/common/emp/subtasks/subtask-list.map';
import {
  VARIATION_DETAILS_SUB_TASK,
  VariationDetailsWizardStep,
} from '@requests/common/emp/subtasks/variation-details/variation-details.helper';
import { variationDetailsFormProvider } from '@requests/common/emp/subtasks/variation-details/variation-details/variation-details.form-provider';
import { EmpVariationDetailsFormModel } from '@requests/common/emp/subtasks/variation-details/variation-details/variation-details.types';
import { TASK_FORM } from '@requests/common/task-form.token';
import { WizardStepComponent } from '@shared/components';
import {
  EMP_VARIATION_NON_SIGNIFICANT_CHANGES_SELECT_OPTIONS,
  EMP_VARIATION_SIGNIFICANT_CHANGES_SELECT_OPTIONS,
} from '@shared/constants';
import { SubTaskListMap } from '@shared/types';

@Component({
  selector: 'mrtm-variation-details',
  imports: [
    ReactiveFormsModule,
    WizardStepComponent,
    TextareaComponent,
    CheckboxesComponent,
    CheckboxComponent,
    ConditionalContentDirective,
  ],
  standalone: true,
  templateUrl: './variation-details.component.html',
  providers: [variationDetailsFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VariationDetailsComponent {
  public readonly form: FormGroup<EmpVariationDetailsFormModel> = inject(TASK_FORM);
  private readonly service: TaskService<EmpVariationTaskPayload> = inject(TaskService<EmpVariationTaskPayload>);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  taskMap: SubTaskListMap<Pick<EmpVariationTaskPayload, 'empVariationDetails'>> = variationDetailsSubtaskMap;
  significantChangesOptions = EMP_VARIATION_SIGNIFICANT_CHANGES_SELECT_OPTIONS;
  nonSignificantChangesOptions = EMP_VARIATION_NON_SIGNIFICANT_CHANGES_SELECT_OPTIONS;

  onSubmit() {
    this.service
      .saveSubtask(
        VARIATION_DETAILS_SUB_TASK,
        VariationDetailsWizardStep.DESCRIBE_CHANGES,
        this.activatedRoute,
        this.form.value,
      )
      .subscribe();
  }
}
