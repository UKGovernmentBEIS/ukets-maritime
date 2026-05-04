import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import {
  FieldsetDirective,
  LegendDirective,
  RadioComponent,
  RadioOptionComponent,
  TextareaComponent,
} from '@netz/govuk-components';

import { TASK_FORM } from '@requests/common/task-form.token';
import { PeerReviewStore } from '@requests/tasks/notification-peer-review/+state/peer-review.store';
import { peerReviewDecisionFormProvider } from '@requests/tasks/notification-peer-review/peer-review-decision/peer-review-decision/peer-review-decision.form-provider';
import { WizardStepComponent } from '@shared/components';
import { PeerReviewDecisionPipe } from '@shared/pipes';

@Component({
  selector: 'mrtm-peer-review-decision',
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
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  readonly form: UntypedFormGroup = inject(TASK_FORM);
  private readonly store = inject(PeerReviewStore);

  onSubmit() {
    this.store.setDecision({ ...this.form.value, isSubmitted: false });
    this.router.navigate(['summary'], { relativeTo: this.route });
  }
}
