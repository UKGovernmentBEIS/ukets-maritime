import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@netz/common/forms';
import {
  ConditionalContentDirective,
  RadioComponent,
  RadioOptionComponent,
  TextareaComponent,
} from '@netz/govuk-components';

import { EmpVariationRegulatorTaskPayload, EmpVariationTaskPayload } from '@requests/common/emp/emp.types';
import { variationDetailsSubtaskMap } from '@requests/common/emp/subtasks/subtask-list.map';
import {
  VARIATION_DETAILS_SUB_TASK,
  VariationDetailsWizardStep,
} from '@requests/common/emp/subtasks/variation-details/variation-details.helper';
import { variationDetailsReasonNoticeFormProvider } from '@requests/common/emp/subtasks/variation-details/variation-details-reason-notice/variation-details-reason-notice.form-provider';
import { EmpVariationDetailsReasonNoticeFormModel } from '@requests/common/emp/subtasks/variation-details/variation-details-reason-notice/variation-details-reason-notice.types';
import { TASK_FORM } from '@requests/common/task-form.token';
import { WizardStepComponent } from '@shared/components';
import { SubTaskListMap } from '@shared/types';

@Component({
  selector: 'mrtm-variation-details',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    WizardStepComponent,
    TextareaComponent,
    ConditionalContentDirective,
    RadioComponent,
    RadioOptionComponent,
  ],
  providers: [variationDetailsReasonNoticeFormProvider],
  templateUrl: './variation-details-reason-notice.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VariationDetailsReasonNoticeComponent {
  protected readonly form: FormGroup<EmpVariationDetailsReasonNoticeFormModel> = inject(TASK_FORM);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly service: TaskService<EmpVariationRegulatorTaskPayload> = inject(
    TaskService<EmpVariationRegulatorTaskPayload>,
  );

  variationDetailsSubtaskMap: SubTaskListMap<
    Pick<EmpVariationTaskPayload, 'empVariationDetails'> &
      Pick<EmpVariationRegulatorTaskPayload, 'reasonRegulatorLed'> & {
        decision: string;
      }
  > = variationDetailsSubtaskMap;

  onSubmit() {
    this.service
      .saveSubtask(
        VARIATION_DETAILS_SUB_TASK,
        VariationDetailsWizardStep.REASON_NOTICE,
        this.activatedRoute,
        this.form.value,
      )
      .subscribe();
  }
}
