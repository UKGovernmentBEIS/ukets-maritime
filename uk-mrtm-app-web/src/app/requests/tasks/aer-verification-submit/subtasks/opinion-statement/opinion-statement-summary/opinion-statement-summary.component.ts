import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { ButtonDirective } from '@netz/govuk-components';

import { OPINION_STATEMENT_SUB_TASK, opinionStatementMap, OpinionStatementStep } from '@requests/common/aer';
import { aerCommonQuery } from '@requests/common/aer/+state';
import { AerVerificationSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { aerVerificationSubmitQuery } from '@requests/tasks/aer-verification-submit/+state/aer-verification-submit.selectors';
import { OpinionStatementSummaryTemplateComponent } from '@shared/components';

@Component({
  selector: 'mrtm-opinion-statement-summary',
  imports: [
    ButtonDirective,
    PageHeadingComponent,
    ReturnToTaskOrActionPageComponent,
    OpinionStatementSummaryTemplateComponent,
  ],
  standalone: true,
  templateUrl: './opinion-statement-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpinionStatementSummaryComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(TaskService<AerVerificationSubmitTaskPayload>);
  private readonly store = inject(RequestTaskStore);

  readonly subtask = OPINION_STATEMENT_SUB_TASK;
  readonly wizardStep = OpinionStatementStep;
  readonly map = opinionStatementMap;

  readonly isEditable = this.store.select(requestTaskQuery.selectIsEditable);
  readonly isSubtaskCompleted = this.store.select(aerCommonQuery.selectIsSubtaskCompleted(this.subtask));

  readonly opinionStatement = this.store.select(aerVerificationSubmitQuery.selectOpinionStatement);
  readonly totalEmissions = this.store.select(aerCommonQuery.selectTotalEmissions);
  readonly monitoringPlanVersion = this.store.select(aerCommonQuery.selectMonitoringPlanVersion);
  readonly monitoringPlanChanges = this.store.select(aerCommonQuery.selectMonitoringPlanChanges);

  constructor() {
    if (this.route.snapshot.queryParams?.['change'] === 'true') {
      this.router.navigate([], { queryParams: { change: null }, queryParamsHandling: 'merge', replaceUrl: true });
    }
  }

  onSubmit(): void {
    this.service.submitSubtask(this.subtask, this.wizardStep?.SUMMARY ?? '../', this.route).subscribe();
  }
}
