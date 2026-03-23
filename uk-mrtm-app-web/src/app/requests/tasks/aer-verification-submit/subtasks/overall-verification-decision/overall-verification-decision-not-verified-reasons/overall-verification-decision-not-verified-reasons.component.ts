import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { take } from 'rxjs';

import { TaskService } from '@netz/common/forms';
import {
  CheckboxComponent,
  CheckboxesComponent,
  ConditionalContentDirective,
  TextareaComponent,
} from '@netz/govuk-components';

import { TASK_FORM } from '@requests/common';
import {
  OVERALL_VERIFICATION_DECISION_SUB_TASK,
  overallVerificationDecisionMap,
  OverallVerificationDecisionStep,
} from '@requests/common/aer';
import { AerVerificationSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { overallVerificationDecisionNotVerifiedReasonsProvider } from '@requests/tasks/aer-verification-submit/subtasks/overall-verification-decision/overall-verification-decision-not-verified-reasons/overall-verification-decision-not-verified-reasons.form-provider';
import { WizardStepComponent } from '@shared/components';
import { NotVerifiedReasonTypePipe } from '@shared/pipes';

@Component({
  selector: 'mrtm-overall-verification-decision-not-verified-reasons',
  standalone: true,
  imports: [
    ConditionalContentDirective,
    CheckboxesComponent,
    CheckboxComponent,
    ReactiveFormsModule,
    TextareaComponent,
    WizardStepComponent,
    NotVerifiedReasonTypePipe,
  ],
  templateUrl: './overall-verification-decision-not-verified-reasons.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [overallVerificationDecisionNotVerifiedReasonsProvider],
})
export class OverallVerificationDecisionNotVerifiedReasonsComponent {
  readonly map = overallVerificationDecisionMap;
  readonly formGroup = inject<FormGroup>(TASK_FORM);
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(TaskService<AerVerificationSubmitTaskPayload>);

  onSubmit() {
    this.service
      .saveSubtask(
        OVERALL_VERIFICATION_DECISION_SUB_TASK,
        OverallVerificationDecisionStep.NOT_VERIFIED_REASONS,
        this.route,
        this.formGroup.value,
      )
      .pipe(take(1))
      .subscribe();
  }
}
