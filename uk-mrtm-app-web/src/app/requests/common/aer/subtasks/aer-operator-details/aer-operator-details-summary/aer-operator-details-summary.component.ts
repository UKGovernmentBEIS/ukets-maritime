import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { LimitedCompanyOrganisation } from '@mrtm/api';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { PendingButtonDirective } from '@netz/common/directives';
import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { ButtonDirective } from '@netz/govuk-components';

import { REQUEST_TASK_COMMON_SUBTASK_STEPS_QUERY } from '@requests/+state';
import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import {
  OPERATOR_DETAILS_SUB_TASK,
  operatorDetailsMap,
  OperatorDetailsWizardStep,
} from '@requests/common/components/operator-details';
import { OperatorDetailsSummaryTemplateComponent } from '@shared/components';

@Component({
  selector: 'mrtm-aer-operator-details-summary',
  standalone: true,
  imports: [
    PageHeadingComponent,
    OperatorDetailsSummaryTemplateComponent,
    PendingButtonDirective,
    ButtonDirective,
    ReturnToTaskOrActionPageComponent,
  ],
  templateUrl: './aer-operator-details-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AerOperatorDetailsSummaryComponent {
  private readonly commonSubtaskStepsQuery = inject(REQUEST_TASK_COMMON_SUBTASK_STEPS_QUERY);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(TaskService<AerSubmitTaskPayload>);
  private readonly store = inject(RequestTaskStore);

  readonly subtask = OPERATOR_DETAILS_SUB_TASK;
  readonly wizardStep = OperatorDetailsWizardStep;
  readonly map = operatorDetailsMap;

  readonly isEditable = this.store.select(requestTaskQuery.selectIsEditable);
  readonly isSubtaskCompleted = this.store.select(
    this.commonSubtaskStepsQuery.selectIsSubtaskCompleted(OPERATOR_DETAILS_SUB_TASK),
  );
  readonly operatorDetails = this.store.select(this.commonSubtaskStepsQuery.selectOperatorDetails);
  readonly files = this.store.select(
    this.commonSubtaskStepsQuery.selectAttachedFiles(
      (this.operatorDetails()?.organisationStructure as LimitedCompanyOrganisation)?.evidenceFiles,
    ),
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
