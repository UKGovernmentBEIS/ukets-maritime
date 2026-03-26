import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@netz/common/forms';
import {
  FieldsetDirective,
  LegendDirective,
  RadioComponent,
  RadioOptionComponent,
  TextareaComponent,
} from '@netz/govuk-components';

import {
  PEER_REVIEW_DECISION_SUB_TASK,
  PeerReviewWizardStep,
} from '@requests/common/subtasks/peer-review-decision/peer-review-decision.helper';
import { PEER_REVIEW_DECISION_TEXT_MAP } from '@requests/common/subtasks/peer-review-decision/peer-review-decision.providers';
import { peerReviewDecisionFormProvider } from '@requests/common/subtasks/peer-review-decision/peer-review-decision/peer-review-decision.form-provider';
import { TASK_FORM } from '@requests/common/task-form.token';
import { WizardStepComponent } from '@shared/components';
import { PeerReviewDecisionPipe } from '@shared/pipes';

@Component({
  selector: 'mrtm-emp-peer-review-decision',
  imports: [
    ReactiveFormsModule,
    WizardStepComponent,
    RadioComponent,
    RadioOptionComponent,
    LegendDirective,
    TextareaComponent,
    FieldsetDirective,
    PeerReviewDecisionPipe,
  ],
  standalone: true,
  templateUrl: './peer-review-decision.component.html',
  providers: [peerReviewDecisionFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeerReviewDecisionComponent {
  private readonly service: TaskService<any> = inject(TaskService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  readonly form: UntypedFormGroup = inject(TASK_FORM);
  readonly map = inject(PEER_REVIEW_DECISION_TEXT_MAP);

  onSubmit() {
    this.service
      .saveSubtask(PEER_REVIEW_DECISION_SUB_TASK, PeerReviewWizardStep.DECISION, this.route, this.form.value)
      .subscribe();
  }
}
