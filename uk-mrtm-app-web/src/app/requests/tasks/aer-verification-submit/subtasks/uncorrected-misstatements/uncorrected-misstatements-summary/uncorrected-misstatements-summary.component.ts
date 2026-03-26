import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { PendingButtonDirective } from '@netz/common/directives';
import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { ButtonDirective } from '@netz/govuk-components';

import {
  UNCORRECTED_MISSTATEMENTS_SUB_TASK,
  uncorrectedMisstatementsMap,
  UncorrectedMisstatementsStep,
} from '@requests/common/aer';
import { aerCommonQuery } from '@requests/common/aer/+state';
import { AerVerificationSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { aerVerificationSubmitQuery } from '@requests/tasks/aer-verification-submit/+state/aer-verification-submit.selectors';
import { UncorrectedMisstatementsSummaryTemplateComponent } from '@shared/components/summaries';

@Component({
  selector: 'mrtm-uncorrected-misstatements-summary',
  imports: [
    ButtonDirective,
    PageHeadingComponent,
    ReturnToTaskOrActionPageComponent,
    UncorrectedMisstatementsSummaryTemplateComponent,
    PendingButtonDirective,
  ],
  standalone: true,
  templateUrl: './uncorrected-misstatements-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UncorrectedMisstatementsSummaryComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(TaskService<AerVerificationSubmitTaskPayload>);
  private readonly store = inject(RequestTaskStore);

  readonly subtask = UNCORRECTED_MISSTATEMENTS_SUB_TASK;
  readonly wizardStep = UncorrectedMisstatementsStep;
  readonly map = uncorrectedMisstatementsMap;

  readonly isEditable = this.store.select(requestTaskQuery.selectIsEditable);
  readonly isSubtaskCompleted = this.store.select(aerCommonQuery.selectIsSubtaskCompleted(this.subtask));

  readonly uncorrectedMisstatements = this.store.select(aerVerificationSubmitQuery.selectUncorrectedMisstatements);

  constructor() {
    if (this.route.snapshot.queryParams?.['change'] === 'true') {
      this.router.navigate([], { queryParams: { change: null }, queryParamsHandling: 'merge', replaceUrl: true });
    }
  }

  onSubmit(): void {
    this.service.submitSubtask(this.subtask, this.wizardStep?.SUMMARY ?? '../', this.route).subscribe();
  }
}
