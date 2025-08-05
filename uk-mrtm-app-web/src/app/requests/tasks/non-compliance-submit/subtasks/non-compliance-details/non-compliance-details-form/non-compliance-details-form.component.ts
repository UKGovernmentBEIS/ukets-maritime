import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { take } from 'rxjs';

import { TaskService } from '@netz/common/forms';
import { DateInputComponent, GovukSelectOption, SelectComponent, TextareaComponent } from '@netz/govuk-components';

import { TASK_FORM } from '@requests/common';
import {
  NON_COMPLIANCE_DETAILS_SUB_TASK,
  nonComplianceDetailsMap,
  NonComplianceDetailsStep,
  NonComplianceSubmitTaskPayload,
} from '@requests/common/non-compliance';
import { nonComplianceDetailsFormProvider } from '@requests/tasks/non-compliance-submit/subtasks/non-compliance-details/non-compliance-details-form/non-compliance-details-form.form-provider';
import { WizardStepComponent } from '@shared/components';
import { NonComplianceReasonPipe } from '@shared/pipes';
import { NON_COMPLIANCE_REASON_TYPES, NonComplianceReason } from '@shared/types';

@Component({
  selector: 'mrtm-non-compliance-details-form',
  standalone: true,
  imports: [DateInputComponent, SelectComponent, TextareaComponent, ReactiveFormsModule, WizardStepComponent],
  templateUrl: './non-compliance-details-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [nonComplianceDetailsFormProvider],
})
export class NonComplianceDetailsFormComponent {
  readonly map = nonComplianceDetailsMap;
  readonly formGroup = inject<FormGroup>(TASK_FORM);
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(TaskService<NonComplianceSubmitTaskPayload>);
  private readonly nonComplianceReasonPipe = new NonComplianceReasonPipe();

  readonly reasonOptions: GovukSelectOption<NonComplianceReason>[] = NON_COMPLIANCE_REASON_TYPES.map((value) => ({
    value,
    text: this.nonComplianceReasonPipe.transform(value),
  }));

  onSubmit() {
    this.service
      .saveSubtask(
        NON_COMPLIANCE_DETAILS_SUB_TASK,
        NonComplianceDetailsStep.DETAILS_FORM,
        this.route,
        this.formGroup.value,
      )
      .pipe(take(1))
      .subscribe();
  }
}
