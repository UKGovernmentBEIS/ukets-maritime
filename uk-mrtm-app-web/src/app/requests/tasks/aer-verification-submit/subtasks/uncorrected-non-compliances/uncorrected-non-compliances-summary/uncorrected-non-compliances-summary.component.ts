import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { PendingButtonDirective } from '@netz/common/directives';
import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { ButtonDirective } from '@netz/govuk-components';

import {
  UNCORRECTED_NON_COMPLIANCES_SUB_TASK,
  uncorrectedNonCompliancesMap,
  UncorrectedNonCompliancesStep,
} from '@requests/common/aer';
import { aerCommonQuery } from '@requests/common/aer/+state';
import { AerVerificationSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { aerVerificationSubmitQuery } from '@requests/tasks/aer-verification-submit/+state/aer-verification-submit.selectors';
import { UncorrectedNonCompliancesSummaryTemplateComponent } from '@shared/components/summaries';

@Component({
  selector: 'mrtm-uncorrected-non-compliances-summary',
  imports: [
    ButtonDirective,
    PageHeadingComponent,
    ReturnToTaskOrActionPageComponent,
    UncorrectedNonCompliancesSummaryTemplateComponent,
    PendingButtonDirective,
  ],
  standalone: true,
  templateUrl: './uncorrected-non-compliances-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UncorrectedNonCompliancesSummaryComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(TaskService<AerVerificationSubmitTaskPayload>);
  private readonly store = inject(RequestTaskStore);

  readonly subtask = UNCORRECTED_NON_COMPLIANCES_SUB_TASK;
  readonly wizardStep = UncorrectedNonCompliancesStep;
  readonly map = uncorrectedNonCompliancesMap;

  readonly isEditable = this.store.select(requestTaskQuery.selectIsEditable);
  readonly isSubtaskCompleted = this.store.select(aerCommonQuery.selectIsSubtaskCompleted(this.subtask));

  readonly uncorrectedNonCompliances = this.store.select(aerVerificationSubmitQuery.selectUncorrectedNonCompliances);

  constructor() {
    if (this.route.snapshot.queryParams?.['change'] === 'true') {
      this.router.navigate([], { queryParams: { change: null }, queryParamsHandling: 'merge', replaceUrl: true });
    }
  }

  onSubmit(): void {
    this.service.submitSubtask(this.subtask, this.wizardStep?.SUMMARY ?? '../', this.route).subscribe();
  }
}
