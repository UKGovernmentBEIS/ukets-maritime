import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { ButtonDirective } from '@netz/govuk-components';

import {
  OVERALL_VERIFICATION_DECISION_SUB_TASK,
  overallVerificationDecisionMap,
  OverallVerificationDecisionStep,
} from '@requests/common/aer';
import { aerCommonQuery } from '@requests/common/aer/+state';
import { AerVerificationSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { aerVerificationSubmitQuery } from '@requests/tasks/aer-verification-submit/+state/aer-verification-submit.selectors';
import { AerOverallVerificationDecisionSummaryTemplateComponent } from '@shared/components/summaries';

@Component({
  selector: 'mrtm-overall-verification-decision-summary',
  imports: [
    ButtonDirective,
    PageHeadingComponent,
    ReturnToTaskOrActionPageComponent,
    AerOverallVerificationDecisionSummaryTemplateComponent,
  ],
  standalone: true,
  templateUrl: './overall-verification-decision-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverallVerificationDecisionSummaryComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(TaskService<AerVerificationSubmitTaskPayload>);
  private readonly store = inject(RequestTaskStore);

  readonly subtask = OVERALL_VERIFICATION_DECISION_SUB_TASK;
  readonly wizardStep = OverallVerificationDecisionStep;
  readonly map = overallVerificationDecisionMap;

  readonly isEditable = this.store.select(requestTaskQuery.selectIsEditable);
  readonly isSubtaskCompleted = this.store.select(aerCommonQuery.selectIsSubtaskCompleted(this.subtask));

  readonly overallVerificationDecision = this.store.select(
    aerVerificationSubmitQuery.selectOverallVerificationDecision,
  );

  constructor() {
    if (this.route.snapshot.queryParams?.['change'] === 'true') {
      this.router.navigate([], { queryParams: { change: null }, queryParamsHandling: 'merge', replaceUrl: true });
    }
  }

  onSubmit(): void {
    this.service.submitSubtask(this.subtask, this.wizardStep?.SUMMARY ?? '../', this.route).subscribe();
  }
}
