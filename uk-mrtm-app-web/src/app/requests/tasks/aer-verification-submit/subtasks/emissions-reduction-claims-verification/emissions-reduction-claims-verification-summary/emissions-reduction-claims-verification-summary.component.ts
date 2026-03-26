import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { PendingButtonDirective } from '@netz/common/directives';
import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { ButtonDirective } from '@netz/govuk-components';

import { aerCommonQuery } from '@requests/common/aer/+state';
import { AerVerificationSubmitTaskPayload } from '@requests/common/aer/aer.types';
import {
  EMISSIONS_REDUCTION_CLAIMS_VERIFICATION_SUB_TASK,
  EmissionsReductionClaimsVerificationStep,
  emissionsReductionClaimVerificationSubtaskListMap,
} from '@requests/common/aer/subtasks/emissions-reduction-claim-verification';
import { aerVerificationSubmitQuery } from '@requests/tasks/aer-verification-submit/+state/aer-verification-submit.selectors';
import { EmissionsReductionClaimsVerificationSummaryTemplateComponent } from '@shared/components';

@Component({
  selector: 'mrtm-emissions-reduction-claims-verification-summary',
  imports: [
    PageHeadingComponent,
    ReturnToTaskOrActionPageComponent,
    PendingButtonDirective,
    ButtonDirective,
    EmissionsReductionClaimsVerificationSummaryTemplateComponent,
  ],
  standalone: true,
  templateUrl: './emissions-reduction-claims-verification-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmissionsReductionClaimsVerificationSummaryComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(TaskService<AerVerificationSubmitTaskPayload>);
  private readonly store = inject(RequestTaskStore);

  readonly subtask = EMISSIONS_REDUCTION_CLAIMS_VERIFICATION_SUB_TASK;
  readonly wizardStep = EmissionsReductionClaimsVerificationStep;
  readonly map = emissionsReductionClaimVerificationSubtaskListMap;

  readonly isEditable = this.store.select(requestTaskQuery.selectIsEditable);
  readonly isSubtaskCompleted = this.store.select(aerCommonQuery.selectIsSubtaskCompleted(this.subtask));

  readonly emissionsReductionClaimVerification = this.store.select(
    aerVerificationSubmitQuery.selectEmissionsReductionClaimVerification,
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
