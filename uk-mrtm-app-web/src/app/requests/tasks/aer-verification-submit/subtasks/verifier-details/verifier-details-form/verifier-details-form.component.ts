import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { take } from 'rxjs';

import { TaskService } from '@netz/common/forms';
import { RequestTaskStore } from '@netz/common/store';
import { LinkDirective, TextareaComponent, TextInputComponent } from '@netz/govuk-components';

import { TASK_FORM } from '@requests/common';
import { VERIFIER_DETAILS_SUB_TASK, verifierDetailsMap, VerifierDetailsStep } from '@requests/common/aer';
import { AerVerificationSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { aerVerificationSubmitQuery } from '@requests/tasks/aer-verification-submit/+state/aer-verification-submit.selectors';
import { verifierDetailsFormProvider } from '@requests/tasks/aer-verification-submit/subtasks/verifier-details/verifier-details-form/verifier-details-form.form-provider';
import { VerificationBodyDetailsSummaryTemplateComponent, WizardStepComponent } from '@shared/components';

@Component({
  selector: 'mrtm-verifier-details-form',
  standalone: true,
  imports: [
    LinkDirective,
    TextareaComponent,
    TextInputComponent,
    ReactiveFormsModule,
    WizardStepComponent,
    VerificationBodyDetailsSummaryTemplateComponent,
  ],
  templateUrl: './verifier-details-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [verifierDetailsFormProvider],
})
export class VerifierDetailsFormComponent {
  readonly map = verifierDetailsMap;
  readonly formGroup = inject<FormGroup>(TASK_FORM);
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(TaskService<AerVerificationSubmitTaskPayload>);
  private readonly store = inject(RequestTaskStore);
  readonly verifierDetails = this.store.select(aerVerificationSubmitQuery.selectVerifierDetails);

  onSubmit() {
    this.service
      .saveSubtask(VERIFIER_DETAILS_SUB_TASK, VerifierDetailsStep.FORM, this.route, this.formGroup.value)
      .pipe(take(1))
      .subscribe();
  }
}
